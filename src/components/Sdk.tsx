import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useInView, useReducedMotion, useScramble } from '@/lib/motion'
import { ArrowLink, Brackets, Reveal, Scramble, Section, Words } from '@/components/ui'

type Tok = { t: string; k?: 'kw' | 'str' | 'num' }

// Illustrative flow only — not code, not a public SDK.
const code: Tok[][] = [
  [{ t: '# illustrative audio flow', k: 'str' }],
  [{ t: 'MICROPHONE' }],
  [{ t: '  → ', k: 'kw' }, { t: 'CAPTURE' }],
  [{ t: '  → ', k: 'kw' }, { t: 'CONVERSION' }],
  [{ t: '  → ', k: 'kw' }, { t: 'AUDIO OUTPUT' }],
]

const tone = { kw: 'text-accent', str: 'text-muted-3', num: 'text-accent' } as const
const lineLen = code.map((l) => l.reduce((n, t) => n + t.t.length, 0))
const TOTAL = lineLen.reduce((a, b) => a + b, 0)

function CodeWindow() {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.4 })
  const reduced = useReducedMotion()
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'typing' | 'deploying' | 'done'>('idle')

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setTyped(TOTAL)
      setPhase('done')
      return
    }
    setPhase('typing')
    let raf = 0
    let done = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const n = Math.floor((now - t0) / 22)
      setTyped(Math.min(n, TOTAL))
      if (n < TOTAL) raf = requestAnimationFrame(tick)
      else {
        setPhase('deploying')
        done = window.setTimeout(() => setPhase('done'), 700)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(done)
    }
  }, [inView, reduced])

  let budget = typed
  let cursorLine = -1
  return (
    <div ref={ref} className="min-w-0 border border-line-dark bg-ink-2">
      <div className="flex items-stretch justify-between border-b border-line-dark">
        <span className="flex items-center gap-2.5 border-r border-line-dark px-4 py-3 font-mono text-[14px] text-white">
          <span className="size-[6px] bg-accent" />
          <span className="label">Audio pipeline</span>
        </span>
        <span className="label flex items-center px-4 text-muted-3">
          <Scramble text="Flow" />
        </span>
      </div>
      <pre className="no-scrollbar overflow-x-auto px-4 py-5 font-mono text-[13px] leading-[24.5px] md:text-[14px]">
        <code className="block">
          {code.map((line, i) => {
            const show = Math.max(0, Math.min(budget, lineLen[i]))
            if (budget > 0 && budget <= lineLen[i]) cursorLine = i
            budget -= lineLen[i]
            let left = show
            return (
              <div key={i} className="flex gap-5">
                <span className="w-4 shrink-0 text-right text-muted-3 select-none">{i + 1}</span>
                <span className="min-w-0 whitespace-pre-wrap text-white md:whitespace-pre">
                  {line.map((tok, j) => {
                    const part = tok.t.slice(0, Math.max(0, left))
                    left -= tok.t.length
                    return part ? (
                      <span key={j} className={tok.k ? tone[tok.k] : undefined}>
                        {part}
                      </span>
                    ) : null
                  })}
                  {(cursorLine === i || (phase === 'idle' && i === 0)) && phase !== 'done' && (
                    <span className="blink ml-px inline-block h-[15px] w-[7px] translate-y-[3px] bg-accent" />
                  )}
                </span>
              </div>
            )
          })}
        </code>
      </pre>
      <div className="label flex h-11 items-center gap-2.5 border-t border-line-dark px-4 text-white">
        <span className={cn('size-[6px]', phase === 'done' ? 'bg-accent' : 'bg-muted')} />
        {phase === 'done' ? (
          <span>Pipeline live</span>
        ) : phase === 'deploying' ? (
          <span className="flex items-center gap-3 text-muted-3">
            Flow
            <span className="flex gap-[3px]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="size-[5px] bg-accent" style={{ animation: `led 0.6s ${i * 0.08}s steps(2) infinite` }} />
              ))}
            </span>
          </span>
        ) : (
          <span className="text-muted-3">Illustrative</span>
        )}
      </div>
    </div>
  )
}

export function Sdk() {
  return (
    <Section n="09" id="pipeline" dark>
      <div className="grid gap-10 px-4 pt-10 pb-16 md:px-6 md:pt-20 md:pb-20 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14 xl:pt-[128px] xl:pb-[96px]">
        <div>
          <Words className="display max-w-[420px] text-[38px] leading-[1.04] md:text-[48px] xl:text-[56px]">
            From captured audio to transformed speech.
          </Words>
          <Reveal as="p" delay={150} className="mt-6 max-w-[380px] text-[16px] leading-[1.5] text-muted-3">
            Loki processes captured speech through a voice-conversion pipeline and delivers the resulting audio through
            supported output paths.
          </Reveal>
          <Reveal delay={250} className="mt-10">
            <ArrowLink dark href="#platform">
              Explore the product
            </ArrowLink>
          </Reveal>
        </div>
        <Reveal delay={120} className="min-w-0">
          <CodeWindow />
        </Reveal>
      </div>
    </Section>
  )
}

const facts = [
  { label: 'Voice-note workflows', value: 'WhatsApp and Telegram' },
  { label: 'Live calls', value: 'WhatsApp and Telegram' },
  { label: 'Setup', value: 'Android 8+ · live calls on 13+' },
  { label: 'Availability', value: 'Free to start' },
]

function Fact({ f, play, i }: { f: (typeof facts)[number]; play: boolean; i: number }) {
  const value = useScramble(f.value, play, 900, i * 140)
  return (
    <div className="relative flex flex-col justify-between gap-6 border-line px-4 py-9 odd:border-r md:px-6 md:py-10 [&:nth-child(-n+2)]:border-b lg:border-r lg:last:border-r-0 lg:[&:nth-child(-n+2)]:border-b-0 xl:py-12">
      <Brackets className="inset-2" size={10} />
      <div className="label text-muted">
        <Scramble text={f.label} delay={i * 120} />
      </div>
      <div className="pixel text-[20px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[26px]">
        <span className="sr-only">{f.value}</span>
        <span aria-hidden="true">{value}</span>
      </div>
    </div>
  )
}

export function Metrics() {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.5 })
  return (
    <Section n="10" numberClassName="xl:top-1/2 xl:-translate-y-1/2">
      <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <Fact key={f.label} f={f} play={inView} i={i} />
        ))}
      </div>
    </Section>
  )
}
