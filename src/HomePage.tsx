import { ExerciseSketch } from './ExerciseSketch'
import { exercises } from './exercises'
import './home.css'

const media = import.meta.glob<string>('./assets/startsida-*', {
  eager: true,
  import: 'default',
  query: '?url',
})
const poster = media['./assets/startsida-apportering.jpg']
const film = media['./assets/startsida-apportering.mp4']

export function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="sidrubrik">
        {poster && <img className="home-hero-media" src={poster} alt="" fetchPriority="high" />}
        <div className="home-hero-copy container">
          <p className="home-eyebrow">Jaktapportering med retriever</p>
          <h1 id="sidrubrik">Hitta din nästa apportövning</h1>
          <a className="home-cta" href="#ovningar">Utforska övningarna <span aria-hidden="true">↗</span></a>
        </div>
        {film && <video className="home-film" src={film} poster={poster} controls playsInline preload="none"
          aria-label="Film om jaktapportering" />}
      </section>

      <section className="home-how container" id="sa-funkar-det" aria-labelledby="how-title">
        <h2 id="how-title">Så funkar det</h2>
        <div className="home-how-panel">
          <div className="home-how-image">
            {media['./assets/startsida-hund.jpg']
              ? <img src={media['./assets/startsida-hund.jpg']} alt="Jaktlabrador på träningsplatsen" loading="lazy" />
              : <ExerciseSketch sketch={exercises[0].sketch} />}
          </div>
          <div className="home-how-copy">
            <h3>Från idé till träningspass</h3>
            <p>Hitta en övning som passar dig och din hund. Varje övning har stegvisa instruktioner och en skiss som visar hur du lägger upp träningen. Tryck på hjärtat för att spara en favorit till nästa pass.</p>
            <a href="#ovningar">Till övningarna <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="home-features container" aria-labelledby="features-title">
        <h2 id="features-title">Inför nästa pass</h2>
        <div className="home-feature-grid">
          <article>
            <div className="home-feature-art feature-filter" aria-hidden="true">
              <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                <path d="M19 21h82M19 45h82M19 69h82" />
                <path d="M42 13v16M77 37v16M51 61v16" strokeWidth="11" />
              </svg>
            </div>
            <h3><a href="#ovningar">Hitta en övning</a></h3>
            <p>Filtrera efter kategori, svårighetsgrad och med eller utan kast.</p>
          </article>
          <article>
            <div className="home-feature-art feature-sketch" aria-hidden="true">
              <ExerciseSketch sketch={exercises[0].sketch} />
            </div>
            <h3><a href="#ovningar">Se hur du lägger upp den</a></h3>
            <p>Följ stegen och använd skissen ute på träningsplatsen.</p>
          </article>
          <article>
            <div className="home-feature-art feature-heart" aria-hidden="true">
              <svg viewBox="0 0 120 90" fill="currentColor">
                <path d="M60 79 22 43C3 22 31-3 50 14l10 9 10-9c19-17 47 8 28 29z" />
              </svg>
            </div>
            <h3><a href="#mina-rutor">Spara till nästa pass</a></h3>
            <p>Samla övningar du vill prova under Mina rutor.</p>
          </article>
        </div>
      </section>
    </>
  )
}
