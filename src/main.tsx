import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { createRoot } from 'react-dom/client'
import { AdminLogin } from './AdminLogin'
import { ExerciseDetail } from './ExerciseDetail'
import { HomePage } from './HomePage'
import { exercises } from './exercises'
import { hasSupabaseConfig, loadExercises, type PublishedExercise } from './loadExercises'
import { client } from './supabaseClient'
import './styles.css'

const favoritesKey = 'apporta:favorites'
const legacyFavoritesKey = 'apportera-mera:favorites'
const exerciseHashes = ['#ovningar', '#ovningsbanken', '#alla-rutor', '#mina-rutor']

function readFavorites(): string[] {
  try {
    const savedFavorites = window.localStorage.getItem(favoritesKey)
      ?? window.localStorage.getItem(legacyFavoritesKey)
    const stored: unknown = JSON.parse(savedFavorites ?? '[]')
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function ExerciseList({ items, favoriteIds, onFavorite, userId, checkingAccount }: {
  items: PublishedExercise[]
  favoriteIds: string[]
  onFavorite: (id: string) => void
  userId?: string
  checkingAccount: boolean
}) {
  const [notes, setNotes] = useState<Map<string, string> | null>()
  const [noteAttempt, setNoteAttempt] = useState(0)
  useEffect(() => {
    if (!client || !userId) return
    const db = client
    const controller = new AbortController()
    async function loadNotes() {
      try {
        const { data, error } = await db.from('exercise_notes').select('exercise_id,note')
          .eq('user_id', userId).abortSignal(controller.signal)
        if (controller.signal.aborted) return
        if (error) throw error
        setNotes(new Map(data.map(({ exercise_id, note }) => [exercise_id, note])))
      } catch {
        if (!controller.signal.aborted) setNotes(null)
      }
    }
    void loadNotes()
    return () => controller.abort()
  }, [userId, noteAttempt])

  if (items.length === 0) return null

  return (
    <>
    {notes === null && <div className="note-retry">
      <p role="alert">Dina noteringar kunde inte hämtas just nu.</p>
      <button className="note-edit" type="button" onClick={() => {
        setNotes(undefined)
        setNoteAttempt((attempt) => attempt + 1)
      }}>Försök igen</button>
    </div>}
    <ul className="exercise-list" role="list">
      {items.map((exercise) => (
        <li className="exercise-card" key={exercise.id}>
          <ExerciseDetail exercise={exercise} favorite={favoriteIds.includes(exercise.id)}
            onFavorite={() => onFavorite(exercise.id)} userId={userId} checkingAccount={checkingAccount}
            note={notes ? notes.get(exercise.id) ?? '' : notes}
            onNoteSave={(note) => setNotes((current) => new Map(current).set(exercise.id, note))} />
        </li>
      ))}
    </ul>
    </>
  )
}

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const isExerciseView = exerciseHashes.includes(hash)
  const isAdminView = hash === '#admin' && hasSupabaseConfig
  const isAccountView = hash === '#logga-in' || hash === '#skapa-konto'
  const isHome = !isExerciseView && !isAdminView && !isAccountView
  const [session, setSession] = useState<Session | null>(null)
  const [loadingSession, setLoadingSession] = useState(Boolean(client))
  const [exerciseVersion, setExerciseVersion] = useState(0)
  const [availableExercises, setAvailableExercises] = useState<PublishedExercise[]>(
    hasSupabaseConfig ? [] : exercises
  )
  const [loadStatus, setLoadStatus] = useState(hasSupabaseConfig ? 'loading' : 'ready')
  const [showFavorites, setShowFavorites] = useState(window.location.hash === '#mina-rutor')
  const [category, setCategory] = useState('')
  const [favoriteIds, setFavoriteIds] = useState(readFavorites)
  const [favoriteStorageError, setFavoriteStorageError] = useState(false)
  const favorites = availableExercises.filter((exercise) => favoriteIds.includes(exercise.id))

  useEffect(() => {
    const listener = client?.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoadingSession(false)
    })
    return () => listener?.data.subscription.unsubscribe()
  }, [])

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

  const categories = [...new Set([...availableExercises.map((exercise) => exercise.category), 'Markering', 'Dirigering och linjetag', 'Sök och närsök', 'Stadga och passivitet', 'Stoppsignal', 'Vattenarbete', 'Ringträning'])]
  const matches = availableExercises.filter((exercise) =>
    (!category || exercise.category === category)
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
          <a className="wordmark" href="#start" aria-label="Apporta – startsida">APPORTA<span aria-hidden="true">.</span></a>
          <nav className="site-nav" aria-label="Huvudmeny">
            <a className="account-link" href="#logga-in" aria-current={isAccountView ? 'page' : undefined}>
              <span className="account-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3"/><path d="M5 21v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3"/></svg></span>{session ? 'Mitt konto' : 'Logga in'}
            </a>
          </nav>
        </div>
      </header>
      <main className={isHome ? undefined : 'container inner-page'}>
        {isHome && <HomePage items={availableExercises} loadStatus={loadStatus} onCategory={(value) => { setCategory(value); setShowFavorites(false) }} />}
        {isExerciseView && <>
        {favoriteStorageError && <p role="alert">Webbläsaren kunde inte spara dina favoriter. De finns kvar tills du laddar om sidan.</p>}

        <section className="library" id="ovningar" aria-labelledby="bankrubrik">
          <div className="library-hero">
            <p className="home-eyebrow">Din digitala övningsbank</p>
            <h1 id="bankrubrik" tabIndex={-1}>Övningar</h1>
          </div>
          <div className="exercise-filters">
            <label>
              Visa
              <select value={showFavorites ? 'mina' : 'alla'} onChange={(event) => setShowFavorites(event.target.value === 'mina')}>
                <option value="alla">Alla rutor</option>
                <option value="mina">Mina rutor</option>
              </select>
            </label>
            {!showFavorites && <label>
              Kategori
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Alla kategorier</option>
                {categories.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>}
          </div>
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
          <ExerciseList key={session?.user.id ?? 'guest'} items={showFavorites ? favorites : matches} favoriteIds={favoriteIds}
            onFavorite={toggleFavorite} userId={session?.user.id} checkingAccount={loadingSession} />
        </section>
        </>}
        {(isAdminView || isAccountView) && <AdminLogin key={hash} register={hash === '#skapa-konto'} session={session} loading={loadingSession}
          showAdmin={isAdminView} onExerciseSave={() => setExerciseVersion((version) => version + 1)} />}
      </main>
      <footer className="site-footer">
        <div className="container footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <a className="wordmark" href="#start" aria-label="Apporta – startsida">APPORTA<span aria-hidden="true">.</span></a>
              <p>Övningsbiblioteket för jaktapportering med retrievers och spaniels.</p>
            </div>
            <nav className="footer-nav" aria-label="Sidfot">
              <a href="#ovningar" onClick={() => { setCategory(''); setShowFavorites(false) }}>Övningar</a>
              <a href="#mina-rutor" onClick={() => setShowFavorites(true)}>Favoriter</a>
              <a href="#logga-in">Konto</a>
              {hasSupabaseConfig && <a href="#admin">Admin</a>}
            </nav>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Apporta.</p>
          </div>
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
