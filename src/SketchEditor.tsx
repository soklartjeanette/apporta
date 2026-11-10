import { useRef, useState, type Dispatch, type PointerEvent, type SetStateAction } from 'react'
import { ExerciseSketch, type Sketch, type SketchTarget } from './ExerciseSketch'
import { ditchWidth, handlerAndDogLabel, SketchSymbol, terrainTools } from './SketchSymbol'

const toolbar = [
  { name: 'Skytt', options: ['Skytt åt vänster', 'Skytt åt höger'] },
  { name: 'Kastare', options: ['Kastare åt vänster', 'Kastare åt höger'] },
] as const
const singleTools = [handlerAndDogLabel, 'Apport', 'Pil', 'Streckad pil'] as const
type Tool = 'Flytta' | (typeof singleTools)[number] | (typeof toolbar)[number]['options'][number] | (typeof terrainTools)[number]

function coordinates(event: PointerEvent<SVGSVGElement>, horizontalMargin = 20) {
  const matrix = event.currentTarget.getScreenCTM()
  if (!matrix) return null
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
  return [Math.round(Math.max(horizontalMargin, Math.min(320 - horizontalMargin, point.x))), Math.round(Math.max(15, Math.min(165, point.y)))]
}

export function SketchEditor({ sketch, setSketch }: { sketch: Sketch; setSketch: Dispatch<SetStateAction<Sketch>> }) {
  const [tool, setTool] = useState<Tool>('Flytta')
  const [arrowStart, setArrowStart] = useState<number[] | null>(null)
  const [selected, setSelected] = useState<SketchTarget | null>(null)
  const drag = useRef<{ target: SketchTarget; before: Sketch | null } | null>(null)
  const history = useRef<Sketch[]>([])
  const isArrowTool = tool === 'Pil' || tool === 'Streckad pil'

  function place(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0 || !event.isPrimary) return
    const position = coordinates(event, tool === 'Dike' ? ditchWidth / 2 : undefined)
    if (!position) return
    setSelected(null)
    if (tool === 'Flytta') return
    if (isArrowTool) {
      if (!arrowStart) setArrowStart(position)
      else if (position.some((value, index) => value !== arrowStart[index])) {
        history.current.push(sketch)
        const arrow = { from: arrowStart, to: position, dashed: tool === 'Streckad pil' }
        setSketch((current) => ({ ...current, arrows: [...current.arrows, arrow] }))
        setArrowStart(null)
      }
      return
    }
    const [x, y] = position
    history.current.push(sketch)
    setSketch((current) => ({ ...current, points: [...current.points, { x, y, label: tool }] }))
  }

  function grab(event: PointerEvent<SVGElement>, target: SketchTarget) {
    if (tool !== 'Flytta' || event.button !== 0 || !event.isPrimary) return
    event.stopPropagation()
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId)
    drag.current = { target, before: sketch }
    setSelected(target)
  }

  function move(event: PointerEvent<SVGSVGElement>) {
    const activeDrag = drag.current
    if (!activeDrag || !event.isPrimary) return
    const { target, before } = activeDrag
    const isDitch = target.kind === 'point' && sketch.points[target.index].label === 'Dike'
    const position = coordinates(event, isDitch ? ditchWidth / 2 : undefined)
    if (!position) return
    const [x, y] = position
    if (before) {
      const original = target.kind === 'point'
        ? [before.points[target.index].x, before.points[target.index].y]
        : before.arrows[target.index][target.end]
      if (x === original[0] && y === original[1]) return
      history.current.push(before)
      activeDrag.before = null
    }
    if (target.kind === 'point') {
      setSketch((current) => ({
        ...current,
        points: current.points.map((point, index) => index === target.index ? { ...point, x, y } : point),
      }))
    } else {
      setSketch((current) => ({
        ...current,
        arrows: current.arrows.map((arrow, index) => index === target.index ? { ...arrow, [target.end]: position } : arrow),
      }))
    }
  }

  function removeSelected() {
    if (!selected) return
    const key = selected.kind === 'point' ? 'points' : 'arrows'
    history.current.push(sketch)
    setSketch((current) => ({ ...current, [key]: current[key].filter((_, index) => index !== selected.index) }))
    setSelected(null)
  }

  function undo() {
    if (arrowStart) {
      setArrowStart(null)
      return
    }
    const previous = history.current.pop()
    if (!previous) return
    setSketch(previous)
    setSelected(null)
  }

  function toolButton(item: Tool, iconOnly = false) {
    return (
      <button key={item} type="button" aria-label={iconOnly ? item : undefined}
        title={iconOnly ? item : undefined} aria-pressed={tool === item} onClick={() => {
          setTool(item)
          setArrowStart(null)
          setSelected(null)
        }}>
        <SketchSymbol label={item} size={22} width={item === 'Dike' ? 44 : undefined} />{!iconOnly && item}
      </button>
    )
  }

  return (
    <fieldset className="sketch-editor">
      <legend>Skiss</legend>
      <div className="sketch-actions" role="group" aria-label="Redigera skiss">
        {toolButton('Flytta')}
        <button type="button" disabled={!arrowStart && history.current.length === 0} onClick={undo}>Ångra</button>
        <button type="button" disabled={!selected} onClick={removeSelected}>Radera markerat objekt</button>
      </div>
      <div className="sketch-tools" role="group" aria-label="Ritverktyg">
        {singleTools.map((item) => toolButton(item))}
      </div>
      <div className="sketch-tools" role="group" aria-label="Skytt och kastare">
        {toolbar.map(({ name, options }) => (
          <div key={name} className="sketch-tool-group" role="group" aria-label={name}>
            <span>{name}</span>
            {options.map((item) => toolButton(item, true))}
          </div>
        ))}
      </div>
      <div className="sketch-tools" role="group" aria-label="Terräng">
        {terrainTools.map((item) => toolButton(item))}
      </div>
      <p role="status">
        {tool === 'Flytta' && 'Dra en symbol eller en pilände för att flytta den.'}
        {isArrowTool && (arrowStart ? 'Tryck där pilen ska sluta.' : 'Tryck där pilen ska börja.')}
        {tool !== 'Flytta' && !isArrowTool && 'Tryck på träningsytan för att placera symbolen.'}
      </p>
      <ExerciseSketch sketch={sketch} onGrab={grab} selected={selected} svgProps={{
        role: 'img',
        'aria-label': 'Träningsyta',
        className: 'sketch-surface',
        onPointerDown: place,
        onPointerMove: move,
        onLostPointerCapture: () => { drag.current = null },
      }} />
    </fieldset>
  )
}
