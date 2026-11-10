import type { Session } from '@supabase/supabase-js'
import { useState, type FormEvent } from 'react'
import { AdminExercises } from './AdminExercises'
import { client } from './supabaseClient'

export function AdminLogin({ session, loading, showAdmin, onExerciseSave }: {
  session: Session | null
  loading: boolean
  showAdmin: boolean
  onExerciseSave: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!client || busy) return

    const form = event.currentTarget
    const data = new FormData(form)
    setBusy(true)
    setMessage('')
    try {
      const { error } = await client.auth.signInWithPassword({
        email: String(data.get('email')).trim(),
        password: String(data.get('password')),
      })
      if (error) {
        setMessage(error.code === 'invalid_credentials'
          ? 'Mejladressen eller lösenordet stämmer inte.'
          : 'Det gick inte att logga in. Försök igen.')
      } else {
        form.reset()
      }
    } catch {
      setMessage('Det gick inte att logga in. Försök igen.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    if (!client || busy) return
    setBusy(true)
    setMessage('')
    try {
      const { error } = await client.auth.signOut({ scope: 'local' })
      if (error) setMessage('Det gick inte att logga ut. Försök igen.')
    } catch {
      setMessage('Det gick inte att logga ut. Försök igen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="library admin-panel" aria-labelledby="account-title">
      <h1 id="account-title">{showAdmin ? 'Administration' : session ? 'Mitt konto' : 'Logga in'}</h1>
      {!client && <p>Inloggningen är inte tillgänglig just nu.</p>}
      {loading && <p role="status">Kontrollerar inloggningen…</p>}
      {session && (
        <>
          <p role="status">Du är inloggad.</p>
          <button className="button" type="button" onClick={signOut} disabled={busy}>Logga ut</button>
          <p><a href="#ovningar">Till övningarna</a></p>
          {showAdmin && client && <AdminExercises key={session.user.id} client={client} onSave={onExerciseSave} />}
        </>
      )}
      {client && !loading && !session && (
        <form className="admin-form" onSubmit={signIn}>
          <label>
            Mejladress
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Lösenord
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="button" type="submit" disabled={busy}>{busy ? 'Loggar in…' : 'Logga in'}</button>
        </form>
      )}
      {message && <p role="alert">{message}</p>}
    </section>
  )
}
