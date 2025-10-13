import { Client, Account, Databases, Storage } from 'node-appwrite';

// Server-side Appwrite client with API key (for admin operations)
const serverClient = new Client();

serverClient
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!); // Server-side API key

export const serverAccount = new Account(serverClient);
export const serverDatabases = new Databases(serverClient);
export const serverStorage = new Storage(serverClient);

export { serverClient };
