import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useOnScreen, useReducedMotion, useScramble } from '@/lib/motion'
import { Pixel, type IconName } from '@/components/pixel'
import { ArrowLink, Chip, CornerDots, PixelButton, Reveal, Section, Words } from '@/components/ui'
import { LINKS } from '@/lib/links'

/* ------------------------------------------------------------------ */
/* 11 — Community                                                       */
/* ------------------------------------------------------------------ */

const quotes: Array<{ tag: string; icon: IconName; title: string; text: string; href: string }> = [
  {
    tag: 'Voice notes',
    icon: 'chat',
    title: 'Voice-note users',
    text: 'Share how your transformed voice notes sound on WhatsApp, Telegram, and your phone.',
    href: LINKS.feedback,
  },
  {
    tag: 'Live calls',
    icon: 'respond',
    title: 'Live-call users',
    text: 'Tell us how real-time voice works on your WhatsApp and Telegram calls, so every phone gets the same smooth call.',
    href: LINKS.feedback,
  },
  {
    tag: 'Contributors',
    icon: 'tool',
    title: 'Technical contributors',
    text: 'Help improve device compatibility, reliability, diagnostics, and the overall experience.',
    href: LINKS.community,
  },
]

const N = quotes.length
const looped = [...quotes, ...quotes, ...quotes]
const GAP = 24

export function Customers() {
  const [index, setIndex] = useState(N)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState(false)
  const [ref, onScreen] = useOnScreen<HTMLDivElement>()
  const reduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(405)

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setCardW(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (paused || hover || !onScreen || reduced) return
    const id = window.setTimeout(() => {
      setAnimate(true)
      setIndex((i) => i + 1)
    }, 4200)
    return () => window.clearTimeout(id)
  }, [paused, hover, onScreen, reduced, index])

  // silently re-centre into the middle copy after a transition
  const onEnd = () => {
    if (index >= 2 * N || index < N) {
      setAnimate(false)
      setIndex((i) => ((i % N) + N) % N + N)
    }
  }
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)))
      return () => cancelAnimationFrame(id)
    }
  }, [animate])

  const go = (d: number) => {
    setAnimate(true)
    setIndex((i) => i + d)
  }

  const activeQuote = index % N

  return (
    <Section n="11" id="early-access" frameClassName="overflow-x-clip">
      <div ref={ref} className="pt-10 pb-16 md:pt-20 md:pb-20 xl:pt-[132px] xl:pb-[132px]">
        <div className="flex flex-wrap items-end justify-between gap-6 px-4 md:px-6">
          <div>
            <Reveal>
              <Chip>Community</Chip>
            </Reveal>
            <Words className="display mt-6 text-[38px] md:text-[48px] xl:text-[56px]">Help shape what Loki becomes.</Words>
            <Reveal as="p" delay={150} className="mt-5 max-w-[620px] text-[16px] leading-[1.5] text-muted">
              Loki improves with every release. Join the community to share feedback, report issues, and shape how
              voice transformation fits into everyday messaging.
            </Reveal>
          </div>
          <div className="flex gap-[6px]" role="group" aria-label="Carousel controls">
            {[
              { label: 'Previous card', icon: 'arrowLeft' as const, on: () => go(-1), dark: false },
              {
                label: paused ? 'Play carousel' : 'Pause carousel',
                icon: paused ? ('play' as const) : ('pause' as const),
                on: () => setPaused((p) => !p),
                dark: false,
              },
              { label: 'Next card', icon: 'arrowRight' as const, on: () => go(1), dark: true },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                aria-label={b.label}
                onClick={b.on}
                className={cn(
                  'flex size-12 items-center justify-center border transition-colors duration-200',
                  b.dark ? 'border-ink bg-ink text-white hover:border-accent hover:bg-accent' : 'border-line-2 bg-white text-ink hover:border-ink',
                )}
              >
                <Pixel name={b.icon} size={2} />
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-10 overflow-hidden px-4 py-[4px] md:mt-12 md:px-6"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-live="polite"
        >
          <div
            className="flex"
            onTransitionEnd={onEnd}
            style={{
              gap: GAP,
              transform: `translateX(${-index * (cardW + GAP)}px)`,
              transition: animate ? 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            }}
          >
            {looped.map((q, i) => {
              const active = i === index
              return (
                <article
                  key={i}
                  ref={i === 0 ? cardRef : undefined}
                  aria-hidden={i < N || i >= 2 * N}
                  className={cn(
                    'relative flex min-h-[300px] w-[min(85vw,405px)] shrink-0 flex-col border p-6 transition-colors duration-500 md:min-h-[320px] md:p-8',
                    active ? 'border-ink bg-white' : 'border-line bg-transparent',
                  )}
                >
                  {active && <CornerDots />}
                  <div className="flex items-start justify-between">
                    <span className="label text-[11px] text-muted">{String((i % N) + 1).padStart(2, '0')}</span>
                    <span className="label flex items-center gap-2 text-muted">
                      <Pixel name={q.icon} size={2} className="text-accent" />
                      {q.tag}
                    </span>
                  </div>
                  <h3 className="mt-10 text-[24px] leading-[1.2] font-medium tracking-[-0.02em] text-ink">{q.title}</h3>
                  <p className="mt-3 flex-1 text-[16px] leading-[1.55] text-muted">{q.text}</p>
                  <div className="mt-8 border-t border-line pt-6">
                    <ArrowLink href={q.href}>Get involved</ArrowLink>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
        <span className="sr-only">
          Showing card {activeQuote + 1} of {N}
        </span>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* 12 — Availability / access                                          */
/* ------------------------------------------------------------------ */

type Path = {
  id: 'notes' | 'calls' | 'future'
  name: string
  desc: string
  status: string
  tag?: string
  cta: string
  href: string
  features: string[]
}

const paths: Path[] = [
  {
    id: 'notes',
    name: 'Voice notes',
    desc: 'Send voice notes in a different voice on WhatsApp and Telegram.',
    status: 'Available now',
    tag: 'Start here',
    cta: 'Download Loki',
    href: LINKS.download,
    features: ['Voice conversion', 'WhatsApp voice notes', 'Telegram voice notes'],
  },
  {
    id: 'calls',
    name: 'Live calls',
    desc: 'Talk in your new voice on WhatsApp and Telegram calls, in real time.',
    status: 'Real-time',
    tag: 'One-time setup',
    cta: 'View setup requirements',
    href: '#faq',
    features: ['One-time Shizuku setup', 'Android 13 or newer', 'Readiness check before you call'],
  },
  {
    id: 'future',
    name: 'Updates',
    desc: 'Follow Loki for new releases, new features, and help when you need it.',
    status: 'Always improving',
    cta: 'Follow Loki',
    href: LINKS.channel,
    features: ['Release announcements', 'New features first', 'Help and support'],
  },
]

function Status({ text }: { text: string }) {
  const out = useScramble(text, true, 520)
  return (
    <span className="pixel block text-[30px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[32px]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

function PathToggle({ value, onChange }: { value: Path['id']; onChange: (v: Path['id']) => void }) {
  const opts: Array<{ id: Path['id']; label: string; tag?: string }> = [
    { id: 'notes', label: 'Voice notes' },
    { id: 'calls', label: 'Live calls', tag: 'Real-time' },
  ]
  return (
    <div className="inline-flex border border-line-2 bg-white/50 p-[3px]" role="radiogroup" aria-label="Choose a path">
      {opts.map((o) => {
        const on = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={cn(
              'flex h-10 items-center gap-2 border px-3.5 text-[14px] transition-colors duration-300',
              on ? 'border-accent bg-white text-ink' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {on && <span className="size-[6px] bg-accent" />}
            {o.label}
            {o.tag && <span className="label bg-accent px-1.5 py-1 text-[10px] text-white">{o.tag}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function Pricing() {
  const [selected, setSelected] = useState<Path['id']>('notes')
  return (
    <Section n="12" id="availability">
      <div className="pt-10 pb-16 md:pt-20 md:pb-20 xl:pt-[132px] xl:pb-[132px]">
        <div className="flex flex-col gap-8 px-4 md:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <Chip>Access</Chip>
            </Reveal>
            <Words className="display mt-6 text-[38px] md:text-[48px] xl:text-[56px]">Start with 30 free minutes.</Words>
            <Reveal as="p" delay={150} className="mt-5 max-w-[600px] text-[16px] leading-[1.5] text-muted">
              Every Loki account gets 30 free minutes of voice conversion each month. Use them for voice notes, live
              calls, or both.
            </Reveal>
          </div>
          <Reveal delay={150} className="shrink-0">
            <PathToggle value={selected} onChange={setSelected} />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 border-line px-4 md:px-6 lg:mt-16 lg:grid-cols-3 lg:gap-0 lg:border-t lg:px-0">
          {paths.map((p, i) => {
            const featured = p.id === selected
            return (
              <Reveal key={p.id} delay={i * 100} className="relative">
                <div
                  className={cn(
                    'h-full transition-[margin,padding,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    featured ? 'bg-paper-2 p-[6px] lg:-mt-6' : 'border border-line lg:border-0',
                  )}
                >
                  <div
                    className={cn(
                      'relative h-full border transition-colors duration-500',
                      featured ? 'border-accent bg-white' : 'border-transparent',
                    )}
                  >
                    {featured && <CornerDots />}
                    <PathBody path={p} featured={featured} />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function PathBody({ path, featured }: { path: Path; featured: boolean }) {
  return (
    <div className={cn('flex h-full flex-col px-6 pb-8', featured ? 'pt-5' : 'pt-6 lg:pt-12')}>
      {featured && path.tag && (
        <div className="mb-6 flex items-center gap-3">
          <span className="label text-[10px] text-ink">{path.tag}</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      )}
      <h3 className="flex items-center gap-2.5 text-[24px] font-medium tracking-[-0.02em]">
        {featured && <Pixel name="asterisk" size={3} className="text-accent" />}
        {path.name}
      </h3>
      <p className="mt-3 min-h-[42px] max-w-[280px] text-[14px] leading-[1.5] text-muted">{path.desc}</p>
      <div className="mt-8">
        <Status key={path.status} text={path.status} />
      </div>
      <span className="label mt-3 text-[10px] text-muted">Availability</span>
      <div className="mt-8">
        <PixelButton block variant={featured ? 'accent' : 'dark'} href={path.href}>
          {path.cta}
        </PixelButton>
      </div>
      <div className="mt-8 border-t border-line pt-8">
        <p className="text-[14px] text-muted">Includes:</p>
        <ul className="mt-5 space-y-3">
          {path.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-[14px] text-ink">
              <Pixel name="check" size={2} className={featured ? 'text-accent' : 'text-ink'} />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
