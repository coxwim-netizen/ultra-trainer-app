import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSpeechResult {
  isSupported: boolean
  isSpeaking: boolean
  speak: (text: string) => void
  stop: () => void
}

function pickDutchVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith('nl-be')) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('nl')) ??
    undefined
  )
}

export function useSpeech(): UseSpeechResult {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined)

  useEffect(() => {
    if (!isSupported) return
    const updateVoice = () => {
      voiceRef.current = pickDutchVoice()
    }
    updateVoice()
    window.speechSynthesis.addEventListener('voiceschanged', updateVoice)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoice)
  }, [isSupported])

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'nl-BE'
      if (voiceRef.current) utterance.voice = voiceRef.current
      utterance.rate = 0.9
      utterance.pitch = 1.05
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    },
    [isSupported],
  )

  useEffect(() => stop, [stop])

  return { isSupported, isSpeaking, speak, stop }
}
