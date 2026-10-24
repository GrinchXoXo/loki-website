import { useInView } from '@/lib/motion'
import { Pixel } from '@/components/pixel'
import { StackScene } from '@/components/iso'
import { Brackets, Reveal, Section, Words } from '@/components/ui'

const items = [
  'Voice notes on WhatsApp and Telegram',
  'Audio capture and conversion pipeline',
  'Real-time routing for WhatsApp and Telegram calls',
  'Session cleanup and microphone restoration',
  'Readiness checks before every live call',
]

export function Reliability() {
  const [ref, inView] = useInView<HTMLDivElement>({ amount: 0.35 })
  return (
    <Section n="08" id="reliability">
      <div className="grid gap-8 pt-6 pb-16 md:pt-10 md:pb-20 lg:grid-cols-2 lg:gap-0 xl:py-[128px]">
        <div ref={ref} className="iso-bg relative h-[340px] border-y border-line md:h-[460px] lg:h-[620px] lg:border-r xl:border-y-0 xl:border-r-0">
          <StackScene play={inView} />
        </div>
        <div className="relative mx-4 flex flex-col justify-center px-6 py-10 md:mx-6 md:px-10 lg:my-0 lg:ml-8 lg:py-12">
          <Brackets size={10} />
          <Words className="display text-[38px] leading-[1.04] md:text-[48px] xl:text-[56px]">
            Built carefully. Tested in the real world.
          </Words>
          <Reveal as="p" delay={150} className="mt-6 max-w-[460px] text-[16px] leading-[1.5] text-muted">
            Voice conversion is only useful when the transformed audio reaches the right destination and the original
            audio routes are restored properly. Loki is built around the complete audio path, not just the
            conversion model.
          </Reveal>
          <ul className="mt-8 border-t border-line">
            {items.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                delay={250 + i * 70}
                className="flex items-center gap-3 border-b border-line py-3.5 text-[16px] leading-[1.5] text-ink"
              >
                <Pixel name="check" size={2} className="text-accent" />
                {item}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
