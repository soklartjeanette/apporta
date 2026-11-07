import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminLogin } from './AdminLogin'
import logo from './assets/apportera-mera-logotyp.png'
import { ExerciseDetail } from './ExerciseDetail'
import { HomePage } from './HomePage'
import { exercises } from './exercises'
import { hasSupabaseConfig, loadExercises, type PublishedExercise } from './loadExercises'
import './styles.css'

const throwTypeByCategory = new Map([
  ['Markering', 'med-kast'],
  ['Dirigering och linjetag', 'med-kast'],
  ['Ringträning', 'utan-kast'],
  ['Stadga och passivitet', 'utan-kast'],
])

const favoritesKey = 'apportera-mera:favorites'
const exerciseHashes = ['#ovningar', '#ovningsbanken', '#alla-rutor', '#mina-rutor']

function readFavorites(): string[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(favoritesKey) ?? '[]')
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function ExerciseList({ items, favoriteIds, onFavorite }: {
  items: PublishedExercise[]
  favoriteIds: string[]
  onFavorite: (id: string) => void
}) {
  if (items.length === 0) return null

  return (
    <ul className="exercise-list" role="list">
      {items.map((exercise) => (
        <li className="exercise-card" key={exercise.id}>
          <ExerciseDetail exercise={exercise} favorite={favoriteIds.includes(exercise.id)}
            onFavorite={() => onFavorite(exercise.id)} />
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const isExerciseView = exerciseHashes.includes(hash)
  const isAdminView = hash === '#admin' && hasSupabaseConfig
  const isHome = !isExerciseView && !isAdminView
  const [exerciseVersion, setExerciseVersion] = useState(0)
  const [availableExercises, setAvailableExercises] = useState<PublishedExercise[]>(
    hasSupabaseConfig ? [] : exercises
  )
  const [loadStatus, setLoadStatus] = useState(hasSupabaseConfig ? 'loading' : 'ready')
  const [showFavorites, setShowFavorites] = useState(window.location.hash === '#mina-rutor')
  const [throwType, setThrowType] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [favoriteIds, setFavoriteIds] = useState(readFavorites)
  const [favoriteStorageError, setFavoriteStorageError] = useState(false)
  const favorites = availableExercises.filter((exercise) => favoriteIds.includes(exercise.id))

  function toggleFavorite(id: string) {
    const next = favoriteIds.includes(id)
      ? favoriteIds.filter((favoriteId) => favoriteId !== id)
      : [...favoriteIds, id]
    setFavoriteIds(next)
    try {
      window.localStorage.setItem(favoritesKey, JSON.stringify(next))
      setFavoriteStorageError(false)
    } catch {
      setFavoriteStorageError(true)
    }
  }

  const categories = [...new Set([...availableExercises.map((exercise) => exercise.category), 'Ringträning'])]
  const difficulties = [...new Set(availableExercises.map((exercise) => exercise.difficulty))]
  const matches = availableExercises.filter((exercise) =>
    (!throwType || throwTypeByCategory.get(exercise.category) === throwType) &&
    (!category || exercise.category === category) &&
    (!difficulty || exercise.difficulty === difficulty)
  )
  useEffect(() => {
    if (!hasSupabaseConfig) return

    const controller = new AbortController()
    loadExercises(controller.signal).then((loadedExercises) => {
      setAvailableExercises(loadedExercises)
      setLoadStatus('ready')
    }).catch(() => {
      if (!controller.signal.aborted) setLoadStatus('error')
    })

    return () => controller.abort()
  }, [exerciseVersion])
  useEffect(() => {
    function syncHash() {
      const next = window.location.hash
      setHash(next)
      if (exerciseHashes.includes(next)) setShowFavorites(next === '#mina-rutor')
    }
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])
  useEffect(() => {
    if (hash === '#sa-funkar-det') {
      document.getElementById('sa-funkar-det')?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash])

  return (
    <>
      <header className="site-header">
        <div className="container header-content">
          <a href="#start"><img className="site-logo" src={logo} alt="Apportera mera – startsida" width={2172} height={724} /></a>
          <nav className="site-nav" aria-label="Huvudmeny">
            <a href="#ovningar" aria-current={isExerciseView ? 'page' : undefined}>Övningar</a>
            <a href="#sa-funkar-det">Så funkar det</a>
          </nav>
        </div>
      </header>
      <main className={isHome ? undefined : 'container inner-page'}>
        {isHome && <HomePage />}
        {isExerciseView && <>
        {favoriteStorageError && <p role="alert">Webbläsaren kunde inte spara dina favoriter. De finns kvar tills du laddar om sidan.</p>}

        <section className="library" id="ovningar" aria-labelledby="bankrubrik">
          <h1 id="bankrubrik" tabIndex={-1}>Övningar</h1>
          <div className="exercise-filters">
            <label>
              Visa rutor
              <select value={showFavorites ? 'mina' : 'alla'} onChange={(event) => setShowFavorites(event.target.value === 'mina')}>
                <option value="alla">Alla rutor</option>
                <option value="mina">Mina rutor</option>
              </select>
            </label>
          </div>
          {!showFavorites && <div className="exercise-filters" role="group" aria-label="Filtrera övningar">
            <label>
              Övningar med eller utan kast
              <select value={throwType} onChange={(event) => setThrowType(event.target.value)}>
                <option value="">Med och utan kast</option>
                <option value="med-kast">Med kast</option>
                <option value="utan-kast">Utan kast</option>
              </select>
            </label>
            <label>
              Kategori
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Alla kategorier</option>
                {categories.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              Svårighetsgrad
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                <option value="">Alla svårighetsgrader</option>
                {difficulties.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>}
          <p className="exercise-results" role="status">
            {loadStatus === 'loading' && 'Laddar övningar…'}
            {loadStatus === 'error' && 'Övningarna kunde inte hämtas. Ladda om sidan för att försöka igen.'}
            {loadStatus === 'ready' && showFavorites && (favorites.length === 0
              ? 'Här samlas dina favoriter. Välj Alla rutor och tryck på hjärtat på en ruta för att spara den.'
              : `Sparade rutor: ${favorites.length}.`)}
            {loadStatus === 'ready' && !showFavorites && availableExercises.length === 0 && 'Inga övningar är publicerade ännu.'}
            {loadStatus === 'ready' && !showFavorites && availableExercises.length > 0 && (matches.length === 0
              ? 'Inga övningar matchar. Prova att ändra filtren.'
              : `Visar ${matches.length} av ${availableExercises.length} övningar.`)}
          </p>
          <ExerciseList items={showFavorites ? favorites : matches} favoriteIds={favoriteIds} onFavorite={toggleFavorite} />
        </section>
        </>}
        {hasSupabaseConfig && <div hidden={!isAdminView}>
          <AdminLogin onExerciseSave={() => setExerciseVersion((version) => version + 1)} />
        </div>}
      </main>
      <footer className="site-footer">
        <div className="container footer-content">
          <a href="#start">Apportera mera</a>
          <nav className="site-nav" aria-label="Sidfot">
            <a href="#ovningar">Övningar</a>
            <a href="#sa-funkar-det">Så funkar det</a>
            {hasSupabaseConfig && <a href="#admin">Admin</a>}
          </nav>
        </div>
      </footer>
    </>
  )
}

const root = document.getElementById('root')

if (!root) {
  throw new Error('Appens rotelement saknas.')
}

createRoot(root).render(<App />)
