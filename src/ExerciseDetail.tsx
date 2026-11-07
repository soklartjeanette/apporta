import { useId } from 'react'
import type { PublishedExercise } from './loadExercises'
import { ExerciseSketch } from './ExerciseSketch'

export function ExerciseDetail({ exercise, favorite, onFavorite }: {
  exercise: PublishedExercise
  favorite: boolean
  onFavorite: () => void
}) {
  const titleId = useId()

  return (
    <article aria-labelledby={titleId}>
      <div className="exercise-meta">
        <p className="exercise-category">{exercise.category}</p>
        <p className="exercise-difficulty">{exercise.difficulty}</p>
      </div>
      <div className="exercise-heading">
        <h3 id={titleId}>{exercise.title}</h3>
        <button className="favorite-button" type="button" aria-pressed={favorite}
          aria-label={`Favorit: ${exercise.title}`} title={favorite ? 'Ta bort från Mina rutor' : 'Spara i Mina rutor'}
          onClick={onFavorite}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M12 21 4 13C-1 8 5 1 10 5l2 2 2-2c5-4 11 3 6 8z" fill={favorite ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ol>
        {exercise.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>

      <ExerciseSketch sketch={exercise.sketch} />
    </article>
  )
}
