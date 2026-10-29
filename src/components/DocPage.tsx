import { Fragment, type ReactNode } from 'react'
import { Pixel } from '@/components/pixel'
import { Chip, Reveal, Section, Words } from '@/components/ui'
import type { Doc, DocBlock } from '@/lib/docs'

/* ------------------------------------------------------------------ */
/* Privacy / Terms / Setup guide — same building blocks as the FAQ    */
/* ------------------------------------------------------------------ */

function Block({ block }: { block: DocBlock }) {
  if (typeof block === 'string') {
    return <p className="text-[16px] leading-[1.6] text-muted">{block}</p>
  }
  if ('note' in block) {
    return (
      <p className="flex gap-3 border-l-2 border-accent bg-white/50 px-4 py-3 text-[15px] leading-[1.55] text-ink">
        {block.note}
      </p>
    )
  }
  if ('steps' in block) {
    return (
      <ol className="border-t border-line">
        {block.steps.map((step, i) => (
          <li key={step} className="flex gap-5 border-b border-line py-3.5 text-[16px] leading-[1.5] text-ink">
            <span className="label w-6 shrink-0 pt-[3px] text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    )
  }
  return (
    <ul className="space-y-3">
      {block.list.map((item) => (
        <li key={item} className="flex gap-3 text-[16px] leading-[1.55] text-ink">
          <Pixel name="check" size={2} className="mt-[7px] shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function DocPage({ doc, actions }: { doc: Doc; actions?: ReactNode }) {
  return (
    <Section n="02" id="top" className="border-t-0">
      <div className="grid gap-10 pt-10 pb-16 md:pt-20 md:pb-20 lg:grid-cols-[400px_1fr] lg:gap-0 xl:pt-[128px] xl:pb-[128px]">
        <div className="px-4 md:px-6">
          <div className="lg:sticky lg:top-8">
            <Reveal>
              <Chip>{doc.chip}</Chip>
            </Reveal>
            <Words as="h1" className="display mt-6 text-[44px] md:text-[56px]">
              {doc.title}
            </Words>
            <Reveal as="p" delay={150} className="mt-6 max-w-[340px] text-[16px] leading-[1.5] text-muted">
              {doc.intro}
            </Reveal>
            {actions && <Reveal delay={220} className="mt-8 flex flex-col items-start gap-5">{actions}</Reveal>}
            {doc.updated && (
              <Reveal delay={200} className="label mt-6 text-[11px] text-muted">
                Updated {doc.updated}
              </Reveal>
            )}
            <nav aria-label="On this page" className="mt-10 hidden border-t border-line lg:block">
              {doc.sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-5 border-b border-line py-3 text-[15px] text-ink transition-colors duration-200 hover:text-accent"
                >
                  <span className="label w-6 shrink-0 text-[11px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="border-t border-line">
          {doc.sections.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 3) * 60} className="border-b border-line">
              <section id={s.id} className="scroll-mt-[var(--header-h)] px-4 py-8 md:py-10 md:pr-6 md:pl-4">
                <h2 className="flex items-baseline gap-5 text-[20px] leading-[1.3] font-medium tracking-[-0.01em] text-ink md:gap-8 md:text-[24px]">
                  <span className="label w-6 shrink-0 text-[11px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                <div className="mt-5 max-w-[640px] space-y-4 pl-11 md:pl-14">
                  {s.body.map((b, j) => (
                    <Fragment key={j}>
                      <Block block={b} />
                    </Fragment>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
