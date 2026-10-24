import { useEffect, useRef, useState, type ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { useMediaQuery, useOnScreen } from '@/lib/motion'
import { ConnectScene, DeployScene, MonitorScene, OrchestrateScene } from '@/components/iso'
import { ArrowLink, Brackets, Chip, Reveal, Section, Words } from '@/components/ui'

type Step = {
  title: [string, string]
  chip: string
  body: string
  Scene: ComponentType<{ active?: boolean; tight?: boolean }>
}

const steps: Step[] = [
  {
    title: ['Capture', 'your voice'],
    chip: 'Voice input',
    body: "Loki starts with your voice, captured through your device's audio input.",
    Scene: ConnectScene,
  },
  {
    title: ['Transform', 'the audio'],
    chip: 'Voice conversion',
    body: 'The voice-conversion engine processes the audio to produce a transformed version.',
    Scene: OrchestrateScene,
  },
  {
    title: ['Send', 'your voice note'],
    chip: 'Voice notes',
    body: "Use Loki's supported voice-note workflow to send transformed audio through a compatible messaging app.",
    Scene: DeployScene,
  },
  {
    title: ['Speak', 'on live calls'],
    chip: 'Real-time · WhatsApp & Telegram calls',
    body: "Talk in your new voice on WhatsApp and Telegram calls, converted in real time. A one-time setup gets your phone ready, and Loki checks everything is in place before you call.",
    Scene: MonitorScene,
  },
]

const DOTS = 12

function Progress({ fills }: { fills: number[] }) {
  return (
    <div className="flex gap-2.5" aria-hidden="true">
      {fills.map((f, g) => (
        <div key={g} className="flex flex-1 gap-[2px]">
          {Array.from({ length: DOTS }).map((_, d) => (
            <span
              key={d}
              className="h-[2px] flex-1 transition-colors duration-150"
              style={{ background: d < Math.round(f * DOTS) ? 'var(--color-accent)' : 'var(--color-line-2)' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function MiniSteps({ active }: { active: number }) {
  return (
    <div className="absolute bottom-5 left-5 flex items-center gap-1" aria-hidden="true">
      {steps.map((_, i) => (
        <span
          key={i}
          className="h-[3px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: i === active ? 20 : 8,
            background: i === active ? 'var(--color-accent)' : i < active ? 'var(--color-ink)' : 'var(--color-line-2)',
          }}
        />
      ))}
    </div>
  )
}

function StepText({ step, visible }: { step: Step; visible: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(14px)',
        filter: visible ? 'none' : 'blur(6px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-hidden={!visible}
    >
      <h3 className="display text-[56px] leading-[1.02]">
        {step.title[0]}
        <br />
        <span className="text-muted">{step.title[1]}</span>
      </h3>
      <div>
        {visible ? <Chip>{step.chip}</Chip> : <span className="label inline-block h-[28px]" />}
        <p className="mt-5 max-w-[400px] text-[16px] leading-[1.5] text-muted">{step.body}</p>
        <div className="mt-8">
          <ArrowLink href="#platform">Learn more</ArrowLink>
        </div>
      </div>
    </div>
  )
}

/** Desktop: one sticky panel, scroll scrubs through the four steps. */
function StickySteps() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [sceneRef, onScreen] = useOnScreen<HTMLDivElement>()

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const el = trackRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const panel = el.firstElementChild as HTMLElement | null
      const total = el.offsetHeight - (panel?.offsetHeight ?? 0)
      const stick = panel ? parseFloat(getComputedStyle(panel).top) || 0 : 0
      const p = total > 0 ? (stick - r.top) / total : 0
      setProgress(Math.min(Math.max(p, 0), 0.9999))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const active = Math.min(Math.floor(progress * steps.length), steps.length - 1)
  const fills = steps.map((_, i) => Math.min(Math.max(progress * steps.length - i, 0), 1))

  return (
    <div ref={trackRef} className="relative mt-14" style={{ height: 'calc(260vh + 680px)' }}>
      <div className="sticky top-20 grid h-[min(680px,calc(100vh-96px))] grid-cols-2 border border-line xl:top-6 xl:h-[min(680px,calc(100vh-48px))]">
        <div className="relative bg-white p-6">
          <Brackets className="inset-3" />
          <div className="relative flex h-full flex-col px-3 pt-3 pb-3">
            <Progress fills={fills} />
            <div className="relative mt-10 flex-1">
              {steps.map((s, i) => (
                <StepText key={s.title[0]} step={s} visible={i === active} />
              ))}
            </div>
          </div>
        </div>
        <div ref={sceneRef} className="iso-bg relative overflow-hidden border-l border-line">
          <Brackets className="inset-3" />
          {steps.map(({ Scene, title }, i) => (
            <div
              key={title[0]}
              className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? 'none' : i < active ? 'translateY(-24px) scale(0.98)' : 'translateY(24px) scale(0.98)',
              }}
              aria-hidden={i !== active}
            >
              <Scene active={onScreen && i === active} />
            </div>
          ))}
          <MiniSteps active={active} />
        </div>
      </div>
    </div>
  )
}

/** Tablet / phone: stacked cards. */
function StackedSteps() {
  return (
    <div className="mt-10 flex flex-col gap-6 md:mt-12">
      {steps.map((s, i) => (
        <StackedCard key={s.title[0]} step={s} index={i} />
      ))}
    </div>
  )
}

function StackedCard({ step, index }: { step: Step; index: number }) {
  const [ref, onScreen] = useOnScreen<HTMLDivElement>()
  const { Scene } = step
  return (
    <Reveal className="border border-line">
      <div className="relative bg-white p-6 md:p-8">
        <Brackets className="inset-3" />
        <Progress fills={steps.map((_, i) => (i <= index ? 1 : 0))} />
        <h3 className="display mt-10 text-[38px] leading-[1.04] md:text-[48px]">
          {step.title[0]}
          <br />
          <span className="text-muted">{step.title[1]}</span>
        </h3>
        <div className="mt-4">
          <Chip>{step.chip}</Chip>
        </div>
        <p className="mt-6 max-w-[420px] text-[16px] leading-[1.5] text-muted">{step.body}</p>
        <div className="mt-8 mb-6">
          <ArrowLink href="#platform">Learn more</ArrowLink>
        </div>
      </div>
      <div ref={ref} className="iso-bg relative h-[340px] border-t border-line md:h-[420px]">
        <Brackets className="inset-3" />
        <Scene active={onScreen} tight />
        <MiniSteps active={index} />
      </div>
    </Reveal>
  )
}

export function HowItWorks() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  return (
    <Section n="06" id="how">
      <div className={cn('px-4 pt-10 pb-16 md:px-6 md:pt-20 md:pb-20 xl:pt-[132px] xl:pb-[120px]')}>
        <Reveal>
          <Chip>How it works</Chip>
        </Reveal>
        <Words className="display mt-6 max-w-[1000px] text-[38px] md:text-[48px] xl:text-[56px]">
          From your voice to a different sound.
        </Words>
        {desktop ? <StickySteps /> : <StackedSteps />}
      </div>
    </Section>
  )
}
