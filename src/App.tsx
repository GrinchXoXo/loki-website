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

export default function App() {
  // /privacy, /terms and /setup reuse the site frame: nav, page body, footer.
  const doc = docForPath(window.location.pathname)
  if (doc) {
    document.title = `${doc.title} — Loki`
    return (
      <div className="min-h-screen bg-paper pt-16 text-ink xl:pt-0">
        <Nav />
        <main>
          <DocPage doc={doc} />
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
