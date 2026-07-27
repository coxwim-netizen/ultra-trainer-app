import type { Question } from '../types'

function makeOptions(correct: number, near: number[]): Question['options'] {
  const values = Array.from(new Set([correct, ...near])).slice(0, 3)
  while (values.length < 3) {
    const extra = values[values.length - 1] + 1
    if (!values.includes(extra) && extra <= 10) values.push(extra)
  }
  return values
    .sort(() => 0.5 - Math.random())
    .map((value) => ({ id: `v${value}`, label: String(value), visualCount: value }))
}

interface MathTemplate {
  a: number
  b: number
  operator: '+' | '-'
  decoys: number[]
}

const TEMPLATES: MathTemplate[] = [
  { a: 2, b: 3, operator: '+', decoys: [4, 6] },
  { a: 4, b: 1, operator: '+', decoys: [4, 6] },
  { a: 6, b: 2, operator: '-', decoys: [3, 5] },
  { a: 8, b: 3, operator: '-', decoys: [4, 6] },
  { a: 5, b: 4, operator: '+', decoys: [8, 10] },
  { a: 1, b: 3, operator: '+', decoys: [3, 5] },
  { a: 3, b: 3, operator: '+', decoys: [5, 7] },
  { a: 7, b: 4, operator: '-', decoys: [2, 4] },
  { a: 9, b: 2, operator: '-', decoys: [6, 8] },
  { a: 2, b: 2, operator: '+', decoys: [3, 5] },
  { a: 6, b: 3, operator: '+', decoys: [8, 10] },
  { a: 10, b: 4, operator: '-', decoys: [5, 7] },
  { a: 4, b: 4, operator: '+', decoys: [7, 9] },
  { a: 3, b: 5, operator: '+', decoys: [7, 9] },
  { a: 9, b: 5, operator: '-', decoys: [3, 5] },
]

function buildInstruction(a: number, b: number, operator: '+' | '-'): { instruction: string; spoken: string } {
  if (operator === '+') {
    return {
      instruction: `Vonk heeft ${a} kristallen. Hij vindt er ${b} bij. Hoeveel heeft hij nu?`,
      spoken: `Vonk heeft ${a} kristallen. Hij vindt er ${b} bij. Hoeveel kristallen heeft hij nu?`,
    }
  }
  return {
    instruction: `Vonk heeft ${a} kristallen. Hij geeft er ${b} weg. Hoeveel blijven er over?`,
    spoken: `Vonk heeft ${a} kristallen. Hij geeft er ${b} weg. Hoeveel kristallen blijven er over?`,
  }
}

export const MATH_QUESTIONS: Question[] = TEMPLATES.map((template, index) => {
  const correct = template.operator === '+' ? template.a + template.b : template.a - template.b
  const { instruction, spoken } = buildInstruction(template.a, template.b, template.operator)
  const options = makeOptions(correct, template.decoys)
  return {
    id: `math-${index + 1}`,
    category: 'math',
    instruction,
    spokenInstruction: spoken,
    options,
    correctAnswerId: `v${correct}`,
    hint: `Laten we samen tellen tot ${correct}.`,
    difficulty: 1,
    visualNumber: template.a,
    operator: template.operator,
    operands: [template.a, template.b],
  }
})
