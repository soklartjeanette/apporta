import artwork from './assets/egna-skissymboler.png'

const terrainSymbols = new Map([
  ['Gräs', (
    <path d="M8 22q0-5-3-8m7 8q0-7-2-10m5 10q0-8 1-12m3 12q0-6 3-9m1 9q1-4 4-7" />
  )],
  ['Björk', (
    <>
      <path d="M16 21C8 23 5 18 8 14c-1-4 2-7 5-7 2-4 7-4 9 0 4 0 6 4 4 7 3 5-2 9-10 7Z" fill="#8da475" />
      <path d="M14 18h4v10h-4Z" fill="#faf7ee" strokeWidth="1.2" />
      <path d="M14 21h1.5m1 3H18" strokeWidth="1" />
    </>
  )],
  ['Gran', (
    <path d="M16 4l6 8h-3l6 6h-4l6 6h-9v4h-4v-4H5l6-6H7l6-6h-3Z" fill="#486747" />
  )],
  ['Dike', (
    <>
      <path d="M1 13q13-2 27-1t27 0q13 1 22 0t18 0M1 20q15-2 29 0t28 0q13-1 22 0t15 0" strokeWidth="1.2" />
      <path d="M10 12l-2-3m4 3 1-4m47 4-2-3m4 3 1-4M24 19l-2 3m4-3 1 4m53-3-1 3m3-3 2 3" strokeWidth="1.1" />
      <path d="M6 16q2-1.5 4 0t4 0m10 0q2-1.5 4 0t4 0m10 1q2-1.5 4 0t4 0m10-1q2-1.5 4 0t4 0m11 0q2-1.5 4 0t4 0" stroke="#416b78" strokeWidth="1.1" />
    </>
  )],
])

export const terrainTools = ['Gräs', 'Björk', 'Gran', 'Dike'] as const
export const ditchWidth = 96

function terrainLabel(label: string) {
  return label === 'Högt gräs' || label === 'Grästuva' ? 'Gräs' : label
}

const views = new Map([
  ['Hund', '106 84 585 573'],
  ['Skytt', '819 105 705 561'],
  ['Skytt åt höger', '819 105 705 561'],
  ['Skytt åt vänster', '819 105 705 561'],
])

export const handlerAndDogLabel = 'Förare + hund'
const teamLabels = new Set([handlerAndDogLabel, 'Förare + väntande hund'])
const throwerLabels = new Set(['Kastare', 'Kastare åt vänster', 'Kastare åt höger'])

export function SketchSymbol({ label, x = 0, y = 0, size = 32, width = size }: {
  label: string
  x?: number
  y?: number
  size?: number
  width?: number
}) {
  const terrainSymbol = terrainSymbols.get(terrainLabel(label))
  if (terrainSymbol) {
    return (
      <svg x={x} y={y} width={width} height={size} viewBox={`0 0 ${label === 'Dike' ? ditchWidth : 32} 32`} aria-hidden="true">
        <g fill="none" stroke="#163924" strokeWidth="1.8" strokeLinecap="round">{terrainSymbol}</g>
      </svg>
    )
  }
  if (label === 'Pil' || label === 'Streckad pil') {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 16h19" stroke="#163924" strokeWidth="2.5"
          strokeDasharray={label === 'Streckad pil' ? '4 3' : undefined} />
        <path d="M18 9l7 7-7 7" fill="none" stroke="#163924" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (label === 'Apport') {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="9" r="1.8" fill="none" stroke="#163924" strokeWidth="1.5" />
        <rect x="12.4" y="10.5" width="7.2" height="14.5" rx="3" fill="#163924" />
      </svg>
    )
  }
  if (throwerLabels.has(label)) {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <g transform={label === 'Kastare åt höger' ? 'translate(32 0) scale(-1 1)' : undefined}>
          <g fill="#163924">
            <rect x="1" y="2.5" width="8" height="3.5" rx="1.5" transform="rotate(30 5 4.25)" />
            <circle cx="21" cy="8" r="3.3" />
            <path d="M17 13 Q21 10 24 14 L23 22 H16 Z" />
          </g>
          <path d="M19 14 L14 12 L10 8 M23 14 L26 18 L22 20 M19 21 L17 29 M22 21 L25 25 L28 27"
            fill="none" stroke="#163924" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    )
  }
  if (teamLabels.has(label)) {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <g fill="#163924">
          <path d="M6 17.5h4c.8 1.4.9 2.9.7 4.6-.2 1.5.6 2.5 1.2 4.1.7 1.9-.1 3.8-2 3.8H6.1c-1.9 0-2.7-1.9-2-3.8.6-1.6 1.4-2.6 1.2-4.1-.2-1.7-.1-3.2.7-4.6Z" />
          <path d="M5.4 14.8c.4-2.2 4.8-2.2 5.2 0 1.6 1 1.6 3.7.1 4l-1.2-.8h-3l-1.2.8c-1.5-.3-1.5-3 .1-4Z" />
          <path d="M20 5.1c0-2 1.3-3.2 3-3.2s3 1.2 3 3.2l.6.7-1 .4c-.1 1.9-1.2 3-2.6 3s-2.5-1.1-2.6-3l-1-.4Z" />
          <path d="M21.5 8h3v2c2.2.4 3.5 1.8 3.8 4l1 5.1a1 1 0 0 1-2 .4l-1.1-4.1.3 6.2-.8.3.8 5.2 1 1.4c.3.6 0 1.5-.7 1.5h-2.1L23 22.7 21.3 30h-2.1c-.7 0-1-.9-.7-1.5l1-1.4.8-5.2-.8-.3.3-6.2-1.1 4.1a1 1 0 0 1-2-.4l1-5.1c.3-2.2 1.6-3.6 3.8-4Z" />
        </g>
        <path d="M6 15.3l-.5 2.3m4.5-2.3.5 2.3M8 25.5v3.7M20.7 5.5q2.3.7 4.6 0M21 10.7q2 1.2 4 0m-4.6 10.6h5.2m-5.5 5.3h1.8m2.2 0h1.8"
          fill="none" stroke="#8d9d85" strokeWidth=".55" strokeLinecap="round" />
      </svg>
    )
  }
  const viewBox = views.get(label)
  if (!viewBox) return null

  return (
    <svg x={x} y={y} width={size} height={size} viewBox={viewBox} overflow="hidden" aria-hidden="true">
      <image href={artwork} width="2172" height="724"
        transform={label === 'Skytt åt vänster' ? 'translate(2343 0) scale(-1 1)' : undefined} />
    </svg>
  )
}

export function hasCustomSketchSymbol(label: string) {
  return label === 'Apport' || throwerLabels.has(label) || teamLabels.has(label) || views.has(label) || terrainSymbols.has(terrainLabel(label))
}
