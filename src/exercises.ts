export const exercises = [
  {
    id: 'enkel-enkelmarkering',
    title: 'Enkelmarkering på öppen mark',
    category: 'Markering',
    description:
      'Hunden ser en apport landa och tränar på att komma ihåg var den föll.',
    equipment: ['En dummy', 'En medhjälpare som kastar'],
    steps: [
      'Ställ dig med hunden vid din sida på öppen mark med kort gräs.',
      'Be medhjälparen kasta dummyn så att hunden tydligt ser var den landar.',
      'Vänta tills hunden är lugn. Ge sedan din apport­signal och ta emot dummyn när hunden kommer tillbaka.',
    ],
    sketch: {
      points: [
        { x: 65, y: 152, label: 'Förare + hund' },
        { x: 95, y: 38, label: 'Kastare' },
        { x: 245, y: 38, label: 'Apport' },
      ],
      arrows: [
        { from: [109, 38], to: [229, 38], dashed: true },
        { from: [78, 143], to: [232, 48], dashed: false },
      ],
    },
  },
  {
    id: 'linjetag-langs-en-stig',
    title: 'Linjetag längs en stig',
    category: 'Dirigering och linjetag',
    description:
      'Hunden skickas rakt fram längs en stig till en apport som den har sett dig lägga ut.',
    equipment: ['En dummy'],
    steps: [
      'Välj en rak, lugn stig och lägg ut dummyn medan hunden ser på.',
      'Gå tillsammans tillbaka till startpunkten och ställ upp med hunden riktad längs stigen.',
      'Skicka hunden rakt fram mot dummyn och ta emot den vid startpunkten.',
    ],
    sketch: {
      points: [
        { x: 65, y: 145, label: 'Förare + hund' },
        { x: 245, y: 45, label: 'Apport' },
      ],
      arrows: [
        { from: [78, 138], to: [231, 53], dashed: false },
      ],
    },
  },
  {
    id: 'stadga-nar-en-annan-hund-arbetar',
    title: 'Stadga när en annan hund arbetar',
    category: 'Stadga och passivitet',
    description:
      'Hunden tränar på att sitta lugnt vid din sida medan en annan hund hämtar en apport.',
    equipment: ['En dummy', 'En medhjälpare med en apporterande hund'],
    steps: [
      'Placera dig och din hund vid sidan av den andra hundens arbetslinje. Börja på ett avstånd där din hund kan vara lugn.',
      'Låt medhjälparen skicka sin hund till en utlagd dummy medan din hund väntar vid din sida.',
      'Belöna att din hund väntar lugnt. Öka avståndet till arbetslinjen om hunden har svårt att sitta kvar.',
    ],
    sketch: {
      points: [
        { x: 82, y: 148, label: 'Förare + väntande hund' },
        { x: 80, y: 46, label: 'Arbetande hund' },
        { x: 245, y: 46, label: 'Apport' },
      ],
      arrows: [
        { from: [94, 46], to: [229, 46], dashed: false },
      ],
    },
  },
]
