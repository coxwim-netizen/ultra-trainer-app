import { useEffect, useRef } from 'react'
import { useSpeech } from '../../hooks/useSpeech'

interface AudioButtonProps {
  text: string
  autoPlay?: boolean
  label?: string
}

export function AudioButton({ text, autoPlay = false, label = 'Luister' }: AudioButtonProps) {
  const { speak, isSpeaking, isSupported } = useSpeech()
  const hasAutoPlayed = useRef(false)

  useEffect(() => {
    hasAutoPlayed.current = false
  }, [text])

  useEffect(() => {
    if (autoPlay && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      speak(text)
    }
  }, [autoPlay, text, speak])

  return (
    <button
      type="button"
      className={`btn btn-round btn-secondary ${isSpeaking ? 'idle-flicker' : ''}`}
      onClick={() => speak(text)}
      aria-label={isSupported ? `${label}: ${text}` : 'Geluid niet beschikbaar op dit apparaat'}
      disabled={!isSupported}
      title={label}
    >
      <span aria-hidden="true">{isSpeaking ? '🔊' : '🔈'}</span>
    </button>
  )
}
