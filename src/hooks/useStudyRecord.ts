// ============================================================
// TOEIC Reading Practice App — Study Record Hook
// LocalStorage + Appwrite クラウド同期のハイブリッド永続化
// ============================================================
import { useState, useCallback, useEffect, useRef } from "react";
import { ID, Query } from "appwrite";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import type { StudyRecord, StudySession, Part } from "@/types/quiz";

const STORAGE_KEY = "toeic-study-record";
const COLLECTION_RECORDS = "study_records";
const COLLECTION_SESSIONS = "study_sessions";

const defaultRecord: StudyRecord = {
  sessions: [],
  bookmarks: [],
  wrongQuestions: [],
  streakDays: 0,
  lastStudyDate: "",
  totalStudySeconds: 0,
};

// ── localStorage helpers ──
function loadLocalRecord(): StudyRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultRecord;
    return { ...defaultRecord, ...JSON.parse(raw) };
  } catch {
    return defaultRecord;
  }
}

function saveLocalRecord(record: StudyRecord) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage full or unavailable
  }
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Appwrite cloud helpers ──
async function fetchCloudRecord(userId: string): Promise<StudyRecord | null> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_RECORDS, [
      Query.equal("userId", userId),
    ]);
    if (res.documents.length === 0) return null;
    const doc = res.documents[0];
    // Also fetch sessions
    const sessionsRes = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_SESSIONS,
      [Query.equal("userId", userId), Query.limit(100), Query.orderDesc("startTime")]
    );
    const sessions: StudySession[] = sessionsRes.documents.map((s: any) => ({
      id: s.sessionId,
      mode: s.mode,
      part: s.part,
      startTime: s.startTime,
      endTime: s.endTime,
      totalQuestions: s.totalQuestions,
      answers: JSON.parse(s.answersJSON || "[]"),
    }));
    return {
      sessions,
      bookmarks: doc.bookmarks || [],
      wrongQuestions: doc.wrongQuestions || [],
      streakDays: doc.streakDays || 0,
      lastStudyDate: doc.lastStudyDate || "",
      totalStudySeconds: doc.totalStudySeconds || 0,
    };
  } catch (err) {
    console.warn("Failed to fetch cloud record", err);
    return null;
  }
}

async function upsertCloudRecord(userId: string, record: StudyRecord) {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_RECORDS, [
      Query.equal("userId", userId),
    ]);
    const payload = {
      userId,
      streakDays: record.streakDays,
      lastStudyDate: record.lastStudyDate,
      totalStudySeconds: record.totalStudySeconds,
      wrongQuestions: record.wrongQuestions,
      bookmarks: record.bookmarks,
    };
    if (res.documents.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_RECORDS,
        res.documents[0].$id,
        payload
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_RECORDS,
        ID.unique(),
        payload
      );
    }
  } catch (err) {
    console.warn("Failed to upsert cloud record", err);
  }
}

async function saveCloudSession(userId: string, session: StudySession) {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_SESSIONS,
      ID.unique(),
      {
        userId,
        sessionId: session.id,
        mode: session.mode || "",
        part: session.part || "",
        startTime: session.startTime,
        endTime: session.endTime || 0,
        totalQuestions: session.totalQuestions,
        answersJSON: JSON.stringify(session.answers),
      }
    );
  } catch (err) {
    console.warn("Failed to save cloud session", err);
  }
}

// Merge local guest data into cloud data
function mergeRecords(local: StudyRecord, cloud: StudyRecord): StudyRecord {
  const mergedBookmarks = [...new Set([...cloud.bookmarks, ...local.bookmarks])];
  const mergedWrong = [...new Set([...cloud.wrongQuestions, ...local.wrongQuestions])];

  // Keep sessions from cloud, add local ones that don't exist in cloud
  const cloudSessionIds = new Set(cloud.sessions.map((s) => s.id));
  const newLocalSessions = local.sessions.filter(
    (s) => !cloudSessionIds.has(s.id)
  );

  return {
    sessions: [...cloud.sessions, ...newLocalSessions],
    bookmarks: mergedBookmarks,
    wrongQuestions: mergedWrong,
    streakDays: Math.max(cloud.streakDays, local.streakDays),
    lastStudyDate:
      cloud.lastStudyDate > local.lastStudyDate
        ? cloud.lastStudyDate
        : local.lastStudyDate,
    totalStudySeconds: cloud.totalStudySeconds + local.totalStudySeconds,
  };
}

// ── Main Hook ──
export function useStudyRecord() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [record, setRecord] = useState<StudyRecord>(loadLocalRecord);
  const hasSyncedRef = useRef(false);

  // Sync with cloud when user logs in
  useEffect(() => {
    if (authLoading || !isLoggedIn || !user || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const syncWithCloud = async () => {
      const cloudRecord = await fetchCloudRecord(user.id);
      const localRecord = loadLocalRecord();
      const hasLocalData =
        localRecord.sessions.length > 0 ||
        localRecord.bookmarks.length > 0 ||
        localRecord.wrongQuestions.length > 0;

      if (cloudRecord && hasLocalData) {
        // Merge local guest data into cloud
        const merged = mergeRecords(localRecord, cloudRecord);
        setRecord(merged);
        saveLocalRecord(merged);
        await upsertCloudRecord(user.id, merged);
        // Upload any local-only sessions to cloud
        const cloudSessionIds = new Set(cloudRecord.sessions.map((s) => s.id));
        for (const session of localRecord.sessions) {
          if (!cloudSessionIds.has(session.id)) {
            await saveCloudSession(user.id, session);
          }
        }
      } else if (cloudRecord) {
        // No local data — use cloud data
        setRecord(cloudRecord);
        saveLocalRecord(cloudRecord);
      } else if (hasLocalData) {
        // No cloud data — upload local data
        await upsertCloudRecord(user.id, localRecord);
        for (const session of localRecord.sessions) {
          await saveCloudSession(user.id, session);
        }
      }
    };

    syncWithCloud();
  }, [authLoading, isLoggedIn, user]);

  // Streak check on mount
  useEffect(() => {
    const today = getTodayString();
    const last = record.lastStudyDate;
    if (last && last !== today) {
      const lastDate = new Date(last);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays > 1) {
        setRecord((prev) => {
          const updated = { ...prev, streakDays: 0 };
          saveLocalRecord(updated);
          return updated;
        });
      }
    }
  }, []);

  const updateRecord = useCallback(
    (updater: (prev: StudyRecord) => StudyRecord) => {
      setRecord((prev) => {
        const updated = updater(prev);
        saveLocalRecord(updated);
        // Fire-and-forget cloud update
        if (user) {
          upsertCloudRecord(user.id, updated);
        }
        return updated;
      });
    },
    [user]
  );

  // Save a completed session
  const saveSession = useCallback(
    (session: StudySession) => {
      const today = getTodayString();
      updateRecord((prev) => {
        const isNewDay = prev.lastStudyDate !== today;
        const newStreakDays = isNewDay
          ? (() => {
              if (!prev.lastStudyDate) return 1;
              const lastDate = new Date(prev.lastStudyDate);
              const todayDate = new Date(today);
              const diffDays = Math.floor(
                (todayDate.getTime() - lastDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return diffDays === 1 ? prev.streakDays + 1 : 1;
            })()
          : prev.streakDays;

        // Update wrong questions
        const newWrongIds = session.answers
          .filter((a) => !a.isCorrect)
          .map((a) => a.questionId);
        const correctIds = session.answers
          .filter((a) => a.isCorrect)
          .map((a) => a.questionId);

        const mergedWrong = [
          ...prev.wrongQuestions.filter((id) => !correctIds.includes(id)),
          ...newWrongIds,
        ];
        const updatedWrong = mergedWrong.filter(
          (id, index) => mergedWrong.indexOf(id) === index
        );

        const sessionDuration = session.endTime
          ? Math.floor((session.endTime - session.startTime) / 1000)
          : 0;

        return {
          ...prev,
          sessions: [...prev.sessions, session],
          wrongQuestions: updatedWrong,
          streakDays: newStreakDays,
          lastStudyDate: today,
          totalStudySeconds: prev.totalStudySeconds + sessionDuration,
        };
      });

      // Also save individual session to cloud
      if (user) {
        saveCloudSession(user.id, session);
      }
    },
    [updateRecord, user]
  );

  // Toggle bookmark
  const toggleBookmark = useCallback(
    (questionId: string) => {
      updateRecord((prev) => {
        const isBookmarked = prev.bookmarks.includes(questionId);
        return {
          ...prev,
          bookmarks: isBookmarked
            ? prev.bookmarks.filter((id) => id !== questionId)
            : [...prev.bookmarks, questionId],
        };
      });
    },
    [updateRecord]
  );

  // Remove from wrong questions
  const removeFromWrong = useCallback(
    (questionId: string) => {
      updateRecord((prev) => ({
        ...prev,
        wrongQuestions: prev.wrongQuestions.filter((id) => id !== questionId),
      }));
    },
    [updateRecord]
  );

  // Reset record
  const resetRecord = useCallback(() => {
    updateRecord(() => defaultRecord);
  }, [updateRecord]);

  // Stats
  const stats = {
    totalSessions: record.sessions.length,
    totalQuestions: record.sessions.reduce(
      (sum, s) => sum + s.answers.length,
      0
    ),
    totalCorrect: record.sessions.reduce(
      (sum, s) => sum + s.answers.filter((a) => a.isCorrect).length,
      0
    ),
    overallAccuracy:
      record.sessions.reduce((sum, s) => sum + s.answers.length, 0) > 0
        ? Math.round(
            (record.sessions.reduce(
              (sum, s) => sum + s.answers.filter((a) => a.isCorrect).length,
              0
            ) /
              record.sessions.reduce(
                (sum, s) => sum + s.answers.length,
                0
              )) *
              100
          )
        : 0,
    partAccuracy: (["part5", "part6", "part7"] as Part[]).reduce(
      (acc, part) => {
        const partAnswers = record.sessions
          .flatMap((s) => s.answers)
          .filter((a) => a.part === part);
        const correct = partAnswers.filter((a) => a.isCorrect).length;
        acc[part] = partAnswers.length > 0
          ? Math.round((correct / partAnswers.length) * 100)
          : 0;
        return acc;
      },
      {} as Record<Part, number>
    ),
    streakDays: record.streakDays,
    totalStudyMinutes: Math.floor(record.totalStudySeconds / 60),
    bookmarkCount: record.bookmarks.length,
    wrongCount: record.wrongQuestions.length,
    recentSessions: record.sessions.slice(-7).reverse(),
  };

  return {
    record,
    stats,
    saveSession,
    toggleBookmark,
    removeFromWrong,
    resetRecord,
    isBookmarked: (id: string) => record.bookmarks.includes(id),
    isWrong: (id: string) => record.wrongQuestions.includes(id),
  };
}
