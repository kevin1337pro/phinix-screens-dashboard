import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthForm from './AuthForm'

const AuthGate = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-panel loading">
        <div className="auth-spinner" aria-hidden />
        <p>Authentifizierung wird geladen …</p>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <>{children}</>
}

export default AuthGate
