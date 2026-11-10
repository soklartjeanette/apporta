import { useId, useState, type FormEvent } from 'react'
import { client } from './supabaseClient'

export function ExerciseNote({ exerciseId, userId, note, onSave }: {
  exerciseId: string
  userId?: string
  note?: string | null
  onSave?: (note: string) => void
}) {
  const titleId = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!client || !userId || !onSave || busy || draft === null) return
    const next = draft.trim()
    setBusy(true)
    setError(false)
    try {
      const key = { user_id: userId, exercise_id: exerciseId }
      const result = next
        ? await client.from('exercise_notes').upsert({ ...key, note: next })
        : await client.from('exercise_notes').delete().match(key)
      if (result.error) throw result.error
      onSave(next)
      setDraft(null)
      setMessage(next ? 'Noteringen har sparats.' : 'Noteringen har tagits bort.')
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="exercise-note" aria-labelledby={titleId}>
      <h4 id={titleId}>Notering</h4>
      {!userId && <p className="exercise-note-text"><em>När jag är inloggad ser jag mina noteringar om övningen här.</em></p>}
      {userId && note === undefined && <p role="status">Hämtar din notering…</p>}
      {userId && note === null && <p className="exercise-note-text">Noteringar är tillfälligt otillgängliga.</p>}
      {userId && typeof note === 'string' && draft === null && <>
        <p className="exercise-note-text">{note || <em>Jag har inte gjort några noteringar om denna övning.</em>}</p>
        <button className="note-edit" type="button" onClick={() => {
          setDraft(note)
          setMessage('')
        }}>{note ? 'Redigera' : 'Lägg till notering'}</button>
      </>}
      {draft !== null && <form onSubmit={save}>
        <label>
          Bara du kan se din notering.
          <textarea aria-label="Notering" rows={3} maxLength={2000} value={draft} disabled={busy}
            onChange={(event) => setDraft(event.target.value)} />
        </label>
        <div className="exercise-actions">
          <button className="button" type="submit" disabled={busy || draft.trim() === note}>
            {!draft.trim() && note ? 'Ta bort notering' : 'Spara notering'}
          </button>
          <button className="note-edit" type="button" disabled={busy} onClick={() => {
            setDraft(null)
            setError(false)
          }}>Avbryt</button>
        </div>
      </form>}
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">Det gick inte att spara ändringen. Försök igen.</p>}
    </section>
  )
}
