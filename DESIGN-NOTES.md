# Sigil landing page — design notes (from reference screenshots)

## Global layout
- Page bg light: warm off-white `#f1f0ec` (approx). Dark sections: near-black `#111111`.
- Left rail ~160px wide with vertical hairline at x=160 and x=1280 (content column 1120px wide), right margin 160px.
- Section index numbers in left rail: `01`, `02`, `03` ... small mono gray.
- Accent orange: `#ff4d00` / `#ff5c1a` (bright orange-red).
- Type:
  - Sans (headings/body): modern grotesque, tight tracking (Inter Tight / Inter, -0.02em..-0.03em).
  - Mono labels: uppercase, letterspaced ~0.08em, small 11-12px.
  - Pixel/mono accent font (orange "control plane.", big numbers like 40+, $0, 30+, <50ms, SOC 2, prices, counters).
- Buttons: square corners (0 radius), black bg + white text, or orange bg + white text, or white bg + black text.
- Links: dashed underline + `↗` arrow.

## Nav
- Logo: pixel asterisk glyph + "Sigil" wordmark, bold sans ~20px.
- Center nav inside a bordered box (1px hairline): PRODUCT · HOW IT WORKS · FEATURES · PRICING · BLOG (mono, uppercase, letterspaced, ~12px).
- Right: bordered button "START FREE" (mono uppercase).
- Ticker strip under nav, hairline top/bottom, centered mono text e.g. "ROUTED 12M+ AGENT RUNS THIS WEEK".

## 02 Hero
- Small orange stair-step pixel mark at top-left of content column.
- Headline ~96-104px: line1 = pixel-asterisk glyph + "Every agent." (black sans), line2 = "One " (black sans) + "control plane." (ORANGE pixel-mono font) + "." black.
- Sub copy (gray ~18px, max ~560px): "Deploy, route and monitor AI agents in production from one place. No glue code, no scattered scripts, no guessing what your agents did at 3 AM."
- Right column: black button "✳ Start free trial" (orange asterisk icon), link "Read the changelog ↗" dashed underline; below: mono `$ npm install @sigil/sdk` + copy icon.

## 03 Routing grid (hero visual)
- Full-width grid of squares (hairline), diagonal lines across some cells.
- Labels w/ small pixel icons: RETRIEVE, ROUTER, TOOL CALL, VERIFY, RESPOND + latency numbers (1.09, 1.341, 0.42, 0.351, 1.630).
- Top-right: `RUNS 12,408,446` live counter (pixel font), increments.
- Bottom center: orange pixel scatter/histogram distribution (small orange squares, denser toward center), with a solid orange bar in middle bottom.
- Some cells have light-orange tint background with diagonal orange line.

## 04 Logos strip
- Row of 5 gray wordmarks w/ small icons: Relaylane, QUANTA, hexbyte, Loomstack, PARCEL/AI.

## 05 Problem (dark)
- Chip: "■ THE PROBLEM" (dark chip, orange square, mono).
- H2 white ~56px: "Agents don't fail loudly."
- 2x2 grid of bordered cells (hairline `#2a2a2a`), each: pixel number in bordered square + title + gray subtitle.
  - `40+` Scripts per team — Every agent ships its own runner.
  - `5` Places logs end up — Or none, when it matters.
  - `$0` Budget limits — Token spend has no ceiling.
  - `0` (orange) Traces when it fails — You hear about it from users.

## 05b With Sigil (dark)
- Left: orange mono "WITH SIGIL", H2 white: "Traced, fixed and rerouted in **4.2s.**" (4.2s orange), white button "✳ Start free trial" (white bg, black text, orange icon).
- Right: dark isometric illustration — wireframe cubes on a dark diagonal grid, center glowing orange cube.

## 06 How it works (light)
- Chip "■ HOW IT WORKS", H2: "From prototype to production in four steps."
- Split panel: left white card (step text), right isometric illustration on light diagonal grid; corner brackets on card corners.
- Progress dashes at top of card (4 groups of dashes, active group orange).
- Step: big title line1 black, line2 gray (e.g. "Connect / your stack"); bottom: chip "■ SDK · ONE INSTALL", gray paragraph, "Learn more ↗" dashed link.
- Illustrations differ per step (cubes w/ zendesk/stripe/postgres/openai labels; deploy platform w/ v11 v10; traces bars w/ p95).
- Steps confirmed:
  1. Connect / your stack — chip "SDK · ONE INSTALL" — "Plug in models, APIs and tools through one SDK. Keep the providers you already use." — illo: central cube w/ orange sigil + 4 satellite cubes labeled zendesk, stripe, postgres, openai (dotted outlines), small orange connector cubes.
  2. Deploy / in one command — chip "VERSIONED RELEASES" — "Ship to production with a single versioned command, and roll back just as fast." — illo: platform slab w/ v11 + v10 cubes, translucent orange cube hovering above.
  3. (from 06b screenshot order) Route/run step — need title; likely "Route / every request" w/ chip.
  4. Trace / everything — chip "TRACES · COSTS" — "Trace every step, token and decision in real time. Get alerted before users notice." — illo: bar chart on slab, orange bar tallest, dotted p95 line + orange marker cube "p95".
- Progress dashes: 4 groups × ~12 dashes; completed = black, active = orange, upcoming = light gray.

## 07 Platform / features (light)
- Chip "■ PLATFORM", H2: "One canvas. Six views."
- Big bordered panel with dotted bg: centered diagram — orange pixel icon box connected to a table: columns crm.r bill.w tix.r admin; rows support/billing/research with orange/empty checkboxes; below an `audit.log` box.
- Caption bar: `04 / 06` + "Scoped permissions and a full audit log for every action."
- Bottom tabs row (6): Agent routing ✳ | Unified tracing | Cost controls | Secure by default (active: white bg, orange top border, orange icon) | Model-agnostic | Self-host or cloud.

## 08 Reliability (light)
- Left: light isometric illustration (stacked server slabs w/ orange sigil mark) inside bracketed frame.
- Right: H2 "Reliability at every scale.", gray para "Built for uptime and isolation, from your first deploy to millions of runs a day.", 3 rows with orange check + hairline separators:
  - 99.99% uptime SLA on Sigil Cloud
  - Versioned, isolated deploys with instant rollback
  - Automatic horizontal scaling across regions

## 09 SDK (dark)
- Left: H2 white "Ship an agent in one command.", gray para "Define agents in TypeScript, set a budget, then deploy. Sigil handles versions, isolation and scale.", link "Read the changelog ↗".
- Right: code window (dark, hairline border): tab "■ agent.ts" + "TYPESRIPT" right label; line numbers 1-7; syntax colors: keywords orange, strings white, values orange.
  - import { agent, tool, route, budget } from '@sigil/sdk'
  - export default agent({
  -   name: 'support-triage',
  -   model: route({ primary: 'large', fallback: 'small' }),
  -   tools: [tool.zendesk(), tool.postgres('tickets')],
  -   budget: budget.perRun({ usd: 0.02 }),
  - })
  - Footer bar: "■ DEPLOYED  SUPPORT-TRIAGE@V12"

## 10 Metrics (light)
- 4 cells with corner brackets, hairline dividers: big pixel numbers + mono caption:
  - `30+` MODEL PROVIDERS
  - `<50ms` ROUTING OVERHEAD
  - `40%` LOWER TOKEN SPEND
  - `SOC 2` TYPE II COMPLIANT

## 11 Customers (light)
- Chip "■ CUSTOMERS", H2 "Teams ship agents with Sigil.", right: 3 square icon buttons (← , ⏸ pause, → active black).
- Carousel of quote cards (hairline border; active card has orange corner marks): orange quote glyph, company name mono right, quote text ~18px, hairline, avatar 40px + name + mono role.
  - PARCEL/AI — "Self-hosting in our VPC took an afternoon. Security signed off because every action lands in the audit log." — Lena Hoffmann, PLATFORM LEAD
  - RELAYLANE — "Sigil gave us one place to see every agent run. Our token bill dropped by a third in the first month." — Maya Okafor, CTO
  - (3rd, partially visible) "We replaced forty cron… one control plane. On-c… nightly pages to a quie…" — Daniel Kim, STAFF ENGINEER

## 12 Pricing (light)
- Chip "■ PRICING", H2 two lines: "Simple pricing." / "Pay for what your agents run."
- Right: segmented toggle in bordered box: "■ Monthly" (active, white bg, orange square) | "Annually" + orange badge "SAVE 20%".
- 3 columns divided by hairlines; middle "Team" highlighted (white bg, orange border + orange corner marks, "MOST POPULAR" label with hairline).
  - Starter — For solo builders shipping their first agents — $19.00 /month (cents in light gray) — BILLED MONTHLY — black btn "✳ Get started" — Includes: 100K agent runs / month, Unified tracing 7-day retention, 3 agents in production, Community support
  - Team — For product teams running agents in production — $49.00 — ORANGE btn "✳ Start 14-day trial" — Includes everything in Starter, plus: 2M agent runs / month, 30-day trace retention, Budgets and cost alerts, Retries and model fallbacks, Email support
  - Scale — For orgs running fleets of agents — $149.00 — black btn "✳ Get started" — Includes everything in Team, plus: Unlimited agents, 90-day trace retention, SSO, SCIM and audit logs, Self-host in your VPC, 99.99% uptime SLA

## 13 FAQ (light)
- Left col: H2 "Questions" (huge), link "Read the changelog ↗".
- Right col: accordion rows separated by hairlines: mono index `01`..`06` + question (~22px) + `+` icon right.
  - 01 What is Sigil?
  - 02 Which frameworks and models work?
  - 03 How long does setup take?
  - 04 How does it cut token costs?
  - 05 Is there a free trial?
  - 06 Where does my data live?

## 14 CTA (dark)
- Left: H2 white ~72px "Ship agents / that don't / **break.**" (break. in orange pixel font), gray para "Start free. See every run from day one.", white button "✳ Start free trial", link "Talk to an engineer ↗".
- Right: dark graphic — concentric squares (hairline/dotted) with orange tick segments and center orange pixel asterisk in a small box.

## 15 Footer (dark)
- Top row: left cell `01` + big "Request a demo" + orange pixel arrow ↗; right grid 3x2 cells with `02`..`07` indexes and links: Product, Features, Pricing / Changelog, Blog, Careers (each with ↗).
- Middle bar: Sigil logo left; right mono "DESIGNED BY THE REDD STUDIO".
- Giant "SIGIL" wordmark in pixel font, very dark gray (barely visible), spanning width.
- Bottom bar: "© 2026 SIGIL LABS, INC." left; right mono "PRIVACY · TERMS · DPA".
