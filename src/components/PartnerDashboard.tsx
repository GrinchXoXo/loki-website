import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { getApps, initializeApp } from 'firebase/app'
import {
  ArrowLink,
  Brackets,
  Chip,
  PixelButton,
  Reveal,
  Section,
  Words,
} from '@/components/ui'
import {
  LINKS,
  LOKI_API_URL,
  PARTNER_FIREBASE_CONFIG,
  PARTNER_SIGN_IN_AVAILABLE,
} from '@/lib/links'
type Row = {
  id: string
  created_at: string
  plan?: string
  plan_name?: string
  amount_minor: number
  status: string
  buyer?: string
}
type Data = {
  code: string
  counts: { signups: number; buyers: number }
  totals: { pending: number; payable: number; paid: number }
  recent_commissions: Row[]
}
const auth = () =>
  getAuth(
    getApps().find((a) => a.name === 'loki-partner') ??
      initializeApp(PARTNER_FIREBASE_CONFIG, 'loki-partner'),
  )
const cash = (n: number) =>
  '₦' +
  new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(
    Math.round(n / 100),
  )
const date = (v: string) => {
  const d = new Date(v)
  return Number.isNaN(d.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d)
}
const status = (s: string) =>
  ({
    PENDING: 'Pending',
    PAYABLE: 'Ready',
    PAID: 'Paid',
    REVERSED: 'Reversed',
  })[s.toUpperCase()] || s
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative flex min-h-[118px] flex-col justify-between gap-5 border-line px-4 py-6 odd:border-r [&:nth-child(-n+2)]:border-b md:px-6 md:py-7 lg:border-r lg:last:border-r-0 lg:[&:nth-child(-n+2)]:border-b-0">
      <Brackets className="inset-2" size={10} />
      <span className="label text-[11px] text-muted">{label}</span>
      <span className="pixel text-[22px] text-ink">{value}</span>
    </div>
  )
}

function signInErrorMessage(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : ''

  if (
    [
      'auth/invalid-credential',
      'auth/wrong-password',
      'auth/user-not-found',
      'auth/invalid-email',
    ].includes(code)
  ) {
    return 'Wrong email or password.'
  }
  if (code === 'auth/popup-closed-by-user') return ''
  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Wait a few minutes and try again.'
  }
  return "Couldn't sign in. Try again."
}

export function PartnerDashboard() {
  const [user, U] = useState<User | null>(null),
    [data, D] = useState<Data | null>(null),
    [loading, L] = useState(true),
    [missing, M] = useState(false),
    [error, E] = useState(''),
    [email, Email] = useState(''),
    [password, Password] = useState(''),
    [copied, Copied] = useState(false)
  const load = async (u: User) => {
    L(true)
    E('')
    try {
      const token = await u.getIdToken(),
        r = await fetch(LOKI_API_URL + '/v1/partner/me', {
          headers: { Authorization: 'Bearer ' + token },
        })
      if (r.status === 404) {
        M(true)
        D(null)
      } else if (!r.ok)
        throw new Error(
          r.status === 401
            ? 'Please sign in again, then retry.'
            : 'Could not load your partner details.',
        )
      else {
        D((await r.json()) as Data)
        M(false)
      }
    } catch (e) {
      E(e instanceof Error ? e.message : 'Could not load your partner details.')
    } finally {
      L(false)
    }
  }
  useEffect(() => {
    if (!PARTNER_SIGN_IN_AVAILABLE) {
      L(false)
      return
    }
    let active = true,
      off = () => {}
    try {
      off = onAuthStateChanged(
        auth(),
        (u) => {
          if (!active) return
          U(u)
          D(null)
          M(false)
          if (u) void load(u)
          else L(false)
        },
        () => {
          E('Partner sign-in is unavailable. Please try again.')
          L(false)
        },
      )
    } catch {
      E('Partner sign-in is unavailable. Please try again.')
      L(false)
    }
    return () => {
      active = false
      off()
    }
  }, [])
  const perform = async (f: () => Promise<unknown>) => {
    E('')
    try {
      await f()
    } catch (e) {
      E(signInErrorMessage(e))
    }
  }
  const copy = async () => {
    if (!data) return
    try {
      await navigator.clipboard.writeText(data.code)
      Copied(true)
      window.setTimeout(() => Copied(false), 1200)
    } catch {
      E('Could not copy the code. Select and copy it instead.')
    }
  }
  const dl = LINKS.download.startsWith('/')
    ? new URL(LINKS.download, window.location.origin).toString()
    : LINKS.download
  const share =
    'https://wa.me/?text=' +
    encodeURIComponent(
      'Get Loki and use my code ' +
        (data?.code || '') +
        ' for 10 free minutes: ' +
        dl,
    )
  return (
    <Section n="16" id="partner" className="border-t-0">
      <div className="grid gap-10 pt-10 pb-16 md:pt-20 md:pb-20 lg:grid-cols-[400px_1fr] lg:gap-0 xl:pt-[128px] xl:pb-[128px]">
        <div className="px-4 md:px-6">
          <Reveal>
            <Chip>Partner account</Chip>
          </Reveal>
          <Words as="h1" className="display mt-6 text-[44px] md:text-[56px]">
            {data ? 'Your Loki code' : 'Partner sign-in'}
          </Words>
          <Reveal
            as="p"
            delay={150}
            className="mt-6 max-w-[340px] text-[16px] leading-[1.5] text-muted"
          >
            Sign in to see your code and earnings.
          </Reveal>
          <div className="mt-7">
            <ArrowLink href="/partners">How the programme works</ArrowLink>
          </div>
        </div>
        <div className="border-t border-line px-4 py-8 md:px-6 md:py-10">
          {!PARTNER_SIGN_IN_AVAILABLE ? (
            <p className="text-muted">Partner sign-in isn't available yet</p>
          ) : loading ? (
            <p role="status" className="text-muted">
              Loading your partner account…
            </p>
          ) : data && user ? (
            <>
              <div className="relative flex flex-col gap-5 border border-line p-5 md:flex-row md:items-end md:justify-between md:p-7">
                <Brackets className="inset-2" size={12} />
                <div>
                  <span className="label text-[11px] text-muted">
                    YOUR CODE
                  </span>
                  <p className="pixel mt-3 text-[40px] leading-none md:text-[52px]">
                    {data.code}
                  </p>
                </div>
                <button
                  onClick={() => void copy()}
                  className="label border border-line-2 px-4 py-3 hover:border-accent"
                >
                  {copied ? 'Copied' : 'Copy code'}
                </button>
                <ArrowLink href={share}>Share on WhatsApp</ArrowLink>
              </div>
              <div className="mt-8 grid grid-cols-2 border-t border-line lg:grid-cols-5">
                <Fact label="SIGN-UPS" value={'' + data.counts.signups} />
                <Fact label="BUYERS" value={'' + data.counts.buyers} />
                <Fact label="PENDING" value={cash(data.totals.pending)} />
                <Fact label="READY TO PAY" value={cash(data.totals.payable)} />
                <Fact label="PAID" value={cash(data.totals.paid)} />
              </div>
              <h2 className="mt-10 border-t border-line py-5 text-[20px] font-medium">
                Recent earnings
              </h2>
              {data.recent_commissions.length ? (
                data.recent_commissions.map((x) => (
                  <div
                    key={x.id}
                    className="grid grid-cols-[1fr_auto] gap-2 border-t border-line py-4 sm:grid-cols-[1fr_1fr_auto_auto]"
                  >
                    <span>{x.buyer || 'User'}</span>
                    <span className="text-[14px] text-muted">
                      {x.plan_name || x.plan || 'Minute pack'} ·{' '}
                      {date(x.created_at)}
                    </span>
                    <span>{cash(x.amount_minor)}</span>
                    <span className="label col-span-2 text-[10px] text-muted sm:col-span-1">
                      {status(x.status)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="border-t border-line py-5 text-muted">
                  Your earnings will appear here after a referred user buys
                  minutes.
                </p>
              )}
              <button
                onClick={() => void signOut(auth())}
                className="mt-8 border-t border-line pt-5 label"
              >
                Sign out
              </button>
            </>
          ) : missing ? (
            <div className="py-7">
              <p className="text-[20px]">You're not a Loki partner yet.</p>
              <div className="mt-6">
                <PixelButton href={LINKS.partnerForm}>
                  Become a partner
                </PixelButton>
              </div>
            </div>
          ) : user ? (
            <div>
              <p role="alert" className="mb-4 text-accent">
                {error || 'Could not load your partner details.'}
              </p>
              <button
                onClick={() => void load(user)}
                className="border border-line-2 px-4 py-3 label"
              >
                Retry
              </button>
              <button
                onClick={() => void signOut(auth())}
                className="ml-5 label"
              >
                Sign out
              </button>
            </div>
          ) : (
            <form
              className="max-w-[440px]"
              onSubmit={(e) => {
                e.preventDefault()
                void perform(() =>
                  signInWithEmailAndPassword(auth(), email, password),
                )
              }}
            >
              <label
                htmlFor="partner-email"
                className="label text-[11px] text-muted"
              >
                EMAIL
              </label>
              <input
                id="partner-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => Email(e.target.value)}
                required
                className="mt-2 mb-5 w-full border border-line-2 bg-paper px-4 py-3 text-ink outline-none focus:border-accent"
              />
              <label
                htmlFor="partner-password"
                className="label text-[11px] text-muted"
              >
                PASSWORD
              </label>
              <input
                id="partner-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => Password(e.target.value)}
                required
                className="mt-2 w-full border border-line-2 bg-paper px-4 py-3 text-ink outline-none focus:border-accent"
              />
              {error && (
                <p role="alert" className="mt-4 text-accent">
                  {error}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-4">
                <PixelButton
                  href="#partner-email"
                  onClick={() =>
                    void perform(() =>
                      signInWithEmailAndPassword(auth(), email, password),
                    )
                  }
                >
                  Sign in
                </PixelButton>
                <PixelButton
                  variant="light"
                  href="#partner-email"
                  onClick={() =>
                    void perform(() =>
                      signInWithPopup(auth(), new GoogleAuthProvider()),
                    )
                  }
                >
                  Continue with Google
                </PixelButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}
