import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ID } from 'appwrite'
import type { Models } from 'appwrite'
import { account, appwriteConfig, databases } from '../lib/appwrite'
import type { UserRole } from '../types/dashboard'

interface ProfileDocument extends Models.Document {
  role: UserRole
  email: string
  name?: string
}

const FALLBACK_STORAGE_KEY = 'phinix-fallback-session'
const fallbackAdminCredentials = {
  email: import.meta.env.DEV ? (import.meta.env.VITE_DEMO_EMAIL ?? '') : '',
  password: import.meta.env.DEV ? (import.meta.env.VITE_DEMO_PASSWORD ?? '') : '',
  name: 'Phinix Super Admin',
  role: 'admin' as UserRole,
}

const demoEnabled = import.meta.env.DEV && Boolean(fallbackAdminCredentials.email && fallbackAdminCredentials.password)

const isAppwriteConfigured = Boolean(appwriteConfig.endpoint && appwriteConfig.projectId)

interface RegisterPayload {
  email: string
  password: string
  name: string
  role: UserRole
}

interface AuthContextValue {
  user: Models.User<Models.Preferences> | null
  profile: ProfileDocument | null
  role: UserRole | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const missingDatabaseConfig = () =>
  !appwriteConfig.databaseId || !appwriteConfig.profilesCollectionId

const createFallbackUser = (name: string, email: string): Models.User<Models.Preferences> =>
  ({
    $id: 'fallback-admin',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    name,
    email,
    status: 1,
    emailVerification: true,
    phoneVerification: false,
    labels: [],
    prefs: {} as Models.Preferences,
    registration: new Date().toISOString(),
    passwordUpdate: new Date().toISOString(),
    phone: '',
    accessedAt: new Date().toISOString(),
    mfa: false,
    hash: '',
    hashOptions: {},
  } as unknown as Models.User<Models.Preferences>)

const fetchProfile = async (userId: string) => {
  if (missingDatabaseConfig()) {
    console.warn('Appwrite database configuration missing. Profiles cannot be loaded.')
    return null
  }

  try {
    const profile = await databases.getDocument<ProfileDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.profilesCollectionId,
      userId,
    )

    return profile
  } catch (caught: unknown) {
      const error = caught as { code?: number; message?: string } | null
    if (error?.code === 404) {
      return null
    }
    throw error
  }
}

const upsertProfile = async (user: Models.User<Models.Preferences>, role: UserRole) => {
  if (missingDatabaseConfig()) {
    return null
  }

  try {
    const profile = await databases.createDocument<ProfileDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.profilesCollectionId,
      user.$id,
      {
        email: user.email,
        name: user.name,
        role,
      },
    )

    return profile
  } catch (caught: unknown) {
      const error = caught as { code?: number; message?: string } | null
    if (error?.code === 409) {
      const profile = await databases.getDocument<ProfileDocument>(
        appwriteConfig.databaseId,
        appwriteConfig.profilesCollectionId,
        user.$id,
      )

      return profile
    }

    throw error
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [profile, setProfile] = useState<ProfileDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hydrate = useCallback(async () => {
    setLoading(true)
    try {
      if (!isAppwriteConfigured) {
        const stored = typeof window !== 'undefined' ? window.localStorage.getItem(FALLBACK_STORAGE_KEY) : null
        if (demoEnabled && stored) {
          const parsed = JSON.parse(stored) as { email: string; name: string; role: UserRole }
          const fallbackUser = createFallbackUser(parsed.name, parsed.email)
          setUser(fallbackUser)
          setProfile({
            $id: 'fallback-profile',
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            $databaseId: 'fallback',
            $collectionId: 'fallback',
            $sequence: 0,
            role: parsed.role,
            email: parsed.email,
            name: parsed.name,
            $permissions: [],
          })
        } else {
          setUser(null)
          setProfile(null)
        }
        setError(null)
        setLoading(false)
        return
      }

      const current = await account.get()
      setUser(current)
      const currentProfile = await fetchProfile(current.$id)
      setProfile(currentProfile)
      setError(null)
    } catch (caught: unknown) {
      const err = caught as { code?: number; message?: string } | null
      setUser(null)
      setProfile(null)
      if (err?.code && err.code !== 401) {
        setError(err.message ?? 'Unbekannter Fehler beim Laden des Accounts')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      if (!isAppwriteConfigured) {
        if (demoEnabled && email === fallbackAdminCredentials.email && password === fallbackAdminCredentials.password) {
          const fallbackUser = createFallbackUser(fallbackAdminCredentials.name, fallbackAdminCredentials.email)
          const fallbackProfile: ProfileDocument = {
            $id: 'fallback-profile',
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            $databaseId: 'fallback',
            $collectionId: 'fallback',
            $sequence: 0,
            $permissions: [],
            role: fallbackAdminCredentials.role,
            email: fallbackAdminCredentials.email,
            name: fallbackAdminCredentials.name,
          }
          setUser(fallbackUser)
          setProfile(fallbackProfile)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(
              FALLBACK_STORAGE_KEY,
              JSON.stringify({
                email: fallbackAdminCredentials.email,
                name: fallbackAdminCredentials.name,
                role: fallbackAdminCredentials.role,
              }),
            )
          }
          setError(null)
          setLoading(false)
          return
        }

        throw new Error('Anmeldung nicht möglich. Appwrite muss eingerichtet sein; lokale Demo-Zugangsdaten gelten nicht online.')
      }

      await account.createEmailPasswordSession(email, password)
      await hydrate()
    } catch (caught: unknown) {
      const err = caught as { code?: number; message?: string } | null
      setLoading(false)
      setError(err?.message ?? 'Login fehlgeschlagen')
      throw err
    }
  }, [hydrate])

  const register = useCallback(
    async ({ email, password, name }: RegisterPayload) => {
      const role: UserRole = 'guest'
      setLoading(true)
      try {
        if (!isAppwriteConfigured) {
          if (!demoEnabled) throw new Error('Die Registrierung ist noch nicht eingerichtet.')
          const fallbackUser = createFallbackUser(name, email)
          setUser(fallbackUser)
          const fallbackProfile: ProfileDocument = {
            $id: 'fallback-profile',
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            $databaseId: 'fallback',
            $collectionId: 'fallback',
            $sequence: 0,
            $permissions: [],
            role,
            email,
            name,
          }
          setProfile(fallbackProfile)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(
              FALLBACK_STORAGE_KEY,
              JSON.stringify({ email, name, role }),
            )
          }
          setError(null)
          setLoading(false)
          return
        }

        await account.create(ID.unique(), email, password, name)
        await account.createEmailPasswordSession(email, password)
        const current = await account.get()
        setUser(current)
        const profileDoc = await upsertProfile(current, role)
        setProfile(profileDoc)
        setError(null)
      } catch (caught: unknown) {
      const err = caught as { code?: number; message?: string } | null
        setLoading(false)
        setError(err?.message ?? 'Registrierung fehlgeschlagen')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      if (isAppwriteConfigured) {
        await account.deleteSession('current')
      } else {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(FALLBACK_STORAGE_KEY)
        }
      }
      setUser(null)
      setProfile(null)
      setError(null)
    } catch (caught: unknown) {
      const err = caught as { code?: number; message?: string } | null
      setError(err?.message ?? 'Logout fehlgeschlagen')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      error,
      login,
      register,
      logout,
      refresh: hydrate,
    }),
    [error, hydrate, loading, login, logout, profile, register, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
