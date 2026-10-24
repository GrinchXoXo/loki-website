import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useInterval, useReducedMotion } from '@/lib/motion'
import { ICONS } from '@/components/pixel'

/* Isometric projection: +x runs right-down, +y runs left-down, +z up. */
const C = Math.cos(Math.PI / 6)
const S = 0.5

export function P(x: number, y: number, z = 0, ox = 0, oy = 0): [number, number] {
  return [ox + (x - y) * C, oy + (x + y) * S - z]
}
const pts = (arr: Array<[number, number]>) => arr.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

export type Tone = 'solid' | 'dashed' | 'accent' | 'ghost' | 'dark' | 'darkDashed' | 'glow'

const TONES: Record<Tone, { stroke: string; top: string; left: string; right: string; dash?: string; width?: number }> = {
  solid: { stroke: '#111', top: '#ffffff', left: '#efefea', right: '#e2e2dc' },
  dashed: { stroke: '#88887f', top: 'rgba(255,255,255,0.6)', left: 'rgba(236,236,231,0.6)', right: 'rgba(226,226,220,0.6)', dash: '2 3' },
  ghost: { stroke: '#88887f', top: 'none', left: 'none', right: 'none', dash: '2 3' },
  accent: { stroke: '#ff4f00', top: 'rgba(255,79,0,0.14)', left: 'rgba(255,79,0,0.24)', right: 'rgba(255,79,0,0.36)' },
  glow: { stroke: '#ff7a3d', top: '#ff5a12', left: '#e54500', right: '#c43a00' },
  dark: { stroke: 'rgba(255,255,255,0.55)', top: '#151514', left: '#121211', right: '#0e0e0d' },
  darkDashed: { stroke: 'rgba(255,255,255,0.35)', top: 'none', left: 'none', right: 'none', dash: '1.5 2.5' },
}

export function Box({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  tone = 'solid',
  ox = 0,
  oy = 0,
  style,
  className,
  children,
}: {
  x: number
  y: number
  z?: number
  w: number
  d: number
  h: number
  tone?: Tone
  ox?: number
  oy?: number
  style?: CSSProperties
  className?: string
  children?: ReactNode
}) {
  const t = TONES[tone]
  const p = (a: number, b: number, c: number) => P(a, b, c, ox, oy)
  const top = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)]
  const left = [p(x, y + d, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x, y + d, z)]
  const right = [p(x + w, y, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x + w, y, z)]
  const common = {
    stroke: t.stroke,
    strokeWidth: t.width ?? 1,
    strokeDasharray: t.dash,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  }
  return (
    <g style={style} className={className}>
      <polygon points={pts(left)} fill={t.left} {...common} />
      <polygon points={pts(right)} fill={t.right} {...common} />
      <polygon points={pts(top)} fill={t.top} {...common} />
      {children}
    </g>
  )
}

/** Paint a bitmap flat onto a top face (z plane). */
export function TopBitmap({
  rows,
  x,
  y,
  z,
  cell,
  ox = 0,
  oy = 0,
  color = '#ff4f00',
  style,
}: {
  rows: readonly string[]
  x: number
  y: number
  z: number
  cell: number
  ox?: number
  oy?: number
  color?: string
  style?: CSSProperties
}) {
  const [tx, ty] = P(x, y, z, ox, oy)
  let d = ''
  rows.forEach((r, j) => r.split('').forEach((c, i) => c === '1' && (d += `M${i} ${j}h1v1h-1z`)))
  return (
    <path
      d={d}
      fill={color}
      transform={`matrix(${C * cell} ${S * cell} ${-C * cell} ${S * cell} ${tx} ${ty})`}
      style={style}
    />
  )
}

/** A bitmap painted on the right (x = const) face, e.g. vents / LEDs. */
function sidePoly(x: number, y: number, z: number, w: number, h: number, ox: number, oy: number) {
  return pts([P(x, y, z + h, ox, oy), P(x, y + w, z + h, ox, oy), P(x, y + w, z, ox, oy), P(x, y, z, ox, oy)])
}
function frontPoly(x: number, y: number, z: number, w: number, h: number, ox: number, oy: number) {
  return pts([P(x, y, z + h, ox, oy), P(x + w, y, z + h, ox, oy), P(x + w, y, z, ox, oy), P(x, y, z, ox, oy)])
}

function Label({ x, y, children, accent = false, anchor = 'middle' }: { x: number; y: number; children: string; accent?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily="var(--font-mono)"
      fontSize="11"
      letterSpacing="0.02em"
      fill={accent ? '#ff4f00' : '#66665f'}
    >
      {children}
    </text>
  )
}

function Dash({ a, b, accent = false, style }: { a: [number, number]; b: [number, number]; accent?: boolean; style?: CSSProperties }) {
  return (
    <line
      x1={a[0]}
      y1={a[1]}
      x2={b[0]}
      y2={b[1]}
      stroke={accent ? '#ff4f00' : '#88887f'}
      strokeWidth="1"
      strokeDasharray="2 3"
      vectorEffect="non-scaling-stroke"
      style={style}
    />
  )
}

function useCycle(n: number, ms: number, active = true) {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  useInterval(() => setI((v) => (v + 1) % n), active && !reduced ? ms : null)
  return i
}

/** progress 0→1 looping, for things travelling along a line */
function useLoop(ms: number, active = true) {
  const [t, setT] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!active || reduced) return
    let id = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      setT(((now - t0) % ms) / ms)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [ms, active, reduced])
  return t
}

const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** World x/y for a box whose base centre lands on screen offset (sx, sy) from the origin. */
function at(sx: number, sy: number, w: number, d: number) {
  const cx = (sx / C + 2 * sy) / 2
  const cy = (2 * sy - sx / C) / 2
  return { x: cx - w / 2, y: cy - d / 2 }
}

const svgProps = {
  className: 'absolute inset-0 size-full',
  preserveAspectRatio: 'xMidYMid meet',
  'aria-hidden': true,
} as const

/* ------------------------------------------------------------------ */
/* How it works — 1. Connect                                           */
/* ------------------------------------------------------------------ */

type Sat = { id: string; sx: number; sy: number }
const SATS = (ids: string[]): Sat[] => [
  { id: ids[0], sx: -170, sy: -55 },
  { id: ids[1], sx: 170, sy: -55 },
  { id: ids[2], sx: -170, sy: 80 },
  { id: ids[3], sx: 170, sy: 80 },
]
const SAT = 56

function Satellite({ s, tone, accent, ox, oy }: { s: Sat; tone: Tone; accent?: boolean; ox: number; oy: number }) {
  const b = at(s.sx, s.sy, SAT, SAT)
  return (
    <g>
      <Box x={b.x} y={b.y} w={SAT} d={SAT} h={SAT} tone={tone} ox={ox} oy={oy} />
      <Label x={ox + s.sx} y={oy + s.sy - SAT - SAT * 0.5 - 12} accent={accent}>
        {s.id}
      </Label>
    </g>
  )
}

export function ConnectScene({ active = true, tight = false }: { active?: boolean; tight?: boolean }) {
  const t = useLoop(2600, active)
  const ox = 280
  const oy = 280
  const sats = SATS(['microphone', 'audio input', 'device', 'permissions'])
  const tones: Tone[] = ['dashed', 'solid', 'dashed', 'solid']
  const hubW = 130
  const hub = at(0, 0, hubW, hubW)
  const hubC: [number, number] = [ox, oy - 40]
  return (
    <svg viewBox={tight ? '40 100 480 310' : '0 0 560 480'} {...svgProps}>
      {sats.map((s, i) => {
        const c: [number, number] = [ox + s.sx, oy + s.sy - SAT / 2]
        const k = (t + i * 0.25) % 1
        const p = lerp(c, hubC, 0.18 + k * 0.5)
        return (
          <g key={s.id}>
            <Dash a={c} b={hubC} />
            <rect x={p[0] - 6} y={p[1] - 6} width="12" height="12" fill="#ff4f00" opacity={k < 0.8 ? 1 : (1 - k) / 0.2} />
          </g>
        )
      })}
      {sats.map((s, i) => (
        <Satellite key={s.id} s={s} tone={tones[i]} accent={s.id === 'audio input'} ox={ox} oy={oy} />
      ))}
      <Box x={hub.x} y={hub.y} w={hubW} d={hubW} h={72} tone="solid" ox={ox} oy={oy}>
        <TopBitmap rows={ICONS.badge} x={hub.x + 42} y={hub.y + 42} z={72} cell={3.6} ox={ox} oy={oy} />
        {[0, 1, 2].map((i) => (
          <polygon
            key={i}
            points={sidePoly(hub.x + hubW, hub.y + 70 + i * 15, 26, 11, 12, ox, oy)}
            fill="none"
            stroke="#111"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </Box>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Orchestrate                                                      */
/* ------------------------------------------------------------------ */

export function OrchestrateScene({ active = true, tight = false }: { active?: boolean; tight?: boolean }) {
  const sats = SATS(['voice input', 'capture', 'voice output', 'playback'])
  const on = useCycle(sats.length, 1700, active)
  const t = useLoop(1700, active)
  const ox = 280
  const oy = 290
  const coreW = 110
  const core = at(0, 0, coreW, coreW)
  const coreC: [number, number] = [ox, oy - 55]
  return (
    <svg viewBox={tight ? '40 105 480 310' : '0 0 560 480'} {...svgProps}>
      {sats.map((s, i) => {
        const c: [number, number] = [ox + s.sx, oy + s.sy - SAT / 2]
        const lit = i === on
        const p = lerp(coreC, c, Math.min(0.25 + t * 0.9, 0.85))
        return (
          <g key={s.id}>
            <Dash a={c} b={coreC} accent={lit} />
            {lit && <rect x={p[0] - 5} y={p[1] - 5} width="10" height="10" fill="#ff4f00" />}
          </g>
        )
      })}
      {sats.map((s, i) => (
        <Satellite key={s.id} s={s} tone={i === on ? 'solid' : 'dashed'} accent={i === on} ox={ox} oy={oy} />
      ))}
      <Box x={core.x} y={core.y} w={coreW} d={coreW} h={coreW} tone="accent" ox={ox} oy={oy} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Deploy                                                           */
/* ------------------------------------------------------------------ */

export function DeployScene({ active = true, tight = false }: { active?: boolean; tight?: boolean }) {
  const reduced = useReducedMotion()
  const tags = ['whatsapp', 'telegram']
  const ox = 280
  const oy = 150
  const top = P(110, 110, 210, ox, oy)
  const base = P(110, 110, 30, ox, oy)
  return (
    <svg viewBox={tight ? '60 80 440 360' : '0 0 560 480'} {...svgProps}>
      <Box x={0} y={0} w={220} d={220} h={18} tone="solid" ox={ox} oy={oy}>
        {[0, 1, 2].map((i) => (
          <polygon key={i} points={sidePoly(220, 150 + i * 16, 4, 10, 9, ox, oy)} fill="none" stroke="#111" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
      </Box>
      <Dash a={top} b={base} accent />
      <Box x={20} y={120} z={18} w={50} d={50} h={50} tone="solid" ox={ox} oy={oy} />
      <Box x={130} y={20} z={18} w={50} d={50} h={50} tone="solid" ox={ox} oy={oy} />
      <Label x={P(20, 120, 90, ox, oy)[0] - 10} y={P(20, 120, 90, ox, oy)[1]}>
        {tags[0]}
      </Label>
      <Label x={P(130, 20, 90, ox, oy)[0] + 40} y={P(130, 20, 90, ox, oy)[1] + 4}>
        {tags[1]}
      </Label>
      <g style={{ animation: reduced || !active ? undefined : 'float-y 2.6s ease-in-out infinite' }}>
        <Box x={75} y={75} z={170} w={70} d={70} h={70} tone="accent" ox={ox} oy={oy} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Monitor                                                          */
/* ------------------------------------------------------------------ */

export function MonitorScene({ active = true, tight = false }: { active?: boolean; tight?: boolean }) {
  const reduced = useReducedMotion()
  const t = useLoop(5200, active)
  const ox = 250
  const oy = 180
  const base = [44, 62, 92, 76, 112]
  const heights = base.map((h, i) => {
    if (reduced) return h
    const w = Math.sin(t * Math.PI * 2 + i * 1.3) * 0.5 + 0.5
    return i === 4 ? h + w * 22 : h * (0.78 + w * 0.36)
  })
  const bars = heights.map((h, i) => ({ x: 20 + i * 40, y: 30, h }))
  const top = (i: number, extra = 0) => P(bars[i].x + 15, bars[i].y + 15, bars[i].h + 8 + extra, ox, oy)
  const a = top(0, 16)
  const m = top(2, 30)
  const b = top(4, 14)
  // point on the quadratic curve where the marker rides
  const k = reduced ? 0.5 : 0.35 + 0.3 * (Math.sin(t * Math.PI * 2) * 0.5 + 0.5)
  const q = (u: number, p0: number, p1: number, p2: number) => (1 - u) * (1 - u) * p0 + 2 * (1 - u) * u * p1 + u * u * p2
  const mk: [number, number] = [q(k, a[0], m[0], b[0]), q(k, a[1], m[1] - 18, b[1])]
  const lbl = P(bars[4].x + 30, bars[4].y, bars[4].h + 24, ox, oy)
  return (
    <svg viewBox={tight ? '140 80 340 290' : '0 0 560 480'} {...svgProps}>
      <Box x={0} y={0} w={230} d={90} h={8} tone="solid" ox={ox} oy={oy} />
      {bars.map((bar, i) => (
        <Box key={i} x={bar.x} y={bar.y} z={8} w={30} d={30} h={bar.h} tone={i === 4 ? 'accent' : 'dashed'} ox={ox} oy={oy} />
      ))}
      <path
        d={`M${a[0]} ${a[1]} Q ${m[0]} ${m[1] - 18} ${b[0]} ${b[1]}`}
        fill="none"
        stroke="#ff4f00"
        strokeWidth="1"
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
      <Box x={-6} y={-6} z={6} w={12} d={12} h={12} tone="glow" ox={mk[0]} oy={mk[1]} />
      <text x={lbl[0] + 6} y={lbl[1]} fontFamily="var(--font-mono)" fontSize="11" fill="#ff4f00">
        real-time
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* With Loki — dark hub                                                */
/* ------------------------------------------------------------------ */

export function DarkHubScene({ active = true }: { active?: boolean }) {
  const t = useLoop(2400, active)
  const ox = 250
  const oy = 215
  const corners: Array<[number, number]> = [
    [-165, -95],
    [165, -95],
    [-165, 105],
    [165, 105],
  ]
  const rays: Array<[number, number]> = [
    [-165, -95],
    [165, -95],
    [-185, 5],
    [185, 5],
    [-165, 105],
    [165, 105],
  ]
  const CW = 62
  const hub = at(0, 0, 46, 46)
  return (
    <svg viewBox="0 0 500 380" {...svgProps}>
      <defs>
        <radialGradient id="dh-glow">
          <stop offset="0%" stopColor="#ff4f00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff4f00" stopOpacity="0" />
        </radialGradient>
      </defs>
      {corners.map(([sx, sy], i) => {
        const b = at(sx, sy, CW, CW)
        return <Box key={i} x={b.x} y={b.y} w={CW} d={CW} h={CW} tone="dark" ox={ox} oy={oy} />
      })}
      {rays.map(([sx, sy], ri) =>
        [0.62, 0.48, 0.34].map((f, k) => {
          const b = at(sx * f, sy * f, 13, 13)
          const phase = (t + ri * 0.13 - k * 0.12 + 1) % 1
          const hot = phase < 0.22
          return <Box key={`${ri}-${k}`} x={b.x} y={b.y} w={13} d={13} h={9} tone={hot ? 'glow' : 'darkDashed'} ox={ox} oy={oy} />
        }),
      )}
      <circle cx={ox} cy={oy - 24} r="78" fill="url(#dh-glow)" style={{ animation: 'glow-pulse 2.4s ease-in-out infinite' }} />
      <Box x={hub.x} y={hub.y} w={46} d={46} h={46} tone="glow" ox={ox} oy={oy} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Reliability — stacked servers                                       */
/* ------------------------------------------------------------------ */

export function StackScene({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  const ox = 230
  const oy = 70
  const W = 230
  const layers = [0, 1, 2, 3]
  const blink = useCycle(4, 900, play)
  return (
    <svg viewBox="0 0 460 440" {...svgProps}>
      {layers.map((level) => {
        const zz = level * 44
        const shown = play || reduced
        return (
          <g
            key={level}
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(-40px)',
              transition: `opacity 500ms ${level * 140}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${level * 140}ms`,
            }}
          >
            <Box x={0} y={0} z={zz} w={W} d={W} h={34} tone="solid" ox={ox} oy={oy + 120}>
              {[0, 1, 2].map((v) => (
                <polygon
                  key={v}
                  points={frontPoly(14 + v * 8, W, zz + 8, 0.01, 18, ox, oy + 120)}
                  fill="none"
                  stroke="#88887f"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {[0, 1].map((v) => (
                <polygon
                  key={`led${v}`}
                  points={sidePoly(W, W - 46 + v * 16, zz + 11, 10, 10, ox, oy + 120)}
                  fill={v === 0 && blink === level ? '#ff4f00' : 'none'}
                  stroke={v === 0 ? '#ff4f00' : '#88887f'}
                  strokeOpacity={v === 0 ? 0.6 : 1}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </Box>
          </g>
        )
      })}
      <g
        style={{
          opacity: play || reduced ? 1 : 0,
          transition: 'opacity 600ms 700ms',
        }}
      >
        <TopBitmap rows={ICONS.badge} x={W / 2 - 30} y={W / 2 - 30} z={3 * 44 + 34} cell={4.6} ox={ox} oy={oy + 120} />
        {[
          [14, 14],
          [W - 14, 14],
          [14, W - 14],
          [W - 14, W - 14],
        ].map(([x, y], i) => {
          const c = P(x, y, 3 * 44 + 34, ox, oy + 120)
          return <ellipse key={i} cx={c[0]} cy={c[1]} rx="4" ry="2.4" fill="#fff" stroke="#111" strokeWidth="1" />
        })}
      </g>
    </svg>
  )
}
