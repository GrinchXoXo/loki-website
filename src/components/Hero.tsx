import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { mulberry32, useInView, useInterval, useOnScreen, useReducedMotion, useWidth } from '@/lib/motion'
import { ICONS, Pixel, type IconName } from '@/components/pixel'
import { ArrowLink, PixelButton, Reveal, Scramble, Section, Words } from '@/components/ui'

/* ------------------------------------------------------------------ */
/* 02 — headline                                                       */
/* ------------------------------------------------------------------ */

export function Hero() {
  return (
    <Section n="02" id="top" className="border-t-0">
      <span className="absolute -top-px -left-px z-10 text-accent" aria-hidden="true">
        <Pixel rows={['1110', '1100', '1000']} size={4} />
      </span>
      <div className="px-4 pt-6 pb-14 md:px-6 md:pt-10 md:pb-16 xl:px-2 xl:pt-16">
        <div className="flex items-start gap-3 md:gap-4">
          <Reveal className="mt-[6px] text-muted md:mt-[10px] xl:mt-[14px]" delay={60}>
            <Pixel name="asterisk" size={5} className="size-[28px] md:size-[35px]" />
          </Reveal>
          <Words
            as="h1"
            delay={120}
            className="display text-[46px] leading-[1] tracking-[-0.045em] md:text-[68px] xl:text-[88px]"
          >
            Your voice.
            <br />
            A <span className="pixel tracking-[-0.03em] text-accent">different</span>{' '}
            <span className="pixel tracking-[-0.03em] text-accent">
              sound<span className="font-sans text-ink">.</span>
            </span>
          </Words>
        </div>

        <div className="mt-10 grid gap-10 md:mt-12 xl:mt-10 xl:grid-cols-[672px_1fr] xl:gap-0">
          <Reveal as="p" delay={420} className="max-w-[560px] text-[18px] leading-[1.6] text-muted md:text-[20px] md:leading-[30px]">
            Loki changes how your voice sounds, live on WhatsApp and Telegram calls and in voice notes. Keep your real
            voice private, give your content a character, or play with friends.
          </Reveal>
          <Reveal delay={560} className="flex flex-col gap-6 xl:gap-4">
            <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:gap-8">
              <PixelButton href="#problem" className="w-full sm:w-auto">
                Explore Loki
              </PixelButton>
              <ArrowLink href="#how">How it works</ArrowLink>
            </div>
            <p className="flex flex-col gap-1 font-mono text-[14px] tracking-[0.02em] text-muted">
              <span className="label text-ink">Loki voice engine</span>
              <span>Input → Voice conversion → Output</span>
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* 03 — voice pipeline grid                                             */
/* ------------------------------------------------------------------ */

type NodeDef = { id: string; label: string; icon: IconName; c: number; r: number }

const DESKTOP = {
  cols: 14,
  rows: 5,
  nodes: [
    { id: 'router', label: 'Voice input', icon: 'asterisk', c: 1, r: 1 },
    { id: 'retrieve', label: 'Capture', icon: 'retrieve', c: 4, r: 0 },
    { id: 'tool', label: 'Conversion', icon: 'tool', c: 6, r: 2 },
    { id: 'verify', label: 'Voice output', icon: 'respond', c: 9, r: 1 },
    { id: 'respond', label: 'Playback', icon: 'play', c: 11, r: 3 },
  ] as NodeDef[],
}

const MOBILE = {
  cols: 7.5,
  rows: 6,
  nodes: [
    { id: 'router', label: 'Voice input', icon: 'asterisk', c: 0, r: 1 },
    { id: 'retrieve', label: 'Capture', icon: 'retrieve', c: 1, r: 0 },
    { id: 'tool', label: 'Conversion', icon: 'tool', c: 2, r: 2 },
    { id: 'verify', label: 'Voice output', icon: 'respond', c: 3, r: 1 },
    { id: 'respond', label: 'Playback', icon: 'play', c: 4, r: 3 },
  ] as NodeDef[],
}

/** Manhattan route visiting every node in order, entering from the left edge. */
function buildPath(nodes: NodeDef[]) {
  const pts: Array<[number, number]> = []
  let [x, y] = [-1, nodes[0].r]
  const push = () => pts.push([x, y])
  for (const n of nodes) {
    while (x !== n.c) {
      x += Math.sign(n.c - x)
      push()
    }
    while (y !== n.r) {
      y += Math.sign(n.r - y)
      push()
    }
  }
  // drift out through the respond label
  for (let i = 0; i < 3; i++) {
    x += 1
    push()
  }
  return pts.filter(([px]) => px >= 0)
}

const DITHER = [1, 0.75, 0.5, 0.25, 0.125]

export function HeroGrid() {
  const [wrapRef, width] = useWidth<HTMLDivElement>()
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>()
  const [introRef, inView] = useInView<HTMLDivElement>({ amount: 0.25 })
  const reduced = useReducedMotion()
  const mobile = width > 0 && width < 700
  const layout = mobile ? MOBILE : DESKTOP
  const cell = width ? width / layout.cols : 80
  const height = Math.round(cell * layout.rows)

  const path = useMemo(() => buildPath(layout.nodes), [layout])
  const [head, setHead] = useState(-1)
  const [lit, setLit] = useState<Record<string, number>>({})

  // advance the packet one cell at a time
  useInterval(
    () => {
      setHead((h) => {
        const next = h + 1 >= path.length + DITHER.length + 4 ? 0 : h + 1
        const p = path[next]
        if (p) {
          const node = layout.nodes.find((n) => n.c === p[0] && n.r === p[1])
          if (node) {
            setLit((l) => ({ ...l, [node.id]: performance.now() }))
          }
        }
        return next
      })
    },
    onScreen && inView && !reduced ? 115 : null,
  )

  // decay node highlights
  const [, force] = useState(0)
  useInterval(() => force((x) => x + 1), onScreen && !reduced ? 120 : null)
  const now = performance.now()

  const setRefs = (el: HTMLDivElement | null) => {
    wrapRef.current = el
    screenRef.current = el
    introRef.current = el
  }

  const trail: Array<{ x: number; y: number; d: number; i: number }> = []
  for (let i = 0; i < DITHER.length; i++) {
    const p = path[head - i]
    if (p) trail.push({ x: p[0], y: p[1], d: DITHER[i], i })
  }

  return (
    <section aria-label="Illustration of the voice transformation pipeline" className="relative border-t border-line">
      <div className="frame border-x border-line">
        <span className="label pointer-events-none absolute top-6 left-4 z-20 text-muted md:left-6 xl:top-8 xl:left-[calc(32px-var(--rail))]">
          <Scramble text="03" />
        </span>
        <div
          ref={setRefs}
          className="relative overflow-hidden"
          style={{
            height,
            backgroundImage:
              'linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)',
            backgroundSize: `${cell}px ${cell}px`,
            backgroundPosition: '-1px -1px',
          }}
        >
          {/* packet trail */}
          <svg className="pointer-events-none absolute inset-0" width="100%" height={height} aria-hidden="true">
            <defs>
              {DITHER.map((d, i) => (
                <pattern key={d} id={`dith-${i}`} width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect width="2" height="2" fill="var(--color-accent)" />
                  {d >= 0.25 && <rect x="4" y="4" width="2" height="2" fill="var(--color-accent)" />}
                  {d >= 0.5 && <rect x="4" width="2" height="2" fill="var(--color-accent)" />}
                  {d >= 0.75 && <rect y="4" width="2" height="2" fill="var(--color-accent)" />}
                </pattern>
              ))}
            </defs>
            {trail.map((t) => (
              <rect
                key={`${t.x}-${t.y}`}
                x={t.x * cell + 0.5}
                y={t.y * cell + 0.5}
                width={cell - 1}
                height={cell - 1}
                fill={`url(#dith-${t.i})`}
                opacity={0.75}
              />
            ))}
          </svg>

          {layout.nodes.map((n) => {
            const age = lit[n.id] ? now - lit[n.id] : Infinity
            const on = age < 1100
            return (
              <div
                key={n.id}
                className="absolute flex"
                style={{ left: n.c * cell, top: n.r * cell, height: cell }}
              >
                <div
                  className="relative border-x border-line transition-colors duration-200"
                  style={{ width: cell, background: on ? 'var(--color-accent-tint)' : 'var(--color-paper)' }}
                >
                  <svg className="absolute inset-0 size-full" viewBox="0 0 80 80" preserveAspectRatio="none" aria-hidden="true">
                    <line
                      x1="0"
                      y1="80"
                      x2="80"
                      y2="0"
                      vectorEffect="non-scaling-stroke"
                      stroke={on ? 'var(--color-accent)' : 'var(--color-line-2)'}
                      strokeWidth="1"
                      style={{ transition: 'stroke 200ms' }}
                    />
                  </svg>
                  <span className="absolute right-1.5 bottom-1.5 font-mono text-[11px] leading-none text-muted tabular-nums md:text-[12px]">
                    {String(layout.nodes.indexOf(n) + 1).padStart(2, '0')}
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 border-r border-line px-2 transition-colors duration-200 md:gap-3 md:px-5"
                  style={{ width: cell * 2, background: on && age < 700 ? 'var(--color-accent-tint)' : 'transparent' }}
                >
                  <Pixel
                    rows={ICONS[n.icon]}
                    size={mobile ? 2 : 3}
                    className="transition-colors duration-200"
                    style={{ color: on ? 'var(--color-accent)' : 'var(--color-ink)' }}
                  />
                  <span className="label text-[10px] whitespace-nowrap text-ink md:text-[12px]">{n.label}</span>
                </div>
              </div>
            )
          })}

          {/* panel status — illustrative, not a live measurement */}
          {!mobile && (
            <div
              className="absolute top-0 right-0 hidden flex-col justify-center gap-1.5 border-b border-l border-line bg-paper px-6 md:flex"
              style={{ height: cell }}
            >
              <span className="label text-muted">Voice transformation</span>
              <span className="label flex items-center gap-2 text-ink">
                <span className="size-[6px] bg-accent" style={{ animation: reduced ? undefined : 'led 1.6s ease-in-out infinite' }} />
                Audio processing
              </span>
            </div>
          )}
          <span className="label absolute bottom-3 left-4 z-10 text-[10px] text-muted md:left-5">Loki · Voice engine</span>

          <Histogram width={width} rows={2} cell={cell} play={inView} pixel={mobile ? 6 : 8} />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Dithered audio-energy curve (animates in, then twinkles)           */
/* ------------------------------------------------------------------ */

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((r) => r.map((v) => (v + 0.5) / 16))

const Histogram = memo(function Histogram({
  width,
  rows,
  cell,
  play,
  pixel,
}: {
  width: number
  rows: number
  cell: number
  play: boolean
  pixel: number
}) {
  const H = Math.round(cell * rows)
  const reduced = useReducedMotion()
  const cells = useMemo(() => {
    if (!width) return []
    const rand = mulberry32(42)
    const cols = Math.floor(width / pixel)
    const nRows = Math.floor(H / pixel)
    const cx = cols / 2
    const sigma = cols * 0.3
    const out: Array<{ x: number; y: number; delay: number }> = []
    for (let c = 0; c < cols; c++) {
      const g = Math.exp(-Math.pow((c - cx) / sigma, 2))
      if (g < 0.12) continue
      const top = nRows * (0.2 + 0.9 * g)
      for (let r = 0; r < nRows; r++) {
        const fromBottom = r + 0.5
        if (fromBottom > top) continue
        const dens = Math.min(1, Math.pow(1 - fromBottom / (top + 0.001), 0.9) * (0.35 + g * 1.2))
        if (dens > BAYER[r % 4][c % 4]) {
          out.push({
            x: c * pixel,
            y: H - (r + 1) * pixel,
            delay: (fromBottom / nRows) * 700 + Math.abs(c - cx) * 6 + rand() * 260,
          })
        }
      }
    }
    return out
  }, [width, H, pixel])

  // a handful of pixels blink at a time once settled
  const [off, setOff] = useState<Set<number>>(new Set())
  const [settled, setSettled] = useState(false)
  const timer = useRef(0)
  useEffect(() => {
    if (!play) return
    timer.current = window.setTimeout(() => setSettled(true), 1800)
    return () => window.clearTimeout(timer.current)
  }, [play])
  useInterval(
    () => {
      const s = new Set<number>()
      for (let i = 0; i < 10; i++) s.add(Math.floor(Math.random() * cells.length))
      setOff(s)
    },
    settled && !reduced && cells.length ? 260 : null,
  )

  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0"
      width={width}
      height={H}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {cells.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={pixel}
          height={pixel}
          fill="var(--color-accent)"
          style={
            {
              opacity: play && !off.has(i) ? 1 : 0,
              transition: settled ? 'opacity 80ms steps(1)' : `opacity 1ms steps(1) ${p.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  )
})

/* ------------------------------------------------------------------ */
/* 04 — logo strip                                                     */
/* ------------------------------------------------------------------ */

const platforms: Array<{ name: string; icon: IconName; tag?: string }> = [
  { name: 'Voice notes', icon: 'chat' },
  { name: 'WhatsApp calls', icon: 'respond', tag: 'Real-time' },
  { name: 'Telegram calls', icon: 'respond', tag: 'Real-time' },
]

export function Logos() {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.4 })
  return (
    <Section n="04" numberClassName="xl:top-1/2 xl:-translate-y-1/2">
      <div
        ref={ref}
        className="flex flex-col gap-6 px-4 pt-8 pb-12 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-10 md:gap-y-6 md:px-6 md:py-14 xl:h-[176px] xl:flex-nowrap xl:px-12 xl:py-0"
      >
        <span
          className="label text-muted transition-opacity duration-700"
          style={{ opacity: inView ? 1 : 0 }}
        >
          <Scramble text="Where Loki fits" />
        </span>
        {platforms.map((l, i) => (
          <div
            key={l.name}
            className="flex items-center gap-2.5 text-muted transition-[opacity,transform,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(10px)',
              transitionDelay: `${(i + 1) * 80}ms`,
            }}
          >
            <Pixel name={l.icon} size={3} />
            <span className="text-[19px] leading-none font-medium tracking-[-0.02em] md:text-[20px]">{l.name}</span>
            {l.tag && (
              <span className="label border border-line-2 px-1.5 py-1 text-[10px] leading-none text-muted">{l.tag}</span>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
