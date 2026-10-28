/**
 * Copy for the Privacy, Terms and Setup guide pages.
 * Plain data so the wording can be edited without touching layout code.
 */
import { LEGAL_NAME, SUPPORT_EMAIL } from '@/lib/links'
import { FREE_MINUTES, FREE_RULE } from '@/lib/plans'

export type DocBlock = string | { list: string[] } | { steps: string[] } | { note: string }

export type DocSection = { id: string; title: string; body: DocBlock[] }

export type Doc = {
  path: string
  chip: string
  title: string
  intro: string
  updated?: string
  sections: DocSection[]
}

const contactLine = SUPPORT_EMAIL
  ? `Questions? Use the Contact link at the bottom of this page or email ${SUPPORT_EMAIL}.`
  : 'Questions? Use the Contact link at the bottom of this page.'

const UPDATED = 'October 2026'

export const PRIVACY: Doc = {
  path: '/privacy',
  chip: 'Privacy',
  title: 'Privacy policy',
  intro: `This explains what ${LEGAL_NAME} collects when you use the Loki app and website, where it is kept, and how you can delete it.`,
  updated: UPDATED,
  sections: [
    {
      id: 'collect',
      title: 'What we collect',
      body: [
        {
          list: [
            'Account details: your email address, display name, username, and profile photo if you add one. Sign-in is handled by Google Firebase.',
            'Voice recordings you save as voices: the 45–60 second clips you record or upload to create a voice.',
            'Usage: when you convert, for how long, and which voice you used, so we can count your minutes.',
            'Payments: what you bought, when, and the amount. Card and bank details are handled by our payment provider; we never see or store them.',
            'Support messages you send us.',
          ],
        },
      ],
    },
    {
      id: 'audio',
      title: 'Your live audio',
      body: [
        'While a conversion runs, your microphone audio is streamed to our conversion server, converted, and sent straight back to your phone. We do not record or keep that stream.',
        'Loki only uses the microphone while you are recording a voice or converting. Android shows its microphone indicator whenever it is in use.',
      ],
    },
    {
      id: 'where',
      title: 'Where it is stored',
      body: [
        {
          list: [
            'Account, usage and payment records: a PostgreSQL database run by Neon, in the United Kingdom.',
            'Voice recordings and profile photos: Backblaze B2 cloud storage, in the United States. They are private and only reachable through short-lived signed links.',
            'Voice conversion: our server on Amazon Web Services, in Ireland. A temporary copy of the voice you are using may be kept there while it is in use.',
            'Sign-in: Google Firebase Authentication.',
            'On your phone: your settings, the voice you last chose, and your session history.',
          ],
        },
        'All of these connections are encrypted (HTTPS).',
      ],
    },
    {
      id: 'use',
      title: 'How we use it',
      body: [
        {
          list: [
            'To run your account and convert your voice.',
            'To count your free and paid minutes and process payments.',
            'To fix problems and answer support requests.',
          ],
        },
        'We do not sell your data, use it for advertising, or use your voice recordings to train models.',
      ],
    },
    {
      id: 'permissions',
      title: 'Phone permissions',
      body: [
        {
          list: [
            'Microphone: to record voices and convert your speech.',
            'Notifications: to show that a conversion is running.',
            'Display over other apps (optional): only for the floating button.',
            'Shizuku (optional): only for live calls. Shizuku is a separate app you install yourself.',
          ],
        },
      ],
    },
    {
      id: 'delete',
      title: 'Deleting your data',
      body: [
        'Delete a single voice in the app under Voices. Delete everything in the app under Settings → Profile → Delete account: your voices, profile photo and profile are removed permanently and you are signed out.',
        'Payment records are kept for as long as the law requires. Deleted data may remain in encrypted backups for a short period before it is overwritten.',
        'Uninstalling the app does not delete your account. Delete it in the app first.',
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      body: [
        'You can ask for a copy of your data, ask us to correct it, or ask us to delete it, as provided by the Nigeria Data Protection Act 2023 and other laws that apply to you.',
        'Loki is for people aged 18 and over.',
        'This website does not use tracking or advertising cookies.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes and contact',
      body: ['If this policy changes, we will update this page and the date above.', contactLine],
    },
  ],
}

export const TERMS: Doc = {
  path: '/terms',
  chip: 'Terms',
  title: 'Terms of service',
  intro: `These terms are an agreement between you and ${LEGAL_NAME} for using the Loki app and website. By creating an account you accept them.`,
  updated: UPDATED,
  sections: [
    {
      id: 'eligibility',
      title: 'Using Loki',
      body: [
        'You must be at least 18 years old. Keep your sign-in details safe; you are responsible for what happens in your account.',
      ],
    },
    {
      id: 'consent',
      title: 'Voice consent',
      body: [
        'Only create voices from your own recordings, or from someone who has given you clear permission to use their voice.',
        'You must not use Loki to:',
        {
          list: [
            'pretend to be a real person in order to deceive, defraud, harass, threaten or embarrass anyone;',
            'get money, information or access by impersonation;',
            'break any law, or anyone else’s rights, including privacy and intellectual-property rights.',
          ],
        },
        'We may suspend or close accounts that break these rules, and we may cooperate with lawful requests from the authorities.',
      ],
    },
    {
      id: 'misuse',
      title: 'Responsibility for use',
      body: [
        'You are solely responsible for the voices you create and how you use the converted audio, including in calls and voice notes. We are not responsible for misuse of Loki by you or anyone else.',
        `You agree to cover ${LEGAL_NAME} for claims, losses and costs that arise from your misuse of Loki or your breach of these terms.`,
      ],
    },
    {
      id: 'third-party',
      title: 'Other apps',
      body: [
        'Loki works alongside WhatsApp, Telegram and Shizuku. We are not affiliated with or endorsed by them, and their own terms still apply. Changes to those apps or to Android can affect how Loki works on your phone.',
      ],
    },
    {
      id: 'plans',
      title: 'Free minutes and plans',
      body: [
        `New accounts get ${FREE_MINUTES} free minutes, ${FREE_RULE}. Free minutes can't be moved to another account.`,
        'Packs are one-off purchases. Each pack must be used within its number of days (30 to 90). Buying another pack adds its minutes. Nothing renews automatically.',
        'Payments are processed by our payment provider, whose terms also apply.',
      ],
    },
    {
      id: 'refunds',
      title: 'Refunds',
      body: [
        'Because minutes are available as soon as you pay, purchases are generally non-refundable. We will refund you in full if:',
        {
          list: [
            'you were charged twice or by mistake;',
            'you paid but the plan never reached your account and we cannot fix it;',
            'a fault on our side stopped you using Loki for most of your plan, and you used fewer than 10% of its minutes.',
          ],
        },
        'Ask within 7 days of the payment through the Contact link, with the email on your account and the payment date. Approved refunds go back to the original payment method.',
      ],
    },
    {
      id: 'service',
      title: 'The service',
      body: [
        'We work to keep Loki running smoothly, but it is provided “as is”. We do not guarantee it will be uninterrupted, error-free, or work on every phone. Conversion quality depends on your recording, device and connection.',
        `To the extent the law allows, ${LEGAL_NAME} is not liable for indirect or consequential losses, and our total liability to you is limited to what you paid us in the 3 months before the claim.`,
      ],
    },
    {
      id: 'ending',
      title: 'Ending your account',
      body: [
        'You can delete your account at any time in the app. We may suspend or close accounts that break these terms. Unused paid minutes are not refunded when an account is closed for breaking these terms.',
      ],
    },
    {
      id: 'law',
      title: 'Changes and law',
      body: [
        'We may update these terms; if we make important changes we will tell you in the app or on our channel. Continuing to use Loki means you accept the updated terms.',
        'These terms are governed by the laws of the Federal Republic of Nigeria.',
        contactLine,
      ],
    },
  ],
}

export const SETUP: Doc = {
  path: '/setup',
  chip: 'Setup guide',
  title: 'Set up Loki',
  intro: 'From download to your first converted voice note, then live calls on WhatsApp and Telegram.',
  sections: [
    {
      id: 'phone',
      title: 'Check your phone',
      body: [
        {
          list: [
            'Android 8 or newer for voice conversion and voice notes.',
            'Android 13 or newer for live calls.',
            'An internet connection: conversion happens on our server.',
          ],
        },
      ],
    },
    {
      id: 'install',
      title: 'Install the app',
      body: [
        {
          steps: [
            'Tap Get Loki on this website to download the app.',
            'If Chrome warns that the file might be harmful, tap Download anyway. Loki comes straight from us, outside the Play Store.',
            'Open the downloaded file. If Android asks, allow your browser to Install unknown apps, then go back.',
            'Tap Install, then Open.',
          ],
        },
      ],
    },
    {
      id: 'account',
      title: 'Create your account',
      body: [
        `Sign up with your email or with Google. Your ${FREE_MINUTES} free minutes are added straight away, ${FREE_RULE}.`,
      ],
    },
    {
      id: 'voice',
      title: 'Create a voice',
      body: [
        {
          steps: [
            'Open Voices and tap Create.',
            'Record 45–60 seconds of clear speech in a quiet room, or upload a WAV file (mono, 16 kHz, 16-bit) between 45 and 60 seconds long.',
            'Play it back, then tap Use Recording. Loki tells you when the voice is ready.',
          ],
        },
        { note: 'Only use your own voice, or a voice you have permission to use.' },
      ],
    },
    {
      id: 'convert',
      title: 'Convert your voice',
      body: [
        {
          steps: [
            'On the Convert tab, choose your voice.',
            'Tap the big button and allow the microphone.',
            'Speak: your converted voice plays back in real time. Use it for your WhatsApp and Telegram voice notes.',
            'Tap the button again to stop. Your minutes are counted per session.',
          ],
        },
      ],
    },
    {
      id: 'live-calls',
      title: 'Live calls',
      body: [
        'Live calls use Shizuku, a free app that gives Loki the Android permissions it needs, without root. You do this once.',
        {
          steps: [
            'Install Shizuku from its official site, shizuku.rikka.app.',
            'Turn on Developer options: Settings → About phone → tap Build number 7 times.',
            'In Developer options, turn on Wireless debugging.',
            'Open Shizuku, choose Start via Wireless debugging, and pair using the code it shows.',
            'In Loki, go to Settings → Live calls → Shizuku setup and tap Grant permission, then Allow.',
            'Tap Recheck until it says Ready.',
          ],
        },
        { note: 'After every phone restart, open Shizuku and start it again. Menu names vary slightly between phone brands.' },
      ],
    },
    {
      id: 'floating',
      title: 'Floating button',
      body: [
        'Turn it on in Settings → Quick controls → Floating button. During a session it lets you pause your mic, stop, or open Loki from any app.',
        'On itel, Tecno, Infinix and some other phones, also allow Loki to run in the background (or auto-start) in the phone’s battery settings, or the button may disappear.',
      ],
    },
    {
      id: 'update',
      title: 'Update Loki',
      body: [
        'Download the latest version with Get Loki and install it over the old one. Your account, voices and minutes stay as they are. New releases are announced on our Telegram channel.',
      ],
    },
    {
      id: 'help',
      title: 'Troubleshooting',
      body: [
        {
          list: [
            'Can’t install: allow your browser to install unknown apps (Settings → Apps → your browser).',
            'Live calls not ready: open Settings → Live calls → Shizuku setup in Loki and follow what it says. After a restart, start Shizuku again.',
            'No sound or slow audio: check your internet connection and try again.',
            'Still stuck? Use the Contact link at the bottom of this page.',
          ],
        },
      ],
    },
  ],
}

export const DOCS = [PRIVACY, TERMS, SETUP]

/** The doc for the current URL path, or null for the home page. */
export function docForPath(pathname: string): Doc | null {
  const path = pathname.replace(/\/+$/, '') || '/'
  return DOCS.find((d) => d.path === path) ?? null
}
