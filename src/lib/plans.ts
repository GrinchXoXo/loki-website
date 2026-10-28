export const FREE_MINUTES = 10
export const FREE_RULE = 'once per phone'

export const PLANS: Array<{ id: string; name: string; minutes: number; price: number; days: number; badge?: string }> = [
  { id: 'starter', name: 'Starter', minutes: 60, price: 15000, days: 30 },
  { id: 'plus', name: 'Plus', minutes: 180, price: 40000, days: 45, badge: 'Best value' },
  { id: 'pro', name: 'Pro', minutes: 360, price: 70000, days: 60 },
  { id: 'max', name: 'Max', minutes: 720, price: 120000, days: 90 },
]

export const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

export const formatHours = (minutes: number) => {
  const hours = minutes / 60
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
}
