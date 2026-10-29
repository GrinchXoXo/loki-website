import { DocPage } from '@/components/DocPage'
import { ArrowLink, PixelButton } from '@/components/ui'
import { PARTNERS } from '@/lib/docs'
import { LINKS } from '@/lib/links'

export function PartnersPage() {
  return (
    <DocPage
      doc={PARTNERS}
      actions={
        <div className="flex flex-col items-start gap-6">
          <PixelButton href={LINKS.partnerForm}>Become a partner</PixelButton>
          <ArrowLink href="/partner">Partner sign-in</ArrowLink>
          <ArrowLink href="/partner-terms">Partner terms</ArrowLink>
        </div>
      }
    />
  )
}
