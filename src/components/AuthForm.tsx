import type { FormEvent } from 'react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'


const AuthForm = () => {
  const { login, register, loading, error } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (!name.trim()) {
          setLocalError('Bitte gib einen Namen an.')
          return
        }
        await register({ email, password, name, role: 'guest' })
      }
    } catch (caught: unknown) {
      const err = caught as { code?: number; message?: string } | null
      setLocalError(err?.message ?? 'Aktion fehlgeschlagen')
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
    setLocalError(null)
  }

  return (
    <div className="auth-panel">
      <div className="auth-header">
        <h1>Phinix Screens Admin</h1>
        <p>
          Melde dich mit deiner Appwrite E-Mail an oder registriere ein neues Gastkonto. Adminrechte werden separat vergeben.
        </p>
        <p className="auth-hint">Der Adminbereich benötigt eine konfigurierte Appwrite-Verbindung.</p>
        <a href="#/screens">Zur öffentlichen Display-Übersicht →</a>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          <span>E-Mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@phinix.media"
          />
        </label>

        <label className="auth-label">
          <span>Passwort</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Mindestens 8 Zeichen"
            minLength={8}
          />
        </label>

        {mode === 'register' && (
          <>
            <label className="auth-label">
              <span>Vollständiger Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Phinix Admin"
              />
            </label>


          </>
        )}

        {(error || localError) && <p className="auth-error">{localError ?? error}</p>}

        <button className="tone-button auth-submit" type="submit" disabled={loading}>
          {loading ? 'Bitte warten …' : mode === 'login' ? 'Anmelden' : 'Registrieren'}
        </button>
      </form>
      <div className="auth-footer">
        <button type="button" onClick={toggleMode} className="auth-toggle">
          {mode === 'login'
            ? 'Neu bei Phinix? Konto erstellen'
            : 'Bereits registriert? Hier anmelden'}
        </button>
      </div>
    </div>
  )
}

export default AuthForm
