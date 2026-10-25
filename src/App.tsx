import { useEffect } from 'react'
import { Nav, Ticker } from '@/components/Nav'
import { Hero, HeroGrid, Logos } from '@/components/Hero'
import { Problem } from '@/components/Problem'
import { HowItWorks } from '@/components/HowItWorks'
import { Platform } from '@/components/Platform'
import { Reliability } from '@/components/Reliability'
import { Metrics, Sdk } from '@/components/Sdk'
import { Customers, Pricing } from '@/components/Customers'
import { Cta, Faq, Footer } from '@/components/Faq'
import { DocPage } from '@/components/DocPage'
import { docForPath } from '@/lib/docs'

const HOME_TITLE = 'Loki — Your voice. A different sound.'
const HOME_DESCRIPTION =
  'Loki changes how your voice sounds in real time on WhatsApp and Telegram calls and voice notes. For privacy, creators and gamers. Free to start on Android.'

function setMeta(selector: string, attr: string, content: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, content)
}

export default function App() {
  // Per-route SEO: title, description and social tags follow the current page.
  const routeDoc = docForPath(window.location.pathname)
  useEffect(() => {
    const title = routeDoc ? `${routeDoc.title} — Loki` : HOME_TITLE
    const description = routeDoc?.intro ?? HOME_DESCRIPTION
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    for (const sel of ['meta[property="og:title"]', 'meta[name="twitter:title"]'])
      setMeta(sel, 'content', title)
    for (const sel of [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      setMeta(sel, 'content', description)
    if (routeDoc) {
      const url = `https://loki.ridgeaire.workers.dev${routeDoc.path}`
      document.head
        .querySelector('link[rel="canonical"]')
        ?.setAttribute('href', url)
      setMeta('meta[property="og:url"]', 'content', url)
    } else {
      const url = 'https://loki.ridgeaire.workers.dev/'
      document.head
        .querySelector('link[rel="canonical"]')
        ?.setAttribute('href', url)
      setMeta('meta[property="og:url"]', 'content', url)
    }
  }, [routeDoc])

  // /privacy, /terms and /setup reuse the site frame: nav, page body, footer.
  if (routeDoc) {
    return (
      <div className="min-h-screen bg-paper pt-16 text-ink xl:pt-0">
        <Nav />
        <main>
          <DocPage doc={routeDoc} />
        </main>
        <Footer />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-paper pt-16 text-ink xl:pt-0">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Ticker />
        <Hero />
        <HeroGrid />
        <Logos />
        <Problem />
        <HowItWorks />
        <Platform />
        <Reliability />
        <Sdk />
        <Metrics />
        <Customers />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
