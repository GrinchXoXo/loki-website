import { cn } from '@/lib/utils'
import { useInView, useOnScreen, useScramble } from '@/lib/motion'
import { DarkHubScene } from '@/components/iso'
import { Chip, PixelButton, Reveal, Section, Words } from '@/components/ui'

type Stat = { title: string; sub: string; accent?: boolean }

const stats: Stat[] = [
  { title: 'Strangers', sub: 'Buyers, sellers and matches you have never met hear your real voice on every call.' },
  { title: 'Creators', sub: 'Skits, characters and faceless channels need more than the one voice you were born with.' },
  { title: 'Gamers and streamers', sub: 'Party chat and live streams land better when your voice fits the moment.' },
  {
    title: 'Too much friction',
    sub: 'Most voice changers only work on recordings, not inside the calls and chats you already use.',
    accent: true,
  },
]

/** Index badge that decodes into place when the grid scrolls into view. */
function StatNumber({ index, accent, play, delay }: { index: number; accent?: boolean; play: boolean; delay: number }) {
  const text = useScramble(String(index + 1).padStart(2, '0'), play, 700, delay)
  return (
    <span className={cn('pixel text-[44px] leading-none tracking-[-0.02em] tabular-nums md:text-[52px]', accent ? 'text-accent' : 'text-white')}>
      {text}
    </span>
  )
}

export function Problem() {
  const [gridRef, inView] = useInView<HTMLDivElement>({ amount: 0.3 })
  const [sceneRef, sceneOn] = useOnScreen<HTMLDivElement>()
  return (
    <Section n="05" id="problem" dark>
      <div className="px-4 pt-10 pb-16 md:px-6 md:pt-20 md:pb-24 xl:pt-[132px] xl:pb-32">
        <Reveal>
          <Chip dark>The problem</Chip>
        </Reveal>
        <Words className="display mt-6 max-w-[760px] text-[38px] md:text-[48px] xl:text-[56px]">
          Your voice gives away more than you think.
        </Words>

        <div className="mt-10 border border-line-dark md:mt-12" ref={gridRef}>
          <div className="grid md:grid-cols-2 xl:grid-cols-[minmax(0,620fr)_minmax(0,436fr)]">
            {stats.slice(0, 2).map((s, i) => (
              <StatCell key={s.title} stat={s} play={inView} i={i} className={cn(i === 0 && 'md:border-r')} />
            ))}
          </div>
          <div className="grid border-t border-line-dark md:grid-cols-2 xl:grid-cols-[minmax(0,437fr)_minmax(0,619fr)]">
            {stats.slice(2).map((s, i) => (
              <StatCell key={s.title} stat={s} play={inView} i={i + 2} className={cn(i === 0 && 'md:border-r')} />
            ))}
          </div>

          {/* With Loki */}
          <div className="grid border-t border-line-dark lg:grid-cols-[minmax(0,560fr)_minmax(0,496fr)]">
            <div className="flex flex-col justify-center gap-6 px-6 py-10 md:px-12 md:py-14">
              <Reveal as="span" className="label text-accent">
                With Loki
              </Reveal>
              <Words className="display max-w-[460px] text-[36px] leading-[1.04] md:text-[48px] xl:text-[56px]">
                Change the sound. <span className="text-accent">Keep the conversation.</span>
              </Words>
              <Reveal delay={200}>
                <PixelButton variant="light" href="#how">
                  Discover Loki
                </PixelButton>
              </Reveal>
            </div>
            <div
              ref={sceneRef}
              className="iso-bg relative min-h-[300px] border-t border-line-dark [--iso:rgba(255,255,255,0.06)] md:min-h-[360px] lg:border-t-0 lg:border-l"
            >
              <DarkHubScene active={sceneOn} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function StatCell({ stat, play, i, className }: { stat: Stat; play: boolean; i: number; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-5 border-line-dark px-5 py-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] not-last:border-b md:gap-6 md:px-8 md:py-10 md:not-last:border-b-0 xl:py-11',
        className,
      )}
      style={{ opacity: play ? 1 : 0, transform: play ? 'none' : 'translateY(12px)', transitionDelay: `${i * 90}ms` }}
    >
      <span className="flex h-[76px] min-w-[76px] shrink-0 items-center justify-center bg-ink-2 px-4 md:h-[78px]">
        <StatNumber index={i} accent={stat.accent} play={play} delay={i * 120} />
      </span>
      <div>
        <h3 className="text-[20px] leading-[1.2] font-medium tracking-[-0.02em] md:text-[22px]">{stat.title}</h3>
        <p className="mt-1 text-[14px] leading-[1.5] text-muted-3">{stat.sub}</p>
      </div>
    </div>
  )
}
