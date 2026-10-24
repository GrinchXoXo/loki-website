import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { mulberry32, useInterval, useOnScreen, useRaf, useReducedMotion, useScramble, useWidth } from '@/lib/motion'
import { Pixel, type IconName } from '@/components/pixel'
import { Chip, Reveal, Section, Words } from '@/components/ui'

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const W = 600
const H = 320

/** Renders a fixed-size diagram scaled down to fit its container. */
function Fit({ children, height }: { children: ReactNode; height: number }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const scale = width ? Math.min(1, (width - 16) / W, height / H) : 1
  return (
    <div ref={ref} className="relative flex w-full items-center justify-center overflow-hidden" style={{ height }}>
      <div className="relative shrink-0" style={{ width: W, height: H, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

function Box({ children, className, style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cn('absolute border border-line-2 bg-white', className)} style={style}>
      {children}
    </div>
  )
}

const mono = 'font-mono text-[11px] tracking-[0.02em]'

/* ------------------------------------------------------------------ */
/* 1. Voice conversion                                                  */
/* ------------------------------------------------------------------ */

function Globe({ play }: { play: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const pts = useMemo(() => {
    const out: Array<{ lat: number; lon: number; hot: boolean }> = []
    const rand = mulberry32(11)
    for (let la = -80; la <= 80; la += 9) {
      const n = Math.max(4, Math.round(36 * Math.cos((la * Math.PI) / 180)))
      for (let k = 0; k < n; k++) out.push({ lat: (la * Math.PI) / 180, lon: (k / n) * Math.PI * 2, hot: rand() < 0.05 })
    }
    return out
  }, [])
  const rot = useRef(0)
  const reduced = useReducedMotion()
  useRaf((_, dt) => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    if (!reduced) rot.current += dt * 0.00035
    const dpr = window.devicePixelRatio || 1
    const size = 150
    if (c.width !== size * dpr) {
      c.width = size * dpr
      c.height = size * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size, size)
    const R = 66
    const cx = size / 2
    const cy = size / 2
    const tilt = -0.35
    for (const p of pts) {
      const lon = p.lon + rot.current
      let x = Math.cos(p.lat) * Math.sin(lon)
      let y = Math.sin(p.lat)
      let z = Math.cos(p.lat) * Math.cos(lon)
      // tilt toward viewer
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt)
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt)
      y = y2
      z = z2
      if (z < -0.15) continue
      const light = -x * 0.7 + -y * 0.5 + z * 0.5 // lit from upper-left
      const s = 2.2 + z * 1.6
      const px = cx + x * R
      const py = cy - y * R
      const snap = (v: number) => Math.round(v / 3) * 3
      if (p.hot && z > 0.2) ctx.fillStyle = '#ff4f00'
      else if (light > 0.45) ctx.fillStyle = '#4e4e49'
      else if (light > 0.1) ctx.fillStyle = '#9a9a92'
      else ctx.fillStyle = '#cfcfc7'
      ctx.fillRect(snap(px) - s / 2, snap(py) - s / 2, s, s)
    }
  }, play)
  return <canvas ref={ref} className="absolute" style={{ left: 30, top: 85, width: 150, height: 150 }} aria-hidden="true" />
}

function RoutingView({ play }: { play: boolean }) {
  const targets: Array<{ id: string; icon: IconName; y: number }> = [
    { id: 'voice notes', icon: 'chat', y: 46 },
    { id: 'live calls', icon: 'respond', y: 138 },
    { id: 'playback', icon: 'play', y: 230 },
  ]
  const [on, setOn] = useState(0)
  const reduced = useReducedMotion()
  useInterval(() => setOn((v) => (v + 1) % 3), play && !reduced ? 1500 : null)
  const rx = 268
  const ry = 160
  return (
    <>
      <Globe play={play} />
      {/* feed into router */}
      <div className="absolute flex items-center gap-[5px]" style={{ left: 192, top: ry - 2 }}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="size-[5px] bg-accent"
            style={{ animation: reduced ? undefined : `led 1s ${i * 0.15}s steps(2) infinite`, opacity: 0.3 + i * 0.2 }}
          />
        ))}
      </div>
      <Box className="flex items-center justify-center border-accent" style={{ left: rx - 32, top: ry - 32, width: 64, height: 64, background: '#fff' }}>
        <Pixel name="asterisk" size={4} className="text-accent" />
        {[
          'top-0 left-0',
          'top-0 right-0',
          'bottom-0 left-0',
          'bottom-0 right-0',
        ].map((p) => (
          <span key={p} className={cn('absolute size-[5px] -translate-1/2 bg-accent', p.includes('right') && 'translate-x-1/2', p.includes('bottom') && 'translate-y-1/2', p)} />
        ))}
      </Box>
      <span className={cn(mono, 'absolute text-muted')} style={{ left: rx - 34, top: ry + 40 }}>
        conversion
      </span>
      <svg className="absolute inset-0" width={W} height={H} aria-hidden="true">
        {targets.map((t, i) => {
          const lit = i === on
          const d = `M ${rx + 33} ${ry} H 370 V ${t.y + 22} H 410`
          return (
            <path
              key={t.id}
              d={d}
              fill="none"
              stroke={lit ? '#ff4f00' : '#cfcfc7'}
              strokeWidth={lit ? 1.5 : 1}
              strokeDasharray={lit ? undefined : '2 3'}
              style={{ transition: 'stroke 250ms' }}
            />
          )
        })}
        <rect x={366} y={ry - 4} width={8} height={8} fill="#fff" stroke="#ff4f00" />
      </svg>
      {targets.map((t, i) => {
        const lit = i === on
        return (
          <div key={t.id} className="absolute flex items-center gap-4" style={{ left: 410, top: t.y }}>
            <span
              className={cn(
                'flex size-[44px] items-center justify-center border bg-white transition-colors duration-300',
                lit ? 'border-ink text-ink' : 'border-line-2 text-muted',
              )}
            >
              <Pixel name={t.icon} size={3} />
            </span>
            <span className={cn(mono, 'transition-colors duration-300', lit ? 'font-semibold text-ink' : 'text-muted')}>{t.id}</span>
          </div>
        )
      })}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Unified tracing                                                  */
/* ------------------------------------------------------------------ */

function TracingView({ play }: { play: boolean }) {
  const spans = [
    { id: 'record', s: 0, e: 0.3, tone: 'ink' },
    { id: 'capture', s: 0.02, e: 0.32, tone: 'muted' },
    { id: 'convert', s: 0.3, e: 0.72, tone: 'accent' },
    { id: 'output', s: 0.68, e: 0.84, tone: 'muted' },
    { id: 'send', s: 0.84, e: 0.98, tone: 'ink' },
  ]
  const [t, setT] = useState(0)
  const reduced = useReducedMotion()
  useRaf((_, dt) => setT((v) => (v + dt / 3800) % 1.25), play && !reduced)
  const time = reduced ? 1 : Math.min(t, 1)
  const left = 112
  const width = 230
  return (
    <Box style={{ left: W / 2 - 190, top: 50, width: 380 }}>
      <div className={cn(mono, 'flex justify-between border-b border-line px-3 py-2 text-muted')}>
        <span>voice note</span>
        <span className="text-muted">illustrative</span>
      </div>
      <div className="relative px-3 py-2">
        {spans.map((s) => {
          const vis = Math.max(0, Math.min(time, s.e) - s.s)
          return (
            <div key={s.id} className="flex h-[30px] items-center">
              <span className={cn(mono, 'w-[100px]', s.tone === 'accent' ? 'font-semibold text-ink' : 'text-muted')}>{s.id}</span>
              <span className="relative h-full flex-1 border-b border-line">
                <span
                  className="absolute top-1/2 h-[6px] -translate-y-1/2"
                  style={{
                    left: (s.s / 1) * width,
                    width: vis * width,
                    background: s.tone === 'accent' ? '#ff4f00' : s.tone === 'ink' ? '#111' : '#cfcfc7',
                  }}
                />
              </span>
            </div>
          )
        })}
        <span className="absolute top-0 bottom-0 w-px bg-accent" style={{ left: left + time * width }}>
          <span className="absolute -top-[3px] -left-[3px] size-[7px] bg-accent" />
        </span>
      </div>
    </Box>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Cost controls                                                    */
/* ------------------------------------------------------------------ */

function CostView({ play }: { play: boolean }) {
  const SEG = 40
  const [t, setT] = useState(0)
  const reduced = useReducedMotion()
  useRaf((_, dt) => setT((v) => (v + dt / 5200) % 1.35), play && !reduced)
  const level = reduced ? 0.6 : 0.35 + 0.3 * Math.abs(Math.sin(t * 9)) + 0.2 * Math.abs(Math.sin(t * 23 + 1))
  const capped = false
  const lit = Math.round(level * SEG)
  return (
    <>
      <Box
        className={cn('flex items-center gap-2 px-3 py-1.5 transition-colors duration-300', capped && 'border-accent')}
        style={{ left: W / 2 - 66, top: 40 }}
      >
        <span className="size-[5px] bg-accent" />
        <span className={cn(mono, 'text-ink')}>calls · real-time</span>
      </Box>
      <span className="absolute w-px border-l border-dashed border-line-2" style={{ left: W / 2, top: 70, height: 36 }} />
      <Box className={cn('px-4 py-3.5 transition-colors duration-300', capped ? 'border-accent' : 'border-ink')} style={{ left: W / 2 - 150, top: 106, width: 300 }}>
        <div className="flex items-center justify-between">
          <span className={cn(mono, 'flex items-center gap-2 text-[12px] text-ink')}>
            <span className="flex size-[13px] items-center justify-center rounded-full border border-accent text-[9px] leading-none text-accent">+</span>
            live call
          </span>
          <span className={cn(mono, 'border border-accent px-1.5 py-0.5 text-[10px] text-accent')}>real-time</span>
        </div>
        <div className="mt-4 flex h-[12px] gap-[2px]">
          {Array.from({ length: SEG }).map((_, i) => (
            <span key={i} className="flex-1" style={{ background: i < lit ? '#ff4f00' : '#ecece7', outline: i < lit ? 'none' : '1px solid #e2e2dc' }} />
          ))}
        </div>
        <div className="mt-3 flex justify-between">
          <div>
            <div className={cn(mono, 'text-[10px] text-muted')}>Status</div>
            <div className="font-mono text-[13px] text-ink">Available</div>
          </div>
          <div className="text-right">
            <div className={cn(mono, 'text-[10px] text-muted')}>Setup</div>
            <div className="font-mono text-[13px] text-ink">One-time</div>
          </div>
        </div>
      </Box>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Secure by default                                                */
/* ------------------------------------------------------------------ */

const perms = {
  cols: ['capture', 'convert', 'output', 'restore'],
  rows: [
    { id: 'voice note', on: [1, 1, 1, 0] },
    { id: 'live call', on: [1, 1, 1, 1] },
    { id: 'playback', on: [0, 0, 1, 0] },
  ],
}
const audit = [
  { t: '01', a: 'microphone', p: '→ capture', r: '' },
  { t: '02', a: 'capture', p: '→ conversion', r: '' },
  { t: '03', a: 'conversion', p: '→ audio output', r: '' },
]

function SecureView({ play }: { play: boolean }) {
  const [step, setStep] = useState(0)
  const reduced = useReducedMotion()
  const total = 12 + audit.length + 6
  useInterval(() => setStep((s) => (s + 1) % total), play && !reduced ? 260 : null)
  const s = reduced ? total : step
  return (
    <>
      <Box className="flex items-center justify-center border-ink" style={{ left: W / 2 - 18, top: 4, width: 36, height: 36 }}>
        <Pixel name="retrieve" size={3} className="text-accent" />
      </Box>
      <span className="absolute w-px bg-ink" style={{ left: W / 2, top: 40, height: 20 }} />
      <Box style={{ left: W / 2 - 160, top: 60, width: 320 }}>
        <div className={cn(mono, 'grid grid-cols-[96px_repeat(4,1fr)] border-b border-line px-3 py-2 text-muted')}>
          <span />
          {perms.cols.map((c) => (
            <span key={c} className="text-center">
              {c}
            </span>
          ))}
        </div>
        <div className="py-1">
          {perms.rows.map((r, ri) => (
            <div key={r.id} className={cn(mono, 'grid grid-cols-[96px_repeat(4,1fr)] items-center px-3 py-[5px] text-ink')}>
              <span>{r.id}</span>
              {r.on.map((v, ci) => {
                const k = ri * 4 + ci
                const filled = v === 1 && s > k
                return (
                  <span key={ci} className="flex justify-center">
                    <span
                      className="size-[11px] border transition-colors duration-150"
                      style={{ borderColor: filled ? '#ff4f00' : '#cfcfc7', background: filled ? '#ff4f00' : 'transparent' }}
                    />
                  </span>
                )
              })}
            </div>
          ))}
        </div>
      </Box>
      <Box style={{ left: W / 2 - 160, top: 198, width: 320, height: 74 }}>
        <div className={cn(mono, 'px-2.5 pt-2 text-[10px] text-muted')}>pipeline · illustrative</div>
        <div className="px-2.5 pt-1">
          {audit.map((l, i) => (
            <div
              key={l.t}
              className="grid grid-cols-[28px_80px_1fr_auto] font-mono text-[10px] leading-[15px] whitespace-pre transition-opacity duration-200"
              style={{ opacity: s > 12 + i ? 1 : 0 }}
            >
              <span className="text-muted">{l.t}</span>
              <span className="text-ink">{l.a}</span>
              <span className="text-muted">{l.p}</span>
              <span className={l.r === 'ok' ? 'text-ink' : 'text-accent'}>{l.r}</span>
            </div>
          ))}
        </div>
      </Box>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Model-agnostic                                                   */
/* ------------------------------------------------------------------ */

const providers = ['app', 'android', 'perms', 'routing']
const providerRows = ['messaging app', 'android ver.', 'permissions', 'audio route']

function FlapWord({ word }: { word: string }) {
  const padded = word.padEnd(9, ' ')
  const text = useScramble(padded, true, 520)
  return (
    <div className="flex gap-[2px]">
      {text.split('').map((ch, i) => (
        <span key={i} className="flex h-[22px] w-[16px] items-center justify-center bg-ink font-mono text-[12px] text-white">
          {padded[i] === ' ' ? '' : ch}
        </span>
      ))}
    </div>
  )
}

function ModelView({ play }: { play: boolean }) {
  const [on, setOn] = useState(1)
  const reduced = useReducedMotion()
  useInterval(() => setOn((v) => (v + 1) % providers.length), play && !reduced ? 1900 : null)
  const rowY = (i: number) => 96 + i * 46
  const sdkX = 452
  const sdkY = 150
  return (
    <>
      <span className={cn(mono, 'absolute text-muted')} style={{ left: W / 2 - 26, top: 6, fontSize: 10 }}>
        checking
      </span>
      <div className="absolute" style={{ left: W / 2 - 89, top: 24 }}>
        <FlapWord key={providers[on]} word={providers[on]} />
      </div>
      <svg className="absolute inset-0" width={W} height={H} aria-hidden="true">
        {providers.map((p, i) => {
          const lit = i === on
          const y = rowY(i) + 15
          return (
            <path
              key={p}
              d={`M 262 ${y} H 330 V ${sdkY + 26} H ${sdkX}`}
              fill="none"
              stroke={lit ? '#ff4f00' : '#cfcfc7'}
              strokeWidth={lit ? 1.5 : 1}
              strokeDasharray={lit ? undefined : '2 3'}
              style={{ transition: 'stroke 250ms' }}
            />
          )
        })}
      </svg>
      {providers.map((p, i) => {
        const lit = i === on
        return (
          <Box
            key={p}
            className={cn('flex items-center gap-3 px-3 transition-colors duration-300', lit ? 'border-ink' : 'border-line-2 bg-white/70')}
            style={{ left: 142, top: rowY(i), width: 120, height: 30 }}
          >
            <span className="size-[5px] transition-colors" style={{ background: lit ? '#ff4f00' : '#cfcfc7' }} />
            <span className={cn(mono, lit ? 'text-ink' : 'text-muted')}>{providerRows[i]}</span>
          </Box>
        )
      })}
      <Box className="flex items-center justify-center border-accent" style={{ left: sdkX, top: sdkY, width: 52, height: 52, borderWidth: 1.5 }}>
        <Pixel name="verify" size={4} className="text-accent" />
      </Box>
      <span className={cn(mono, 'absolute text-muted')} style={{ left: sdkX + 8, top: sdkY + 62 }}>
        device
      </span>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Self-host or cloud                                               */
/* ------------------------------------------------------------------ */

function HostView({ play }: { play: boolean }) {
  const [cloud, setCloud] = useState(true)
  const reduced = useReducedMotion()
  useInterval(() => setCloud((c) => !c), play && !reduced ? 2400 : null)
  const panel = (isCloud: boolean) => {
    const lit = isCloud === cloud
    return cn(
      'absolute transition-all duration-500',
      lit ? 'border border-ink bg-white' : 'border border-dashed border-line-2 bg-transparent',
    )
  }
  return (
    <>
      <span className={cn(mono, 'absolute flex items-center gap-2 text-ink')} style={{ left: W / 2 - 62, top: 4 }}>
        <span className="size-[6px] bg-accent" /> android · available
      </span>
      <div className={panel(false)} style={{ left: 120, top: 30, width: 170, height: 192 }}>
        <span className={cn(mono, 'absolute top-2 left-2.5 text-[10px] text-ink')}>VOICE NOTES</span>
        <span className={cn(mono, 'absolute right-2.5 bottom-2 text-[9px] text-muted')}>ready</span>
        <div className="absolute inset-x-0 top-[66px] grid grid-cols-2 gap-x-3 gap-y-[5px] px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex h-[13px] items-center justify-end border border-ink/70 bg-white pr-1">
              <span className="size-[3px]" style={{ background: !cloud && i % 2 === 0 ? '#ff4f00' : '#88887f' }} />
            </span>
          ))}
        </div>
      </div>
      <div className={panel(true)} style={{ left: 310, top: 30, width: 170, height: 192 }}>
        <span className={cn(mono, 'absolute top-2 left-2.5 text-[10px] text-ink')}>LIVE CALLS</span>
        <span className={cn(mono, 'absolute right-2.5 bottom-2 text-[9px] text-accent')}>real-time</span>
        <span className="absolute top-2.5 right-2.5 size-[6px] transition-colors" style={{ background: cloud ? '#ff4f00' : '#e2e2dc' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Pixel rows={['0001100000', '0011110000', '0111111100', '1111111110', '1111111111']} size={7} className={cloud ? 'text-ink' : 'text-line-2'} />
        </div>
      </div>
      <span className="absolute h-px border-t border-dashed border-line-2" style={{ left: 290, top: 126, width: 20 }} />
      <span
        className="absolute size-[7px] bg-accent transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ left: cloud ? 303 : 283, top: 123 }}
      />
      <div className="absolute flex border border-ink bg-white" style={{ left: W / 2 - 95, top: 246, width: 190, height: 32 }}>
        {['Voice notes', 'Live calls'].map((l, i) => {
          const lit = (i === 1) === cloud
          return (
            <button
              key={l}
              type="button"
              tabIndex={-1}
              onClick={() => setCloud(i === 1)}
              className={cn('label flex-1 text-[10px] whitespace-nowrap transition-colors duration-300', lit ? 'bg-ink text-white' : 'text-muted')}
            >
              {l}
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const views: Array<{
  label: string
  icon: IconName
  title?: string
  caption: string
  View: (p: { play: boolean }) => ReactNode
}> = [
  {
    label: 'Voice conversion',
    icon: 'asterisk',
    caption: "Transform captured speech into a different voice output using Loki's voice-conversion engine.",
    View: RoutingView,
  },
  {
    label: 'Voice notes',
    icon: 'chat',
    caption: 'Send transformed voice notes on WhatsApp and Telegram, recorded and converted right on your phone.',
    View: TracingView,
  },
  {
    label: 'Live calls',
    icon: 'respond',
    caption:
      'Transform your voice in real time during WhatsApp and Telegram calls. A one-time setup with Shizuku gets your phone ready.',
    View: CostView,
  },
  {
    label: 'Audio pipeline',
    icon: 'tracing',
    title: 'An audio pipeline built for speech.',
    caption:
      'Loki connects audio capture, conversion, and output, so the transformation is part of the conversation rather than a separate editing routine.',
    View: SecureView,
  },
  {
    label: 'Compatibility',
    icon: 'verify',
    title: 'Know what your device supports.',
    caption:
      'Loki checks your messaging app, Android version, permissions, and audio routing, and tells you exactly what to change. Live calls need Android 13 or newer.',
    View: ModelView,
  },
  {
    label: 'Availability',
    icon: 'grid',
    title: 'Ready on Android.',
    caption:
      'Download Loki, create your account in the app, and start with 30 free minutes of voice conversion every month.',
    View: HostView,
  },
]

const DURATION = 6000

function DesktopTabs() {
  const [active, setActive] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [ref, onScreen] = useOnScreen<HTMLDivElement>()
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const running = onScreen && !paused && !reduced

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % views.length)
      setCycle((c) => c + 1)
    }, DURATION)
    return () => window.clearTimeout(id)
  }, [running, active, cycle])

  const { View } = views[active]
  return (
    <div ref={ref} className="mt-12 border border-line" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="dots-bg relative h-[400px] overflow-hidden">
        <div key={active} className="animate-[view-in_600ms_cubic-bezier(0.22,1,0.36,1)]">
          <Fit height={400}>
            <View play={onScreen} />
          </Fit>
        </div>
      </div>
      <div className="flex items-center gap-6 border-t border-line px-6 py-5" aria-live="polite">
        <span className="label text-muted tabular-nums">{String(active + 1).padStart(2, '0')} / 06</span>
        <span key={active} className="max-w-[860px] animate-[view-in_500ms_cubic-bezier(0.22,1,0.36,1)] text-[16px] leading-[1.5] text-muted">
          {views[active].title && <span className="font-medium text-ink">{views[active].title} </span>}
          {views[active].caption}
        </span>
      </div>
      <div role="tablist" aria-label="Platform views" className="grid grid-cols-6 border-t border-line">
        {views.map((v, i) => {
          const on = i === active
          return (
            <button
              key={v.label}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => {
                setActive(i)
                setCycle((c) => c + 1)
              }}
              className={cn(
                'group relative flex h-[104px] flex-col items-start justify-between border-line p-5 text-left not-last:border-r transition-colors duration-300',
                on ? 'bg-white' : 'hover:bg-white/50',
              )}
            >
              <span className="absolute inset-x-0 -top-px h-[2px] overflow-hidden">
                {on && (
                  <span
                    key={cycle}
                    className="block h-full origin-left bg-accent"
                    style={{
                      animation: `progress-fill ${DURATION}ms linear forwards`,
                      animationPlayState: running ? 'running' : 'paused',
                    }}
                  />
                )}
              </span>
              <Pixel name={v.icon} size={2} className={cn('transition-colors duration-300', on ? 'text-accent' : 'text-ink/70 group-hover:text-ink')} />
              <span className={cn('text-[15px] transition-colors duration-300', on ? 'text-ink' : 'text-muted group-hover:text-ink')}>{v.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MobileCarousel() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [ref, onScreen] = useOnScreen<HTMLDivElement>()

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const onScroll = () => {
      const card = el.firstElementChild as HTMLElement | null
      if (!card) return
      const i = Math.round(el.scrollLeft / (card.offsetWidth + 12))
      setActive(Math.min(Math.max(i, 0), views.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const go = (i: number) => {
    const el = scroller.current
    const card = el?.children[i] as HTMLElement | undefined
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }

  return (
    <div ref={ref} className="mt-10">
      <div ref={scroller} className="no-scrollbar -mr-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pr-4 md:-mr-6 md:pr-6">
        {views.map((v, i) => (
          <article key={v.label} className="w-[86%] shrink-0 snap-start border border-line bg-white md:w-[64%]">
            <header className="flex items-center gap-4 border-b border-line p-4">
              <span className="flex size-[38px] items-center justify-center border border-line-2 bg-paper text-accent">
                <Pixel name={v.icon} size={3} />
              </span>
              <h3 className="text-[20px] font-medium tracking-[-0.02em]">{v.label}</h3>
            </header>
            <div className="dots-bg border-b border-line">
              <Fit height={240}>
                <v.View play={onScreen && i === active} />
              </Fit>
            </div>
            <p className="p-5 text-[16px] leading-[1.5] text-muted">
              {v.title && <span className="font-medium text-ink">{v.title} </span>}
              {v.caption}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="label text-muted tabular-nums">{String(active + 1).padStart(2, '0')} / 06</span>
        <div className="flex gap-1.5">
          {views.map((v, i) => (
            <button
              key={v.label}
              type="button"
              aria-label={`Show ${v.label}`}
              onClick={() => go(i)}
              className="size-[10px] transition-colors duration-300"
              style={{ background: i === active ? '#ff4f00' : '#e2e2dc' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Platform() {
  return (
    <Section n="07" id="platform">
      <div className="px-4 pt-10 pb-16 md:px-6 md:pt-20 md:pb-20 xl:pt-[132px] xl:pb-[132px]">
        <Reveal>
          <Chip>The product</Chip>
        </Reveal>
        <Words className="display mt-6 max-w-[900px] text-[38px] md:text-[48px] xl:text-[56px]">
          One voice engine. Different ways to use it.
        </Words>
        <Reveal className="hidden lg:block" delay={120}>
          <DesktopTabs />
        </Reveal>
        <div className="lg:hidden">
          <MobileCarousel />
        </div>
      </div>
    </Section>
  )
}
