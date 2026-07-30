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
  'draak-vuur': { id: 'draak-vuur', label: 'Draak blaast vuur', emoji: '🐉🔥', description: 'Een draak blaast vuur.' },
  'ninja-ster': { id: 'ninja-ster', label: 'Ninja vangt een ster', emoji: '🥷⭐', description: 'Een ninja vangt een ster.' },
  'arend-boom': { id: 'arend-boom', label: 'Arend in de boom', emoji: '🦅🌳', description: 'Een arend zit in een boom.' },
  'draak-water': { id: 'draak-water', label: 'Draak drinkt water', emoji: '🐉💧', description: 'Een draak drinkt water.' },
  'ninja-pad': { id: 'ninja-pad', label: 'Ninja op het pad', emoji: '🥷🛤️', description: 'Een ninja loopt op een pad.' },
  'maan-ster': { id: 'maan-ster', label: 'Ster bij de maan', emoji: '🌙⭐', description: 'Een ster schijnt bij de maan.' },
  'vuur-grot': { id: 'vuur-grot', label: 'Vuur in de grot', emoji: '🔥🕳️', description: 'Een vuur brandt in de grot.' },
  'draak-schat': { id: 'draak-schat', label: 'Draak bij de schat', emoji: '🐉💰', description: 'Een draak bewaakt een schat.' },
  'ei-nest': { id: 'ei-nest', label: 'Ei in het nest', emoji: '🥚🪺', description: 'Een ei ligt in een nest.' },
  'schat-zwaard': { id: 'schat-zwaard', label: 'Zwaard bij de schat', emoji: '💰⚔️', description: 'Een zwaard ligt bij een schat.' },
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
  { sentence: 'De draak blaast vuur.', highlightWord: 'vuur', correctScene: 'draak-vuur', otherScenes: ['ninja-bos', 'arend-nest'] },
  { sentence: 'De ninja vangt een ster.', highlightWord: 'ster', correctScene: 'ninja-ster', otherScenes: ['draak-maan', 'arend-vis'] },
  { sentence: 'De arend zit in de boom.', highlightWord: 'boom', correctScene: 'arend-boom', otherScenes: ['ninja-deur', 'draak-rots'] },
  { sentence: 'De draak drinkt water.', highlightWord: 'water', correctScene: 'draak-water', otherScenes: ['schat-grot', 'ninja-pad'] },
  { sentence: 'De ninja loopt op het pad.', highlightWord: 'pad', correctScene: 'ninja-pad', otherScenes: ['draak-zwaard', 'arend-berg'] },
  { sentence: 'De maan schijnt naast een ster.', highlightWord: 'ster', correctScene: 'maan-ster', otherScenes: ['ei-grot', 'ninja-ster'] },
  { sentence: 'Er brandt vuur in de grot.', highlightWord: 'vuur', correctScene: 'vuur-grot', otherScenes: ['draak-vuur', 'arend-boom'] },
  { sentence: 'De draak bewaakt de schat.', highlightWord: 'schat', correctScene: 'draak-schat', otherScenes: ['schat-grot', 'ninja-deur'] },
  { sentence: 'Het ei ligt in het nest.', highlightWord: 'nest', correctScene: 'ei-nest', otherScenes: ['arend-nest', 'draak-water'] },
  { sentence: 'Het zwaard ligt bij de schat.', highlightWord: 'zwaard', correctScene: 'schat-zwaard', otherScenes: ['draak-zwaard', 'ninja-ster'] },
  { sentence: 'De draak rust op de rots.', highlightWord: 'rots', correctScene: 'draak-rots', otherScenes: ['ninja-pad', 'arend-boom'] },
  { sentence: 'De arend zoekt haar nest.', highlightWord: 'nest', correctScene: 'arend-nest', otherScenes: ['draak-schat', 'ei-nest'] },
  { sentence: 'De ninja schuilt in het bos.', highlightWord: 'bos', correctScene: 'ninja-bos', otherScenes: ['draak-vuur', 'maan-ster'] },
  { sentence: 'De schat blinkt in de grot.', highlightWord: 'schat', correctScene: 'schat-grot', otherScenes: ['ei-nest', 'ninja-pad'] },
  { sentence: 'De draak staart naar de maan.', highlightWord: 'maan', correctScene: 'draak-maan', otherScenes: ['schat-zwaard', 'arend-boom'] },
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
