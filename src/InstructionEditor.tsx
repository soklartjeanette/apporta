import { FunctionsHttpError, type SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { readStep } from './instructionSteps'

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

export function InstructionEditor({ client, steps, onChange }: {
  client: SupabaseClient
  steps: ReturnType<typeof readStep>[]
  onChange: (steps: ReturnType<typeof readStep>[]) => void
}) {
  const [suggestion, setSuggestion] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [applied, setApplied] = useState(false)
  const instructions = steps.map(({ instruction }) => instruction.trim()).filter(Boolean).join('\n')
  const existingSteps = steps.filter(({ instruction }) => instruction.trim())
  const hasReminders = steps.some(({ reminder }) => reminder.trim())
  const proposedSteps = suggestion.map((step) => step.trim()).filter(Boolean)
  const canApply = proposedSteps.length > 0 && (!hasReminders || proposedSteps.length === existingSteps.length)

  function updateSteps(nextSteps: typeof steps) {
    onChange(nextSteps)
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
      <div>
        {applied && <p role="status">Förslaget har lagts in. Spara övningen för att behålla ändringarna.</p>}
        <ol className="instruction-steps" aria-label="Instruktioner">
          {steps.map(({ instruction, reminder }, index) => (
            <li key={index}>
              <textarea aria-label={`Instruktioner, steg ${index + 1}`} placeholder="Instruktioner" rows={2} value={instruction}
                required={Boolean(reminder.trim())} readOnly={busy} onChange={(event) => {
                  const value = event.target.value
                  updateSteps(steps.map((step, i) => i === index ? { ...step, instruction: value } : step))
                }} />
              <textarea className="instruction-reminder-field"
                aria-label={`Noteringar om detta steg, steg ${index + 1} (valfritt)`}
                placeholder="Noteringar om detta steg" rows={1}
                value={reminder} readOnly={busy} onChange={(event) => {
                  const value = event.target.value
                  updateSteps(steps.map((step, i) => i === index ? { ...step, reminder: value } : step))
                }} />
            </li>
          ))}
        </ol>
        <button className="clear-throw-filter" type="button" disabled={busy}
          onClick={() => updateSteps([...steps, readStep('')])}>Lägg till steg</button>
      </div>
      <button className="button" type="button" onClick={improve} disabled={busy || !instructions.trim()}>
        {busy ? 'Tar fram ett förslag…' : 'Förbättra instruktionerna'}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {suggestion.length > 0 && (
        <div className="instruction-suggestion">
          <p>AI-förslag</p>
          <NumberedSteps label="AI-förslag" steps={suggestion} onChange={setSuggestion} />
          {hasReminders && !canApply && <p>Förslaget har ett annat antal steg. För över texten för hand så att påminnelserna hamnar rätt.</p>}
          <button className="button" type="button" disabled={!canApply} onClick={() => {
            updateSteps(proposedSteps.map((instruction, index) => ({
              instruction,
              reminder: hasReminders ? existingSteps[index].reminder : '',
            })))
            setApplied(true)
          }}>Använd förslaget</button>
          {' '}
          <button className="clear-throw-filter" type="button" onClick={() => setSuggestion([])}>Behåll originalet</button>
        </div>
      )}
    </>
  )
}
