import type { SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState, type FormEvent } from 'react'
import { ExerciseDetail } from './ExerciseDetail'
import { InstructionEditor } from './InstructionEditor'
import { SketchEditor } from './SketchEditor'
import type { Sketch } from './ExerciseSketch'
import { readStep, writeStep } from './instructionSteps'
import type { PublishedExercise } from './loadExercises'

const categories = [
  'Markering', 'Dirigering och linjetag', 'Sök och närsök',
  'Stadga och passivitet', 'Stoppsignal', 'Vattenarbete', 'Ringträning',
]
const fields = 'id,title,category,steps,sketch,status,updated_at'

type EditableExercise = {
  id: string
  title: string
  category: string
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

  async function save(draft: PublishedExercise, action?: string) {
    if (saving || !exercises) return

    let status = selected?.status ?? 'draft'
    if (action === 'publish') status = 'published'
    if (action === 'unpublish') status = 'draft'
    const hasSketch = draft.sketch.points.length > 0 || draft.sketch.arrows.length > 0
    const values = {
      title: draft.title,
      category: draft.category,
      steps: draft.steps,
      sketch: hasSketch ? draft.sketch : null,
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
          <AdminExerciseForm key={selectedId} selected={selected} client={client} saving={saving} onSave={save} />
        </>
      )}
      {message && <p role="status">{message}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  )
}

function AdminExerciseForm({ selected, client, saving, onSave }: {
  selected?: EditableExercise
  client: SupabaseClient
  saving: boolean
  onSave: (draft: PublishedExercise, action?: string) => Promise<void>
}) {
  const [title, setTitle] = useState(selected?.title ?? '')
  const [category, setCategory] = useState(selected?.category ?? categories[0])
  const [steps, setSteps] = useState(() => selected?.steps.length
    ? selected.steps.map(readStep)
    : Array.from({ length: 3 }, () => readStep('')))
  const [sketch, setSketch] = useState<Sketch>(() => ({
    points: selected?.sketch?.points ?? [],
    arrows: selected?.sketch?.arrows ?? [],
  }))
  const draft: PublishedExercise = {
    id: selected?.id ?? '',
    title: title.trim(),
    category,
    steps: steps.map(({ instruction, reminder }) => writeStep(instruction, reminder)).filter(Boolean),
    sketch,
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const submitter = (event.nativeEvent as SubmitEvent).submitter
    void onSave(draft, submitter instanceof HTMLButtonElement ? submitter.value : undefined)
  }

  return (
    <div className="admin-exercise-workspace">
      <form className="admin-form" onSubmit={submit}>
        <div className="admin-exercise-fields">
          <label>Titel<input name="title" value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
          <label>
            Kategori
            <select name="category" value={category} onChange={(event) => setCategory(event.target.value)} required>
              {categories.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>
        <SketchEditor sketch={sketch} setSketch={setSketch} />
        <div className="admin-exercise-instructions">
          <InstructionEditor client={client} steps={steps} onChange={setSteps} />
        </div>
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
      <section className="admin-exercise-preview" aria-labelledby="exercise-preview-title">
        <h4 id="exercise-preview-title">Förhandsvisning</h4>
        <p>Så ser övningskortet ut medan du redigerar.</p>
        <div className="exercise-card">
          <ExerciseDetail exercise={{ ...draft, title: draft.title || 'Övningens titel' }} />
        </div>
      </section>
    </div>
  )
}
