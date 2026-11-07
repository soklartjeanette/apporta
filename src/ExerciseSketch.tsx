import { useId, type ComponentProps, type PointerEvent } from 'react'
import { ditchWidth, hasCustomSketchSymbol, SketchSymbol } from './SketchSymbol'

export type Sketch = {
  caption: string
  points: { x: number; y: number; label: string }[]
  arrows: { from: number[]; to: number[]; dashed: boolean }[]
}

export type SketchTarget =
  | { kind: 'point'; index: number }
  | { kind: 'arrow'; index: number; end: 'from' | 'to' }

export function ExerciseSketch({ sketch, svgProps, onGrab, selected }: {
  sketch: Sketch
  svgProps?: ComponentProps<'svg'>
  onGrab?: (event: PointerEvent<SVGElement>, target: SketchTarget) => void
  selected?: SketchTarget | null
}) {
  const arrowId = useId()

  return (
    <figure className="exercise-sketch">
      <svg viewBox="0 0 320 195" aria-hidden={!svgProps} {...svgProps}>
        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="currentColor" />
          </marker>
        </defs>
        {sketch.arrows.map(({ from, to, dashed }, index) => (
          <g key={index}>
            <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
              stroke="currentColor" strokeWidth={selected?.kind === 'arrow' && selected.index === index ? 4 : 2}
              strokeDasharray={dashed ? '5 4' : undefined}
              markerEnd={`url(#${arrowId})`} />
            {onGrab && (['from', 'to'] as const).map((end) => (
              <circle key={end} cx={end === 'from' ? from[0] : to[0]} cy={end === 'from' ? from[1] : to[1]}
                r="9" fill="transparent" className="sketch-handle"
                onPointerDown={(event) => onGrab(event, { kind: 'arrow', index, end })} />
            ))}
          </g>
        ))}
        {sketch.points.map(({ x, y, label }, index) => {
          const width = label === 'Dike' ? ditchWidth : 32
          return (
          <g key={index} aria-label={label} className={onGrab ? 'sketch-handle' : undefined}
            onPointerDown={onGrab ? (event) => onGrab(event, { kind: 'point', index }) : undefined}>
            {hasCustomSketchSymbol(label) ? (
              <>
                <rect x={x - width / 2 - 1} y={y - 17} width={width + 2} height="34" rx="4" fill="transparent"
                  stroke={selected?.kind === 'point' && selected.index === index ? '#bc7429' : undefined} />
                <SketchSymbol label={label} x={x - width / 2} y={y - 16} width={width} />
              </>
            ) : (
              <>
                <circle cx={x} cy={y} r={onGrab ? 9 : 7} fill="currentColor"
                  stroke={selected?.kind === 'point' && selected.index === index ? '#bc7429' : undefined} strokeWidth="3" />
                <text x={x} y={y + 21} textAnchor={x < 45 ? 'start' : x > 275 ? 'end' : 'middle'}
                  fill="currentColor" fontSize="13">{label}</text>
              </>
            )}
          </g>
          )
        })}
      </svg>
      {sketch.caption && <figcaption>{sketch.caption}</figcaption>}
    </figure>
  )
}
