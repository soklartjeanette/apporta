import { ExerciseSketch } from './ExerciseSketch'
import { exercises } from './exercises'
import './home.css'
import type { PublishedExercise } from './loadExercises'
const homeCategories = [
 ['Markering', 'Se nedslaget, minns platsen och hitta apporten.'],
 ['Dirigering och linjetag', 'Raka linjer, riktningar och samarbete på avstånd.'],
 ['Sök och närsök', 'Systematiskt och självständigt sök efter apporten.'],
 ['Stadga och passivitet', 'Lugn och kontroll när det händer saker runt omkring.'],
 ['Stoppsignal', 'Stanna och lyssna på nästa signal.'],
 ['Vattenarbete', 'Igång, simning och apportering vid vatten.'],
 ['Ringträning', 'Samarbete och följsamhet tillsammans i ringen.'],
]

const media = import.meta.glob<string>('./assets/startsida-*', {
  eager: true,
  import: 'default',
  query: '?url',
})
const poster = media['./assets/startsida-apportering.jpg']
const film = media['./assets/startsida-apportering.mp4']

export function HomePage({ items, loadStatus, onCategory }: { items: PublishedExercise[]; loadStatus: string; onCategory: (category: string) => void }) {
  return (
    <>
      <section className="home-hero" aria-labelledby="sidrubrik">
        {poster && <img className="home-hero-media" src={poster} alt="" fetchPriority="high" />}
        <div className="home-hero-copy container">
          <p className="home-eyebrow">För dig som tränar jaktapportering</p>
          <h1 id="sidrubrik">Ditt eget träningsbibliotek</h1>
          <div className="home-actions"><a className="home-cta" href="#logga-in">Logga in <span aria-hidden="true">→</span></a><a className="home-cta home-cta-outline" href="#skapa-konto">Skapa gratis konto</a></div>
        </div>
        {film && <video className="home-film" src={film} poster={poster} controls playsInline preload="none"
          aria-label="Film om jaktapportering" />}
      </section>

      <section className="home-categories container" aria-labelledby="categories-title">
        <div className="categories-heading"><h2 id="categories-title">Kategorier</h2><a href="#ovningar" onClick={() => onCategory('')}>Alla övningar</a></div>
        <div className="category-grid">{homeCategories.map(([name, description], index) => {
          const count = items.filter(item => item.category === name).length
          return <a className="category-tile" href="#ovningar" key={name} onClick={() => onCategory(name)}>
            <div className="category-top"><span>{String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">↗</span></div>
            <h3>{name}</h3><p>{description}</p>
            <span className="category-count">{loadStatus === 'loading' ? 'Laddar…' : loadStatus === 'error' ? 'Antal ej tillgängligt' : count + (count === 1 ? ' övning' : ' övningar')}</span>
          </a>
        })}</div>
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
            <h3>Kom ihåg dina övningar och upplägg</h3>
            <p>En ny utmaning eller en favorit i repris? Utforska träningsbiblioteket och plocka ihop ett pass för dig och din hund. Varje övning har tydliga instruktioner och en skiss som gör det enkelt att komma igång.</p>
            <p>Har ni gjort en rolig övning på träningen? Lägg in den här så att du enkelt hittar den igen. Behåll den för dig själv eller dela den med andra – din övning kan bli någon annans nya favorit.</p>
            <a href="#ovningar">Till övningarna <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

    </>
  )
}
