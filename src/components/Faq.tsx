import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { useInView, useReducedMotion } from '@/lib/motion'
import { Pixel } from '@/components/pixel'
import { ArrowLink, Chip, PixelButton, Reveal, Scramble, Section, Words } from '@/components/ui'
import { LINKS, externalProps } from '@/lib/links'
import { FREE_MINUTES, FREE_RULE } from '@/lib/plans'

/* ------------------------------------------------------------------ */
/* 13 — FAQ                                                            */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: 'What is Loki?',
    a: 'Loki is an Android app that changes how your voice sounds, in real time, on WhatsApp and Telegram calls and in voice notes. People use it to keep their real voice private with strangers, to create characters for videos, skits and streams, and to have fun on calls with friends.',
  },
  {
    q: 'Which apps does Loki support?',
    a: 'WhatsApp and Telegram, for both voice notes and live calls. Live calls need a one-time setup on your phone.',
  },
  {
    q: 'How do I set up Loki?',
    a: "Tap Get Loki to download the app, open the file, and allow your browser to install apps if Android asks. Then open Loki, create your account, and choose a voice. For live calls, the in-app guide walks you through a one-time Shizuku setup and checks your phone is ready.",
  },
  {
    q: 'Does Loki work during live calls?',
    a: 'Yes, on WhatsApp and Telegram calls. Loki converts your voice in real time while you talk.',
  },
  {
    q: 'Is Loki available to everyone?',
    a: `Yes. Anyone with an Android phone can download Loki. New accounts get ${FREE_MINUTES} free minutes, ${FREE_RULE}.`,
  },
  {
    q: 'Can I use Loki to sound like a specific person?',
    a: 'Only with their clear permission. Loki is built for privacy, creativity and fun. Using it to impersonate someone, deceive or defraud anyone breaks our Terms, gets accounts closed, and may be a crime.',
  },
  {
    q: 'Does Loki require root access?',
    a: 'No. Live calls use Shizuku, a free app installed from its official site, to give Loki the Android permissions it needs without root. Voice notes need no extra setup.',
  },
]

function FaqItem({ item, i, open, onToggle }: { item: (typeof faqs)[number]; i: number; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <Reveal delay={i * 60} className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-center gap-5 py-6 pr-4 pl-4 text-left md:gap-8 md:py-[26px] md:pr-6 md:pl-4"
        >
          <span className="label w-6 shrink-0 text-[11px] text-muted">{String(i + 1).padStart(2, '0')}</span>
          <span
            className={cn(
              'flex-1 text-[18px] leading-[1.3] tracking-[-0.01em] transition-colors duration-200 md:text-[20px]',
              open ? 'text-ink' : 'text-ink group-hover:text-accent',
            )}
          >
            {item.q}
          </span>
          <span className="relative size-3.5 shrink-0" aria-hidden="true">
            <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-ink" />
            <span
              className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: open ? 'translateX(-50%) scaleY(0)' : 'translateX(-50%)' }}
            />
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className="max-w-[560px] pr-6 pb-7 pl-[60px] text-[16px] leading-[1.6] text-muted md:pl-[76px]">{item.a}</p>
        </div>
      </div>
    </Reveal>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <Section n="13" id="faq">
      <div className="grid gap-10 pt-10 pb-16 md:pt-20 md:pb-20 lg:grid-cols-[400px_1fr] lg:gap-0 xl:pt-[128px] xl:pb-[128px]">
        <div className="px-4 md:px-6">
          <Reveal>
            <Chip>FAQ</Chip>
          </Reveal>
          <Words className="display mt-6 text-[44px] md:text-[56px]">Questions</Words>
          <Reveal delay={150} className="mt-6">
            <ArrowLink href={LINKS.channel}>Follow Loki</ArrowLink>
          </Reveal>
        </div>
        <div className="border-t border-line">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} item={f} i={i} open={open === i} onToggle={() => setOpen((o) => (o === i ? null : i))} />
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* 14 — CTA with concentric "signal" squares                           */
/* ------------------------------------------------------------------ */

const RINGS = 16
const DASHED = new Set([3, 4, 6, 7, 9, 10, 12, 13, 15])

function SignalRings({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  const cx = 999.5
  const cy = 350.5
  const rings = Array.from({ length: RINGS }, (_, i) => (i + 1) * 32)
  const packets = [
    { ring: 1, dur: 10, delay: -1.2, rev: false },
    { ring: 2, dur: 14, delay: -8.1, rev: true },
    { ring: 4, dur: 18, delay: -3.4, rev: false },
    { ring: 6, dur: 22, delay: -12, rev: true },
    { ring: 9, dur: 30, delay: -6, rev: false },
  ]
  const sq = (h: number) => `M ${cx - h} ${cy - h} h ${2 * h} v ${2 * h} h ${-2 * h} Z`
  return (
    <svg
      viewBox="0 0 1440 700"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rings.map((h, i) => (
        <path
          key={h}
          d={sq(h)}
          fill="none"
          stroke="#2a2a27"
          strokeOpacity={i < 2 ? 0.6 : 1}
          strokeDasharray={DASHED.has(i) ? '2 6' : undefined}
          style={{ opacity: play ? 1 : 0, transition: `opacity 120ms steps(2) ${175 + i * 55}ms` }}
        />
      ))}
      {packets.map((p, i) => (
        <g key={i} style={{ opacity: play ? 1 : 0, transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${1000 + i * 140}ms` }}>
          <path
            d={sq(rings[p.ring])}
            pathLength={100}
            fill="none"
            stroke="#ff4f00"
            strokeOpacity={0.3}
            strokeWidth={2}
            strokeDasharray="12 88"
            style={{
              animation: reduced ? undefined : `packet-run ${p.dur}s linear ${p.delay}s infinite ${p.rev ? 'reverse' : 'normal'}`,
            }}
          />
          <path
            d={sq(rings[p.ring])}
            pathLength={100}
            fill="none"
            stroke="#ff4f00"
            strokeWidth={2}
            strokeDasharray="3 97"
            strokeDashoffset={-9}
            style={{
              animation: reduced ? undefined : `packet-run ${p.dur}s linear ${p.delay}s infinite ${p.rev ? 'reverse' : 'normal'}`,
            }}
          />
        </g>
      ))}
    </svg>
  )
}

export function Cta() {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.3 })
  return (
    <Section n="14" id="cta" dark frameClassName="overflow-hidden">
      <div ref={ref} className="relative min-h-[520px] md:min-h-[640px] xl:min-h-[700px]">
        <div className="absolute inset-0 opacity-60 md:opacity-100">
          <SignalRings play={inView} />
        </div>
        <div className="relative px-4 pt-10 pb-16 md:px-6 md:pt-20 xl:pt-[112px]">
          <Words className="display text-[52px] leading-[1] tracking-[-0.045em] md:text-[72px] xl:text-[88px]">
            Your voice,
            <br />
            your <span className="pixel tracking-[-0.03em] text-accent">way.</span>
          </Words>
          <Reveal as="p" delay={250} className="mt-8 max-w-[520px] text-[16px] leading-[1.5] text-muted-3">
            Keep your real voice private, give your content a new character, or just have fun on the next call.
            Start free with {FREE_MINUTES} minutes on your phone.
          </Reveal>
          <Reveal delay={350} className="mt-10 flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:gap-8">
            <PixelButton variant="light" href={LINKS.download}>
              Get Loki
            </PixelButton>
            <ArrowLink dark href={LINKS.channel}>
              Join the channel
            </ArrowLink>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* 15 — Footer                                                         */
/* ------------------------------------------------------------------ */

// Outside destinations come from .env (see src/lib/links.ts).
const footerGroups = [
  {
    n: '02',
    title: 'Product',
    links: [
      { label: 'Overview', href: '/#problem' },
      { label: 'How it works', href: '/#how' },
      { label: 'Features', href: '/#platform' },
      { label: 'Availability', href: '/#availability' },
    ],
  },
  {
    n: '03',
    title: 'Resources',
    links: [
      { label: 'Setup guide', href: LINKS.setupGuide },
      { label: 'Updates', href: LINKS.channel },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    n: '04',
    title: 'Community',
    links: [
      { label: 'Telegram channel', href: LINKS.channel },
      { label: 'Download', href: LINKS.download },
      { label: 'Contact', href: LINKS.support },
    ],
  },
]

function FooterGroup({ group }: { group: (typeof footerGroups)[number] }) {
  return (
    <div className="flex flex-col justify-between gap-6 p-4 md:min-h-[200px] md:gap-8 md:p-5 lg:min-h-[240px]">
      <span className="label text-[11px] text-muted-3">
        {group.n} · {group.title}
      </span>
      <ul className="space-y-2.5">
        {group.links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...externalProps(l.href)}
              className="group flex items-center justify-between text-[17px] font-medium tracking-[-0.01em] text-white transition-colors duration-200 hover:text-accent"
            >
              {l.label}
              <span className="text-muted-3 transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">
                <Pixel name="arrowUpRight" size={2} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.3 })
  return (
    <footer id="footer" className="relative border-t border-line-dark bg-ink text-white">
      <div className="frame border-x border-line-dark">
        <span className="label pointer-events-none absolute top-8 left-[calc(32px-var(--rail))] hidden text-muted-3 xl:block">
          <Scramble text="15" />
        </span>
        <div className="grid border-b border-line-dark lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <a
            href={LINKS.download}
            className="group relative flex min-h-[200px] flex-col justify-between border-b border-line-dark p-4 transition-colors duration-300 hover:bg-ink-2 md:p-5 lg:min-h-[240px] lg:border-r lg:border-b-0"
          >
            <span className="label flex items-center gap-2 text-[11px] text-accent">
              <span className="size-[5px] bg-accent" /> 01
            </span>
            <span className="flex items-end justify-between gap-4">
              <span className="text-[32px] leading-none font-medium tracking-[-0.03em] md:text-[40px]">Get Loki</span>
              <span className="text-white transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent">
                <Pixel name="arrowUpRight" size={4} />
              </span>
            </span>
          </a>
          <div className="grid gap-px bg-line-dark md:grid-cols-3">
            {footerGroups.map((g) => (
              <div key={g.title} className="bg-ink">
                <FooterGroup group={g} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-line-dark px-4 py-6 md:flex-row md:items-center md:justify-between md:px-5">
          <a href="/#top" className="flex items-center gap-2.5">
            <Pixel name="logo" size={3} />
            <span className="text-[18px] font-medium">Loki</span>
          </a>
          <span className="text-[14px] text-muted-3">Voice conversion for privacy, creators and play.</span>
        </div>
        <div ref={ref} className="overflow-hidden px-2 pt-8 pb-4 md:pt-12">
          <p
            aria-hidden="true"
            className="pixel text-center leading-[0.8] select-none"
            style={{
              fontSize: 'min(27vw, 345px)',
              letterSpacing: '0.04em',
              background: 'linear-gradient(180deg, #34342f 0%, #1c1c1a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              clipPath: inView ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
              transition: 'clip-path 1200ms steps(14)',
            }}
          >
            LOKI
          </p>
        </div>
        <div className="label flex flex-col gap-3 border-t border-line-dark px-4 py-5 text-[11px] text-muted-3 md:flex-row md:items-center md:justify-between md:px-5">
          <span>© 2026 Loki. All rights reserved.</span>
          <span className="flex gap-3">
            <a href={LINKS.privacy} {...externalProps(LINKS.privacy)} className="transition-colors hover:text-white">
              Privacy
            </a>
            ·
            <a href={LINKS.terms} {...externalProps(LINKS.terms)} className="transition-colors hover:text-white">
              Terms
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
