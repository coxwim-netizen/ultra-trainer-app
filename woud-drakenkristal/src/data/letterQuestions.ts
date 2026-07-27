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
}

interface LetterTemplate {
  type: 'letter'
  word: keyof typeof WORD_BANK
  decoyLetters: [string, string]
}

interface WordTemplate {
  type: 'word'
  word: keyof typeof WORD_BANK
  decoyWords: [keyof typeof WORD_BANK, keyof typeof WORD_BANK]
}

const TEMPLATES: (LetterTemplate | WordTemplate)[] = [
  { type: 'letter', word: 'draak', decoyLetters: ['B', 'K'] },
  { type: 'letter', word: 'arend', decoyLetters: ['N', 'V'] },
  { type: 'letter', word: 'ninja', decoyLetters: ['M', 'G'] },
  { type: 'letter', word: 'maan', decoyLetters: ['Z', 'S'] },
  { type: 'letter', word: 'vuur', decoyLetters: ['G', 'E'] },
  { type: 'word', word: 'draak', decoyWords: ['maan', 'bos'] },
  { type: 'word', word: 'bos', decoyWords: ['grot', 'ei'] },
  { type: 'word', word: 'grot', decoyWords: ['zwaard', 'schat'] },
  { type: 'word', word: 'zwaard', decoyWords: ['ei', 'ninja'] },
  { type: 'word', word: 'schat', decoyWords: ['arend', 'vuur'] },
]

export const LETTER_QUESTIONS: Question[] = TEMPLATES.map((template, index) => {
  const entry = WORD_BANK[template.word]
  if (template.type === 'letter') {
    const letters = [entry.firstLetter, ...template.decoyLetters]
    return {
      id: `letters-${index + 1}`,
      category: 'letters',
      instruction: `Met welke letter begint ${entry.word}?`,
      spokenInstruction: `Met welke letter begint het woord ${entry.word}?`,
      options: letters.map((letter) => ({ id: `letter-${letter}`, label: letter })),
      correctAnswerId: `letter-${entry.firstLetter}`,
      hint: `${entry.word} begint met de klank "${entry.firstLetter.toLowerCase()}...". Luister goed: ${entry.word}.`,
      difficulty: 1,
      subject: entry.emoji,
    } satisfies Question
  }
  const words = [template.word, ...template.decoyWords]
  return {
    id: `letters-${index + 1}`,
    category: 'letters',
    instruction: 'Welk woord past bij dit plaatje?',
    spokenInstruction: 'Welk woord past bij dit plaatje?',
    options: words.map((wordKey) => ({ id: `word-${wordKey}`, label: WORD_BANK[wordKey].word })),
    correctAnswerId: `word-${template.word}`,
    hint: `Dit is een ${entry.word}. Zoek het woord "${entry.word}".`,
    difficulty: 1,
    subject: entry.emoji,
  } satisfies Question
})
