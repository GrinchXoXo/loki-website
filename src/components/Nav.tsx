import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useScramble } from '@/lib/motion'
import { Pixel } from '@/components/pixel'
import { PixelButton, Scramble } from '@/components/ui'
import { LINKS } from '@/lib/links'

const links = [
  { label: 'Product', href: '/#problem' },
  { label: 'How it works', href: '/#how' },
  { label: 'Features', href: '/#platform' },
  { label: 'Availability', href: '/#availability' },
  { label: 'FAQ', href: '/#faq' },
]

const menuLinks = links

function Logo({ className }: { className?: string }) {
  return (
    <a href="/#top" className={cn('flex items-center gap-2.5', className)} aria-label="Loki home">
      <Pixel name="logo" size={3} />
      <span className="text-[20px] leading-none font-medium tracking-[-0.01em]">Loki</span>
    </a>
  )
}

function ScrambleOnce({ text }: { text: string }) {
  return <>{useScramble(text, true, 380)}</>
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [hover, setHover] = useState(0)
  return (
    <a
      href={href}
      onMouseEnter={() => setHover((h) => h + 1)}
      className="label text-muted transition-colors duration-200 hover:text-ink"
    >
      <span aria-hidden="true">{hover ? <ScrambleOnce key={hover} text={label} /> : label}</span>
      <span className="sr-only">{label}</span>
    </a>
  )
}

function OutlineButton({ children, className }: { children: string; className?: string }) {
  return (
    <a
      href={LINKS.download}
      className={cn(
        'label inline-flex h-10 items-center border border-ink/60 px-4 text-ink transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-white xl:h-[42px] xl:px-5',
        className,
      )}
    >
      {children}
    </a>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 1200 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.documentElement.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <>
      {/* Desktop: sits in the page flow */}
      <header className="relative z-30 hidden h-[72px] border-b border-line xl:block">
        <div className="frame flex h-full items-center justify-between border-x border-line pr-8 pl-3">
          <Logo />
          <nav
            aria-label="Primary"
            className="absolute left-1/2 flex h-10 -translate-x-1/2 items-center gap-8 border border-line-2 px-6"
          >
            {links.map((l) => (
              <NavLink key={l.label} {...l} />
            ))}
          </nav>
          <OutlineButton>Get Loki</OutlineButton>
        </div>
      </header>

      {/* Tablet / phone: fixed bar + full-screen menu */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line bg-paper xl:hidden">
        <div className="flex h-full items-center justify-between px-4 md:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="relative flex size-10 items-center justify-center border border-ink/60 transition-colors hover:border-ink"
            >
              <span
                className={cn(
                  'absolute h-[1.5px] w-[18px] bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  open ? 'rotate-45' : '-translate-y-[4px]',
                )}
              />
              <span
                className={cn(
                  'absolute h-[1.5px] w-[18px] bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  open ? '-rotate-45' : 'translate-y-[4px]',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-paper transition-[opacity,visibility] duration-300 xl:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
          {menuLinks.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-5 border-b border-line px-4 py-4 transition-[transform,opacity,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-accent md:px-8"
              style={{
                transform: open ? 'none' : 'translateY(10px)',
                opacity: open ? 1 : 0,
                transitionDelay: open ? `${80 + i * 45}ms` : '0ms',
              }}
            >
              <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[22px] font-medium tracking-[-0.02em]">{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="space-y-4 px-4 pt-6 pb-8 md:px-8">
          <PixelButton block href={LINKS.download}>
            Get Loki
          </PixelButton>
          <p className="label text-muted normal-case">© 2026 Loki. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}

export function Ticker() {
  return (
    <div className="relative border-b border-line">
      <div className="frame flex h-14 border-x border-line">
        <span className="label hidden items-center text-muted xl:absolute xl:top-0 xl:left-[calc(32px-var(--rail))] xl:flex xl:h-full">
          <Scramble text="01" />
        </span>
        <span className="label flex w-14 shrink-0 items-center justify-center border-r border-line text-muted md:w-16 xl:hidden">
          <Scramble text="01" />
        </span>
        <p className="label flex flex-1 items-center justify-center bg-white px-2 text-center text-[11px] whitespace-nowrap text-ink md:px-4 md:text-[12px]">
          <Scramble text="Voice conversion · Now on Android" duration={900} />
        </p>
      </div>
    </div>
  )
}
