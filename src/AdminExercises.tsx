import type { SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState, type FormEvent } from 'react'
import { InstructionEditor } from './InstructionEditor'
import { SketchEditor } from './SketchEditor'
import type { Sketch } from './ExerciseSketch'

const categories = [
  'Markering', 'Dirigering och linjetag', 'Sök och närsök',
  'Stadga och passivitet', 'Stoppsignal', 'Vattenarbete', 'Ringträning',
]
const difficulties = ['Nybörjare', 'Fortsättning', 'Avancerad']
const fields = 'id,title,category,difficulty,steps,sketch,status,updated_at'

type EditableExercise = {
  id: string
  title: string
  category: string
  difficulty: string
  steps: string[]
  sketch: Sketch | null
  status: 'draft' | 'published'
  updated_at: string
}

export function AdminExercises({ client, onSave }: { client: SupabaseClient, onSave: () => void }) {
  const [exercises, setExercises] = useState<EditableExercise[] | null>(null)
  const [selectedId, setSelectedId] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const selected = exercises?.find((exercise) => exercise.id === selectedId)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      const { data, error } = await client.from('exercises').select(fields)
        .order('title').abortSignal(controller.signal)
      if (controller.signal.aborted) return
      if (error) setErrorMessage('Övningarna kunde inte hämtas. Ladda om sidan för att försöka igen.')
      else setExercises(data)
    }
    void load()
    return () => controller.abort()
  }, [client])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving || !exercises) return

    const form = new FormData(event.currentTarget)
    const submitter = (event.nativeEvent as SubmitEvent).submitter
    let status = selected?.status ?? 'draft'
    if (submitter instanceof HTMLButtonElement && submitter.value === 'publish') status = 'published'
    if (submitter instanceof HTMLButtonElement && submitter.value === 'unpublish') status = 'draft'
    const sketch: Sketch = JSON.parse(String(form.get('sketch')))
    const hasSketch = sketch.points.length > 0 || sketch.arrows.length > 0
    const values = {
      title: String(form.get('title')).trim(),
      category: String(form.get('category')),
      difficulty: String(form.get('difficulty')),
      steps: String(form.get('steps')).split(/\r?\n/).map((step) => step.trim()).filter(Boolean),
      sketch: hasSketch || sketch.caption.trim() ? sketch : null,
      status,
    }
    setMessage('')
    setErrorMessage('')
    if (!values.title || (status === 'published' && (!values.steps.length || !hasSketch))) {
      setErrorMessage('Ange en titel. En publicerad övning behöver också minst ett instruktionssteg och en skiss.')
      return
    }

    setSaving(true)
    try {
      const query = selected
        ? client.from('exercises').update(values).eq('id', selected.id).eq('updated_at', selected.updated_at)
        : client.from('exercises').insert({ ...values, id: crypto.randomUUID() })
      const { data, error } = await query.select(fields).maybeSingle()
      if (error?.code === '42501') {
        setErrorMessage('Ditt konto saknar behörighet att spara övningar.')
      } else if (error) {
        setErrorMessage('Övningen kunde inte sparas. Försök igen.')
      } else if (!data) {
        setErrorMessage('Övningen kunde inte uppdateras. Kontrollera behörigheten eller ladda om sidan för att hämta den senaste versionen.')
      } else {
        setExercises([...exercises.filter((exercise) => exercise.id !== data.id), data]
          .sort((first, second) => first.title.localeCompare(second.title, 'sv')))
        setSelectedId(data.id)
        const wasPublished = selected?.status === 'published'
        if (data.status === 'published') {
          setMessage(wasPublished ? 'Ändringarna sparades.' : 'Övningen publicerades.')
        } else {
          setMessage(wasPublished ? 'Övningen avpublicerades och sparades som utkast.' : 'Utkastet sparades.')
        }
        if (wasPublished || data.status === 'published') onSave()
      }
    } catch {
      setErrorMessage('Övningen kunde inte sparas. Försök igen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-exercises">
      <h3>Hantera övningar</h3>
      {!exercises && !errorMessage && <p role="status">Hämtar övningar…</p>}
      {exercises && (
        <>
          <label>
            Övning
            <select value={selectedId} disabled={saving} onChange={(event) => {
              setSelectedId(event.target.value)
              setMessage('')
              setErrorMessage('')
            }}>
              <option value="">Ny övning</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.title} ({exercise.status === 'draft' ? 'utkast' : 'publicerad'})
                </option>
              ))}
            </select>
          </label>
          <form className="admin-form" key={selectedId} onSubmit={save}>
            <label>Titel<input name="title" defaultValue={selected?.title} required /></label>
            <label>
              Kategori
              <select name="category" defaultValue={selected?.category} required>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Svårighetsgrad
              <select name="difficulty" defaultValue={selected?.difficulty} required>
                {difficulties.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
              </select>
            </label>
            <InstructionEditor client={client} initialText={selected?.steps.join('\n') ?? ''} />
            <SketchEditor initialSketch={selected?.sketch} />
            <div className="exercise-actions">
              <button className="button" type="submit" disabled={saving}>
                {selected?.status === 'published' ? 'Spara ändringar' : 'Spara utkast'}
              </button>
              {selected?.status === 'published' ? (
                <button className="clear-throw-filter" type="submit" value="unpublish" disabled={saving}>Avpublicera</button>
              ) : (
                <button className="button" type="submit" value="publish" disabled={saving}>Publicera</button>
              )}
            </div>
          </form>
        </>
      )}
      {message && <p role="status">{message}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  )
}
