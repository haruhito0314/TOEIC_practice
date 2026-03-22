// ============================================================
// TOEIC Reading Practice App — Auth Context
// Appwrite Google OAuth + Email/Password + ゲストモード対応
// ============================================================
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { OAuthProvider, ID } from "appwrite";
import { account } from "@/lib/appwrite";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  guestName: string;
  loginWithGoogle: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  sendPasswordRecoveryEmail: (email: string, resetUrl: string) => Promise<void>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const GUEST_NAME_KEY = "toeic-guest-name";

function getStoredGuestName(): string {
  try {
    return localStorage.getItem(GUEST_NAME_KEY) || "ゲスト";
  } catch {
    return "ゲスト";
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to recover existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const appwriteUser = await account.get();
        setUser({
          id: appwriteUser.$id,
          name: appwriteUser.name || appwriteUser.email.split("@")[0],
          email: appwriteUser.email,
        });
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const loginWithGoogle = useCallback(() => {
    const successUrl = window.location.origin + "/";
    const failureUrl = window.location.origin + "/auth";
    account.createOAuth2Session(OAuthProvider.Google, successUrl, failureUrl);
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const appwriteUser = await account.get();
      setUser({
        id: appwriteUser.$id,
        name: appwriteUser.name || email.split("@")[0],
        email: appwriteUser.email,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signupWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      try {
        // Create the account
        await account.create(ID.unique(), email, password, name);
        // Then log in
        await account.createEmailPasswordSession(email, password);
        const appwriteUser = await account.get();
        setUser({
          id: appwriteUser.$id,
          name: appwriteUser.name || name,
          email: appwriteUser.email,
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const sendPasswordRecoveryEmail = useCallback(async (email: string, resetUrl: string) => {
    setIsLoading(true);
    try {
      await account.createRecovery(email, resetUrl);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (userId: string, secret: string, password: string) => {
    setIsLoading(true);
    try {
      await account.updateRecovery(userId, secret, password);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current");
    } catch {
      // Session might already be expired
    }
    setUser(null);
  }, []);

  const isGuest = user === null;
  const guestName = getStoredGuestName();

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isLoggedIn: user !== null,
        isLoading,
        guestName,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        sendPasswordRecoveryEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
