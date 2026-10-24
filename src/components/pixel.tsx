import { memo, type CSSProperties } from 'react'

/** 7×7 (and a few larger) bitmaps lifted from / matched to the reference glyph set. */
export const ICONS = {
  logo: ['0011100', '0100010', '1001001', '1011101', '1001001', '0100010', '0011100'],
  asterisk: ['1001001', '0101010', '0011100', '1111111', '0011100', '0101010', '1001001'],
  arrowRight: ['0001000', '0000100', '0000010', '1111111', '0000010', '0000100', '0001000'],
  arrowLeft: ['0001000', '0010000', '0100000', '1111111', '0100000', '0010000', '0001000'],
  arrowUpRight: ['0011111', '0000011', '0000101', '0001001', '0010000', '0100000', '1000000'],
  retrieve: ['0111110', '1000001', '0111110', '1000001', '0111110', '1000001', '0111110'],
  tool: ['0011100', '0010100', '1110111', '1000001', '1110111', '0010100', '0011100'],
  verify: ['1111111', '1000001', '1100011', '1010101', '1001001', '1000001', '1111111'],
  respond: ['0001000', '0011100', '0101010', '1001001', '0001000', '0001000', '0001000'],
  quanta: ['1110111', '1010101', '1110111', '0000000', '1110111', '1010101', '1110111'],
  hexbyte: ['0011100', '1100011', '1010101', '1001001', '1001001', '1101011', '0011100'],
  loomstack: ['1110000', '0000000', '0111100', '0000000', '0001110', '0000000', '0000111'],
  parcel: ['0100010', '0100010', '1111111', '1111111', '0111110', '0011100', '0001000'],
  tracing: ['1100000', '0000000', '0111000', '0000000', '0011110', '0000000', '0000111'],
  dollar: ['0001000', '0111110', '1001000', '0111110', '0001001', '0111110', '0001000'],
  shield: ['1111111', '1000001', '1001001', '1011101', '0101010', '0010100', '0001000'],
  grid: ['1110111', '1010101', '1110111', '0000000', '1110111', '1010101', '1110111'],
  cloud: ['0000000', '0011000', '0100110', '1000001', '1000001', '0111110', '0000000'],
  check: ['0000000', '0000001', '0000010', '1000100', '0101000', '0010000', '0000000'],
  pause: ['0000000', '0110110', '0110110', '0110110', '0110110', '0110110', '0000000'],
  play: ['0100000', '0110000', '0111000', '0111100', '0111000', '0110000', '0100000'],
  quote: ['0000000', '1100110', '1100110', '0100010', '1000100', '0000000', '0000000'],
  lock: ['0011100', '0100010', '0100010', '1111111', '1110111', '1110111', '1111111'],
  chat: ['1111111', '1000001', '1010101', '1000001', '1111111', '0110000', '0100000'],
  search: ['0111000', '1000100', '1000100', '1000100', '0111100', '0000110', '0000011'],
  plug: ['0100100', '0100100', '1111110', '1111110', '0111100', '0011000', '0011000'],
  copy: ['1111100', '1000100', '1011111', '1010001', '1110001', '0010001', '0011111'],
  stair: ['1110', '1000', '1000', '0000'],
  /** large badge used on the hub cube / server stack */
  badge: [
    '0000001000000',
    '0000011100000',
    '0000110110000',
    '0001100011000',
    '0011001001100',
    '0110011100110',
    '1100111110011',
    '0110011100110',
    '0011001001100',
    '0001100011000',
    '0000110110000',
    '0000011100000',
    '0000001000000',
  ],
} as const

export type IconName = keyof typeof ICONS

function rowsToPath(rows: readonly string[]) {
  let d = ''
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (row[x] === '1') {
        let w = 1
        while (row[x + w] === '1') w++
        d += `M${x} ${y}h${w}v1h-${w}z`
        x += w
      } else x++
    }
  })
  return d
}

const pathCache = new Map<string, string>()
function pathFor(rows: readonly string[]) {
  const key = rows.join('/')
  let p = pathCache.get(key)
  if (!p) {
    p = rowsToPath(rows)
    pathCache.set(key, p)
  }
  return p
}

export const Pixel = memo(function Pixel({
  name,
  rows,
  size = 3,
  className,
  style,
  title,
}: {
  name?: IconName
  rows?: readonly string[]
  /** CSS px per bitmap pixel */
  size?: number
  className?: string
  style?: CSSProperties
  title?: string
}) {
  const bitmap = rows ?? (name ? ICONS[name] : ICONS.asterisk)
  const w = bitmap[0].length
  const h = bitmap.length
  return (
    <svg
      width={w * size}
      height={h * size}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={pathFor(bitmap)} fill="currentColor" />
    </svg>
  )
})

/** Arrow that "draws" itself pixel by pixel when `on` (used in buttons and links). */
export function PixelArrow({
  on,
  name = 'arrowRight',
  size = 3,
  className,
}: {
  on: boolean
  name?: 'arrowRight' | 'arrowUpRight'
  size?: number
  className?: string
}) {
  const rows = ICONS[name]
  const cells: Array<[number, number]> = []
  rows.forEach((r, y) => r.split('').forEach((c, x) => c === '1' && cells.push([x, y])))
  // order cells along the arrow direction so it draws from tail to head
  cells.sort((a, b) => a[0] - b[0] || b[1] - a[1])
  return (
    <svg
      width={7 * size}
      height={7 * size}
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      {cells.map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1}
          height={1}
          fill="currentColor"
          style={{
            opacity: on ? 1 : 0,
            transition: `opacity 60ms steps(1) ${on ? i * 22 : (cells.length - i) * 12}ms`,
          }}
        />
      ))}
    </svg>
  )
}
