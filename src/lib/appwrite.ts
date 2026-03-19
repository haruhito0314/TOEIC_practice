import { Client, Account, Databases } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn(
    "Appwrite variables are missing. Please check your .env.local file."
  );
}

const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);

// Helper constant for Database ID
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
