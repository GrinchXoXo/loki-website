import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

const RM_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeRM,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  )
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(RM_QUERY).matches
}

/** Fires once when the element scrolls into view. */
export function useInView<T extends Element = HTMLDivElement>(
  options: { amount?: number; margin?: string; once?: boolean } = {},
) {
  const { amount = 0.2, margin = '0px 0px -8% 0px', once = true } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        } else if (entry.boundingClientRect.bottom < 0) {
          // already scrolled past (e.g. anchor jump) — show it
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: amount, rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount, margin, once])

  return [ref, inView] as const
}

/** Is the element currently on screen? (used to pause loops off-screen) */
export function useOnScreen<T extends Element = HTMLDivElement>() {
  return useInView<T>({ amount: 0, margin: '100px 0px 100px 0px', once: false })
}

/** requestAnimationFrame loop that only runs while `active`. */
export function useRaf(cb: (t: number, dt: number) => void, active = true) {
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    if (!active) return
    let id = 0
    let last = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(t - last, 64)
      last = t
      cbRef.current(t, dt)
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [active])
}

export function useInterval(cb: () => void, ms: number | null) {
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    if (ms == null) return
    const id = window.setInterval(() => cbRef.current(), ms)
    return () => window.clearInterval(id)
  }, [ms])
}

export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Tween a number from 0 → target once `start` flips true. */
export function useCountUp(target: number, start: boolean, duration = 1400, delay = 0) {
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!start) return
    if (reduced) {
      setValue(target)
      return
    }
    let id = 0
    const t0 = performance.now() + delay
    const tick = (t: number) => {
      const p = Math.min(Math.max((t - t0) / duration, 0), 1)
      setValue(target * easeOutExpo(p))
      if (p < 1) id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [start, target, duration, delay, reduced])
  return value
}

const GLYPHS = '#%&*+=<>/\\[]{}?!$01'

/** Decode-style text scramble: resolves left → right. */
export function useScramble(text: string, start: boolean, duration = 700, delay = 0) {
  const reduced = useReducedMotion()
  const [out, setOut] = useState(() => (prefersReducedMotion() ? text : text.replace(/\S/g, '#')))

  useEffect(() => {
    if (!start) return
    if (reduced) {
      setOut(text)
      return
    }
    let id = 0
    const t0 = performance.now() + delay
    let lastSwap = 0
    const tick = (t: number) => {
      const p = Math.min(Math.max((t - t0) / duration, 0), 1)
      if (t - lastSwap > 40 || p === 1) {
        lastSwap = t
        const resolved = Math.floor(p * text.length)
        let s = ''
        for (let i = 0; i < text.length; i++) {
          const c = text[i]
          if (i < resolved || c === ' ') s += c
          else s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
        setOut(s)
      }
      if (p < 1) id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [text, start, duration, delay, reduced])

  return out
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Element width via ResizeObserver. */
export function useWidth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

/** Deterministic PRNG so pixel art is stable between renders. */
export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
