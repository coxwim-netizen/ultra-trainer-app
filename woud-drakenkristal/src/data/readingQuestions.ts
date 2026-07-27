import type { Question } from '../types'

export interface ReadingScene {
  id: string
  label: string
  emoji: string
  description: string
}

export const READING_SCENES: Record<string, ReadingScene> = {
  'draak-rots': { id: 'draak-rots', label: 'Draak op de rots', emoji: '🐉🪨', description: 'Een draak zit op een grote rots.' },
  'arend-nest': { id: 'arend-nest', label: 'Arend naar het nest', emoji: '🦅🪺', description: 'Een arend vliegt naar zijn nest.' },
  'ninja-bos': { id: 'ninja-bos', label: 'Ninja in het bos', emoji: '🥷🌳', description: 'Een ninja loopt tussen de bomen.' },
  'ei-grot': { id: 'ei-grot', label: 'Ei in de grot', emoji: '🥚🕳️', description: 'Een ei ligt in een donkere grot.' },
  'draak-maan': { id: 'draak-maan', label: 'Draak ziet de maan', emoji: '🐉🌙', description: 'Een draak kijkt naar de maan.' },
  'arend-vis': { id: 'arend-vis', label: 'Arend met een vis', emoji: '🦅🐟', description: 'Een arend heeft een vis gevonden.' },
  'ninja-deur': { id: 'ninja-deur', label: 'Ninja opent de deur', emoji: '🥷🚪', description: 'Een ninja opent een geheime deur.' },
  'draak-zwaard': { id: 'draak-zwaard', label: 'Draak met zwaard', emoji: '🐉⚔️', description: 'Een draak bewaakt een zwaard.' },
  'arend-berg': { id: 'arend-berg', label: 'Arend boven de berg', emoji: '🦅⛰️', description: 'Een arend vliegt boven de berg.' },
  'schat-grot': { id: 'schat-grot', label: 'Schat in de grot', emoji: '💰🕳️', description: 'Een schat ligt verstopt in de grot.' },
}

interface ReadingTemplate {
  sentence: string
  highlightWord: string
  correctScene: string
  otherScenes: [string, string]
}

const TEMPLATES: ReadingTemplate[] = [
  { sentence: 'De draak zit op de rots.', highlightWord: 'rots', correctScene: 'draak-rots', otherScenes: ['arend-nest', 'ninja-bos'] },
  { sentence: 'De arend vliegt naar het nest.', highlightWord: 'nest', correctScene: 'arend-nest', otherScenes: ['draak-maan', 'ninja-deur'] },
  { sentence: 'De ninja loopt in het bos.', highlightWord: 'bos', correctScene: 'ninja-bos', otherScenes: ['draak-rots', 'arend-vis'] },
  { sentence: 'Het ei ligt in de grot.', highlightWord: 'ei', correctScene: 'ei-grot', otherScenes: ['schat-grot', 'draak-zwaard'] },
  { sentence: 'De draak ziet de maan.', highlightWord: 'maan', correctScene: 'draak-maan', otherScenes: ['arend-berg', 'ninja-bos'] },
  { sentence: 'De arend vindt een vis.', highlightWord: 'vis', correctScene: 'arend-vis', otherScenes: ['draak-rots', 'ninja-deur'] },
  { sentence: 'De ninja opent de deur.', highlightWord: 'deur', correctScene: 'ninja-deur', otherScenes: ['arend-nest', 'draak-zwaard'] },
  { sentence: 'De draak bewaakt het zwaard.', highlightWord: 'zwaard', correctScene: 'draak-zwaard', otherScenes: ['schat-grot', 'arend-berg'] },
  { sentence: 'De arend vliegt boven de berg.', highlightWord: 'berg', correctScene: 'arend-berg', otherScenes: ['draak-maan', 'ei-grot'] },
  { sentence: 'De schat ligt in de grot.', highlightWord: 'schat', correctScene: 'schat-grot', otherScenes: ['ei-grot', 'ninja-bos'] },
]

export const READING_QUESTIONS: Question[] = TEMPLATES.map((template, index) => {
  const scenes = [template.correctScene, ...template.otherScenes]
  return {
    id: `reading-${index + 1}`,
    category: 'reading',
    instruction: template.sentence,
    spokenInstruction: template.sentence,
    options: scenes.map((sceneId) => ({
      id: sceneId,
      label: READING_SCENES[sceneId].label,
    })),
    correctAnswerId: template.correctScene,
    hint: `Luister naar het woord "${template.highlightWord}".`,
    difficulty: 1,
    highlightWord: template.highlightWord,
  }
})
