import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import { externalProps } from '@/lib/links'
import { useInView, useReducedMotion, useScramble } from '@/lib/motion'
import { Pixel, PixelArrow, type IconName } from '@/components/pixel'

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function Section({
  n,
  id,
  dark = false,
  className,
  frameClassName,
  children,
  numberClassName,
}: {
  n: string
  id?: string
  dark?: boolean
  className?: string
  frameClassName?: string
  numberClassName?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-[var(--header-h)] border-t',
        dark ? 'border-line-dark bg-ink text-white' : 'border-line',
        className,
      )}
    >
      <div className={cn('frame border-x', dark ? 'border-line-dark' : 'border-line', frameClassName)}>
        <SectionNumber n={n} dark={dark} className={numberClassName} />
        {children}
      </div>
    </section>
  )
}

export function SectionNumber({ n, dark, className }: { n: string; dark?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'label pointer-events-none z-10 block px-4 pt-6 md:px-6 xl:absolute xl:top-8 xl:left-[calc(32px-var(--rail))] xl:p-0',
        dark ? 'text-muted-3' : 'text-muted',
        className,
      )}
    >
      <Scramble text={n} />
    </span>
  )
}

/** Content gutter used by most sections. */
export const gutter = 'px-4 md:px-6'

/* ------------------------------------------------------------------ */
/* Text motion                                                         */
/* ------------------------------------------------------------------ */

export function Scramble({
  text,
  className,
  delay = 0,
  duration,
}: {
  text: string
  className?: string
  delay?: number
  duration?: number
}) {
  const [ref, inView] = useInView<HTMLSpanElement>({ amount: 0.5, margin: '0px' })
  const out = useScramble(text, inView, duration ?? Math.min(300 + text.length * 30, 900), delay)
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  fade = false,
  amount = 0.15,
  style,
}: {
  as?: ElementType
  children?: ReactNode
  className?: string
  delay?: number
  fade?: boolean
  amount?: number
  style?: CSSProperties
}) {
  const [ref, inView] = useInView<HTMLElement>({ amount })
  return (
    <Tag
      ref={ref}
      className={cn(fade ? 'reveal-fade' : 'reveal', inView && 'in', className)}
      style={{ '--d': `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

/**
 * Word-by-word headline reveal. Strings are split into words; elements
 * (e.g. a styled span) are treated as one word each, keeping their styling.
 */
export function Words({
  as: Tag = 'h2',
  children,
  className,
  delay = 0,
}: {
  as?: ElementType
  children: ReactNode
  className?: string
  delay?: number
}) {
  const [ref, inView] = useInView<HTMLElement>({ amount: 0.3 })
  let i = 0
  const parts: ReactNode[] = []
  const pushText = (text: string, key: string) => {
    const tokens = text.split(/(\s+)/)
    tokens.forEach((tok, j) => {
      if (!tok) return
      if (/^\s+$/.test(tok)) parts.push(<Fragment key={`${key}-s${j}`}> </Fragment>)
      else
        parts.push(
          <span key={`${key}-${j}`} className="w" style={{ '--i': i++ } as CSSProperties}>
            {tok}
          </span>,
        )
    })
  }
  Children.forEach(children, (child, ci) => {
    if (typeof child === 'string' || typeof child === 'number') pushText(String(child), `t${ci}`)
    else if (isValidElement(child) && child.type === 'br') parts.push(<br key={`br${ci}`} />)
    else if (isValidElement(child))
      parts.push(
        <span key={`e${ci}`} className="w" style={{ '--i': i++ } as CSSProperties}>
          {child}
        </span>,
      )
  })
  return (
    <Tag ref={ref} className={cn('words', inView && 'in', className)} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {parts}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export function Chip({ children, dark = false, className }: { children: string; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'label inline-flex items-center gap-2 border px-2 py-[7px] leading-none',
        dark ? 'border-line-dark bg-ink-2 text-white' : 'border-line-2 bg-white/50 text-ink',
        className,
      )}
    >
      <span className="size-[6px] bg-accent" aria-hidden="true" />
      <Scramble text={children} />
    </span>
  )
}

export function Brackets({ className, dark = false, size = 12 }: { className?: string; dark?: boolean; size?: number }) {
  const c = dark ? 'border-white/30' : 'border-ink/30'
  const s = { width: size, height: size }
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden="true">
      <span style={s} className={cn('absolute top-0 left-0 border-t border-l', c)} />
      <span style={s} className={cn('absolute top-0 right-0 border-t border-r', c)} />
      <span style={s} className={cn('absolute bottom-0 left-0 border-b border-l', c)} />
      <span style={s} className={cn('absolute right-0 bottom-0 border-r border-b', c)} />
    </div>
  )
}

export function CornerDots({ className }: { className?: string }) {
  const d = 'absolute size-[5px] bg-accent'
  return (
    <div className={cn('pointer-events-none absolute -inset-[3px]', className)} aria-hidden="true">
      <span className={cn(d, 'top-0 left-0')} />
      <span className={cn(d, 'top-0 right-0')} />
      <span className={cn(d, 'bottom-0 left-0')} />
      <span className={cn(d, 'right-0 bottom-0')} />
    </div>
  )
}

export function ArrowLink({
  children,
  href = '#',
  dark = false,
  className,
}: {
  children: ReactNode
  href?: string
  dark?: boolean
  className?: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href}
      {...externalProps(href)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        'group inline-flex items-center gap-2.5 border-b border-dashed pb-1.5 text-[16px] font-medium transition-colors duration-200',
        dark ? 'border-white/30 text-white hover:border-white' : 'border-line-2 text-ink hover:border-ink',
        className,
      )}
    >
      {children}
      <span
        className="inline-flex transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: hover ? 'translate(2px,-2px)' : 'none' }}
      >
        <Pixel name="arrowUpRight" size={2} />
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Pixel-dissolve button                                               */
/* ------------------------------------------------------------------ */

type Variant = 'dark' | 'light' | 'accent'

const VARIANTS: Record<
  Variant,
  { bg: string; fg: string; glyph: string; fill: string; fgHover: string; glyphHover: string; border: string }
> = {
  dark: { bg: '#111111', fg: '#ffffff', glyph: '#ff4f00', fill: '#ff4f00', fgHover: '#ffffff', glyphHover: '#111111', border: '#111111' },
  light: { bg: '#ffffff', fg: '#111111', glyph: '#ff4f00', fill: '#ff4f00', fgHover: '#ffffff', glyphHover: '#111111', border: '#ffffff' },
  accent: { bg: '#ff4f00', fg: '#ffffff', glyph: '#111111', fill: '#111111', fgHover: '#ffffff', glyphHover: '#ff4f00', border: '#ff4f00' },
}

const CELL = 4

export function PixelButton({
  children,
  href = '#',
  variant = 'dark',
  icon = 'asterisk',
  block = false,
  className,
  autoReveal = false,
  onClick,
}: {
  children: ReactNode
  href?: string
  variant?: Variant
  icon?: IconName
  block?: boolean
  className?: string
  /** play the dissolve once when scrolled into view (used on the featured plan) */
  autoReveal?: boolean
  onClick?: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState(false)
  const [revealRef, inView] = useInView<HTMLAnchorElement>({ amount: 0.6 })
  const reduced = useReducedMotion()
  const [revealed, setRevealed] = useState(!autoReveal || reduced)
  const progress = useRef(0)
  const thresholds = useRef<Float32Array | null>(null)
  const dims = useRef({ cols: 0, rows: 0 })

  const intro = !revealed
  const base = intro ? VARIANTS.dark : VARIANTS[variant]
  // intro: dissolve from dark into the button's real colour; otherwise hover fill
  const fillColor = intro ? VARIANTS[variant].bg : base.fill
  const on = intro ? inView : hover

  const fillRef = useRef(fillColor)
  fillRef.current = fillColor

  const draw = () => {
    const c = canvasRef.current
    const ctx = c?.getContext('2d')
    const t = thresholds.current
    if (!c || !ctx || !t) return
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    const p = progress.current
    if (p <= 0) return
    ctx.fillStyle = fillRef.current
    const { cols, rows } = dims.current
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) if (t[y * cols + x] < p) ctx.fillRect(x * CELL, y * CELL, CELL, CELL)
  }
  const drawRef = useRef(draw)
  drawRef.current = draw

  // size the canvas + build a dissolve order (noise biased left → right)
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const setup = () => {
      const dpr = window.devicePixelRatio || 1
      const w = c.clientWidth
      const h = c.clientHeight
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      const cols = Math.ceil(w / CELL)
      const rows = Math.ceil(h / CELL)
      dims.current = { cols, rows }
      const t = new Float32Array(cols * rows)
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) t[y * cols + x] = 0.55 * Math.random() + 0.45 * (x / cols)
      thresholds.current = t
      drawRef.current()
    }
    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(c)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const draw = () => drawRef.current()
    let raf = 0
    const goal = on ? 1.001 : 0
    const speed = intro ? 1 / 900 : 1 / 280
    let last = performance.now()
    const step = (now: number) => {
      const dt = now - last
      last = now
      const p = progress.current
      if (reduced) progress.current = goal
      else progress.current = goal > p ? Math.min(goal, p + dt * speed) : Math.max(goal, p - dt * speed)
      draw()
      if (progress.current !== goal) raf = requestAnimationFrame(step)
      else if (intro && goal > 1) {
        progress.current = 0
        setRevealed(true)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [on, fillColor, reduced, intro])

  const lit = hover && revealed
  return (
    <a
      ref={revealRef}
      href={href}
      {...externalProps(href)}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        'relative inline-flex h-14 items-center overflow-hidden px-6 text-[16px] leading-none font-medium whitespace-nowrap select-none',
        block && 'flex w-full',
        className,
      )}
      style={{
        background: base.bg,
        color: lit ? base.fgHover : base.fg,
        border: `1px solid ${lit ? base.fill : base.border}`,
        transition: 'color 200ms 60ms, border-color 200ms 80ms, background-color 0ms',
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      <span className={cn('relative flex items-center gap-3', block && 'w-full')}>
        <span style={{ color: lit ? base.glyphHover : base.glyph, transition: 'color 160ms 80ms' }}>
          <Pixel name={icon} size={3} />
        </span>
        <span className={cn(block && 'flex-1 text-center')}>{children}</span>
        <PixelArrow on={lit} />
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(command).catch(() => {})
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1400)
      }}
      className={cn(
        'group inline-flex items-center gap-2.5 font-mono text-[14px] tracking-[0.02em] text-muted transition-colors hover:text-ink',
        className,
      )}
    >
      <span>$ {command}</span>
      <span className="relative inline-flex size-[14px] items-center justify-center">
        <span className={cn('absolute transition-all duration-200', copied ? 'scale-50 opacity-0' : 'opacity-100')}>
          <Pixel name="copy" size={2} />
        </span>
        <span
          className={cn(
            'absolute text-accent transition-all duration-200',
            copied ? 'opacity-100' : 'scale-50 opacity-0',
          )}
        >
          <Pixel name="check" size={2} />
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  )
}
