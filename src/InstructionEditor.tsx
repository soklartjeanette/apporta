import { FunctionsHttpError, type SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'

const aiErrors: Record<string, string> = {
  ai_quota: 'OpenAI rapporterar att API-krediterna eller användningsgränsen är slut. Kontrollera Billing på OpenAI-plattformen.',
  ai_key: 'OpenAI godkände inte API-nyckeln. Kontrollera att nyckeln är aktiv och har skrivbehörighet för Responses.',
  ai_busy: 'OpenAI tar emot för många anrop just nu. Försök igen om en stund.',
}

function NumberedSteps({ label, steps, readOnly, onChange }: {
  label: string
  steps: string[]
  readOnly?: boolean
  onChange: (steps: string[]) => void
}) {
  return (
    <ol className="instruction-steps" aria-label={label}>
      {steps.map((step, index) => (
        <li key={index}>
          <textarea aria-label={`${label}, steg ${index + 1}`} rows={2} value={step} readOnly={readOnly}
            onChange={(event) => {
              const text = event.target.value
              onChange(steps.map((value, position) => position === index ? text : value))
            }} />
        </li>
      ))}
    </ol>
  )
}

export function InstructionEditor({ client, initialText }: { client: SupabaseClient, initialText: string }) {
  const [draftText, setDraftText] = useState(initialText)
  const [steps, setSteps] = useState<string[] | null>(() => initialText ? initialText.split('\n') : null)
  const [suggestion, setSuggestion] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [applied, setApplied] = useState(false)
  const instructions = steps?.join('\n') ?? draftText

  function updateSteps(nextSteps: string[]) {
    setSteps(nextSteps)
    setSuggestion([])
    setErrorMessage('')
    setApplied(false)
  }

  async function improve() {
    if (!instructions.trim() || busy) return
    setBusy(true)
    setApplied(false)
    setSuggestion([])
    setErrorMessage('')
    try {
      const { data, error } = await client.functions.invoke<{ steps: string[] }>('improve-instructions', {
        body: { instructions },
      })
      if (error || !data?.steps?.length) {
        const failure = error instanceof FunctionsHttpError
          ? await error.context.json().catch(() => null)
          : null
        setErrorMessage(aiErrors[failure?.error] ??
          'Det gick inte att hämta ett AI-förslag. Du kan fortsätta skriva och spara som vanligt.')
      } else {
        setSuggestion(data.steps)
      }
    } catch {
      setErrorMessage('Det gick inte att hämta ett AI-förslag. Försök igen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {steps ? (
        <div>
          <p>Instruktioner</p>
          {applied && <p role="status">Förslaget har lagts in. Spara övningen för att behålla ändringarna.</p>}
          <NumberedSteps label="Instruktioner" steps={steps} readOnly={busy} onChange={updateSteps} />
          <input type="hidden" name="steps" value={instructions} />
          <button className="clear-throw-filter" type="button" disabled={busy}
            onClick={() => updateSteps([...steps, ''])}>Lägg till steg</button>
        </div>
      ) : (
        <label>
          Instruktioner (ett steg per rad)
          <textarea name="steps" rows={5} value={instructions} readOnly={busy}
            onChange={(event) => { setDraftText(event.target.value); setSuggestion([]); setErrorMessage('') }} />
        </label>
      )}
      <button className="button" type="button" onClick={improve} disabled={busy || !instructions.trim()}>
        {busy ? 'Tar fram ett förslag…' : 'Förbättra instruktionerna'}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {suggestion.length > 0 && (
        <div className="instruction-suggestion">
          <p>AI-förslag</p>
          <NumberedSteps label="AI-förslag" steps={suggestion} onChange={setSuggestion} />
          <button className="button" type="button" disabled={!suggestion.some((step) => step.trim())} onClick={() => {
            updateSteps(suggestion.join('\n').split(/\r?\n/).filter((step) => step.trim()))
            setApplied(true)
          }}>Använd förslaget</button>
          {' '}
          <button className="clear-throw-filter" type="button" onClick={() => setSuggestion([])}>Behåll originalet</button>
        </div>
      )}
    </>
  )
}
