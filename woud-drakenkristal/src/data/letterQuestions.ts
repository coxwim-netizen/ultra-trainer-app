import type { Question } from '../types'

export interface WordEntry {
  word: string
  emoji: string
  firstLetter: string
}

export const WORD_BANK: Record<string, WordEntry> = {
  draak: { word: 'draak', emoji: '🐉', firstLetter: 'D' },
  arend: { word: 'arend', emoji: '🦅', firstLetter: 'A' },
  ninja: { word: 'ninja', emoji: '🥷', firstLetter: 'N' },
  maan: { word: 'maan', emoji: '🌙', firstLetter: 'M' },
  vuur: { word: 'vuur', emoji: '🔥', firstLetter: 'V' },
  bos: { word: 'bos', emoji: '🌳', firstLetter: 'B' },
  grot: { word: 'grot', emoji: '🕳️', firstLetter: 'G' },
  zwaard: { word: 'zwaard', emoji: '⚔️', firstLetter: 'Z' },
  ei: { word: 'ei', emoji: '🥚', firstLetter: 'E' },
  schat: { word: 'schat', emoji: '💰', firstLetter: 'S' },
  berg: { word: 'berg', emoji: '🏔️', firstLetter: 'B' },
  poort: { word: 'poort', emoji: '⛩️', firstLetter: 'P' },
  ster: { word: 'ster', emoji: '⭐', firstLetter: 'S' },
  vis: { word: 'vis', emoji: '🐟', firstLetter: 'V' },
  nest: { word: 'nest', emoji: '🪺', firstLetter: 'N' },
}

const WORD_KEYS = Object.keys(WORD_BANK)
const DISTINCT_LETTERS = Array.from(new Set(WORD_KEYS.map((key) => WORD_BANK[key].firstLetter)))

/** Two other letters from the bank, deterministically chosen, never the correct one. */
function decoyLettersFor(correctLetter: string): [string, string] {
  const others = DISTINCT_LETTERS.filter((letter) => letter !== correctLetter)
  const start = DISTINCT_LETTERS.indexOf(correctLetter)
  return [others[start % others.length], others[(start + 1) % others.length]]
}

/** Two other words from the bank, deterministically chosen, never the word itself. */
function decoyWordsFor(word: string): [string, string] {
  const others = WORD_KEYS.filter((key) => key !== word)
  const start = WORD_KEYS.indexOf(word)
  return [others[start % others.length], others[(start + 1) % others.length]]
}

/**
 * One "which letter" and one "which word" question per entry in the bank, so
 * growing WORD_BANK automatically grows the question pool - no separate list
 * of hand-picked combinations to keep in sync.
 */
export const LETTER_QUESTIONS: Question[] = WORD_KEYS.flatMap((word, index) => {
  const entry = WORD_BANK[word]
  const [decoyLetterA, decoyLetterB] = decoyLettersFor(entry.firstLetter)
  const letterQuestion: Question = {
    id: `letters-letter-${index + 1}`,
    category: 'letters',
    instruction: `Met welke letter begint ${entry.word}?`,
    spokenInstruction: `Met welke letter begint het woord ${entry.word}?`,
    options: [entry.firstLetter, decoyLetterA, decoyLetterB].map((letter) => ({
      id: `letter-${letter}`,
      label: letter,
    })),
    correctAnswerId: `letter-${entry.firstLetter}`,
    hint: `${entry.word} begint met de klank "${entry.firstLetter.toLowerCase()}...". Luister goed: ${entry.word}.`,
    difficulty: 1,
    subject: entry.emoji,
  }

  const [decoyWordA, decoyWordB] = decoyWordsFor(word)
  const wordQuestion: Question = {
    id: `letters-word-${index + 1}`,
    category: 'letters',
    instruction: 'Welk woord past bij dit plaatje?',
    spokenInstruction: 'Welk woord past bij dit plaatje?',
    options: [word, decoyWordA, decoyWordB].map((wordKey) => ({
      id: `word-${wordKey}`,
      label: WORD_BANK[wordKey].word,
    })),
    correctAnswerId: `word-${word}`,
    hint: `Dit is een ${entry.word}. Zoek het woord "${entry.word}".`,
    difficulty: 1,
    subject: entry.emoji,
  }

  return [letterQuestion, wordQuestion]
})
