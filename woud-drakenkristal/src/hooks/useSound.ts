import { useCallback, useRef } from 'react'
import { useGame } from '../state/GameContext'

type ToneStep = { freq: number; duration: number; delay: number }

function playTones(context: AudioContext, steps: ToneStep[]) {
  const now = context.currentTime
  steps.forEach(({ freq, duration, delay }) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = freq
    gain.gain.setValueAtTime(0, now + delay)
    gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now + delay)
    oscillator.stop(now + delay + duration + 0.05)
  })
}

export function useSound() {
  const { progress } = useGame()
  const contextRef = useRef<AudioContext | null>(null)

  const getContext = useCallback((): AudioContext | null => {
    if (!progress.soundOn) return null
    if (typeof window === 'undefined') return null
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null
    if (!contextRef.current) contextRef.current = new AudioContextClass()
    if (contextRef.current.state === 'suspended') void contextRef.current.resume()
    return contextRef.current
  }, [progress.soundOn])

  const playTap = useCallback(() => {
    const context = getContext()
    if (context) playTones(context, [{ freq: 420, duration: 0.08, delay: 0 }])
  }, [getContext])

  const playSuccess = useCallback(() => {
    const context = getContext()
    if (context) {
      playTones(context, [
        { freq: 523.25, duration: 0.15, delay: 0 },
        { freq: 659.25, duration: 0.15, delay: 0.12 },
        { freq: 783.99, duration: 0.2, delay: 0.24 },
      ])
    }
  }, [getContext])

  const playGentleRetry = useCallback(() => {
    const context = getContext()
    if (context) playTones(context, [{ freq: 300, duration: 0.18, delay: 0 }])
  }, [getContext])

  const playCelebrate = useCallback(() => {
    const context = getContext()
    if (context) {
      playTones(context, [
        { freq: 392, duration: 0.15, delay: 0 },
        { freq: 523.25, duration: 0.15, delay: 0.12 },
        { freq: 659.25, duration: 0.15, delay: 0.24 },
        { freq: 783.99, duration: 0.3, delay: 0.36 },
        { freq: 1046.5, duration: 0.35, delay: 0.5 },
      ])
    }
  }, [getContext])

  return { playTap, playSuccess, playGentleRetry, playCelebrate }
}
