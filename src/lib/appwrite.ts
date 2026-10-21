import { Account, Client, Databases } from 'appwrite'

type AppwriteConfig = {
  endpoint: string
  projectId: string
  databaseId: string
  profilesCollectionId: string
  extensionsCollectionId: string
  newsCollectionId: string
  utilizationCollectionId: string
  displaysCollectionId: string
}

const appwriteConfig: AppwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT ?? '',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT ?? '',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID ?? '',
  profilesCollectionId: import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID ?? '',
  extensionsCollectionId: import.meta.env.VITE_APPWRITE_EXTENSIONS_COLLECTION_ID ?? '',
  newsCollectionId: import.meta.env.VITE_APPWRITE_NEWS_COLLECTION_ID ?? '',
  utilizationCollectionId: import.meta.env.VITE_APPWRITE_UTILIZATION_COLLECTION_ID ?? '',
  displaysCollectionId: import.meta.env.VITE_APPWRITE_DISPLAYS_COLLECTION_ID ?? '',
}

const client = new Client()

if (appwriteConfig.endpoint && appwriteConfig.projectId) {
  client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId)
} else {
  console.warn(
    'Appwrite endpoint or project ID missing. Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT to enable auth.',
  )
}

const account = new Account(client)
const databases = new Databases(client)

export { account, databases, appwriteConfig }
