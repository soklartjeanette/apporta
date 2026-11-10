import { useId } from 'react'
import type { PublishedExercise } from './loadExercises'
import { ExerciseSketch } from './ExerciseSketch'
import { ExerciseNote } from './ExerciseNote'
import { readStep } from './instructionSteps'

export function ExerciseDetail({ exercise, favorite = false, onFavorite, userId, note, onNoteSave, checkingAccount }: {
  exercise: PublishedExercise
  favorite?: boolean
  onFavorite?: () => void
  userId?: string
  note?: string | null
  onNoteSave?: (note: string) => void
  checkingAccount?: boolean
}) {
  const titleId = useId()

  return (
    <article aria-labelledby={titleId}>
      <p className="exercise-category">{exercise.category}</p>
      <div className="exercise-heading">
        <h3 id={titleId}>{exercise.title}</h3>
        <button className="favorite-button" type="button" aria-pressed={favorite} disabled={!onFavorite}
          aria-label={`Favorit: ${exercise.title}`} title={favorite ? 'Ta bort från Mina rutor' : 'Spara i Mina rutor'}
          onClick={onFavorite}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 21 4 13C-1 8 5 1 10 5l2 2 2-2c5-4 11 3 6 8z" fill={favorite ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ExerciseSketch sketch={exercise.sketch} />

      <ol>
        {exercise.steps.map((step, index) => {
          const { instruction, reminder } = readStep(step)
          return <li key={index}>
            {instruction}
            {reminder && <em className="exercise-step-reminder">{reminder}</em>}
          </li>
        })}
      </ol>
      {!checkingAccount && <ExerciseNote exerciseId={exercise.id} userId={userId} note={note} onSave={onNoteSave} />}
    </article>
  )
}
