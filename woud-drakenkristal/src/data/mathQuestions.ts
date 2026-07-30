import type { Question } from '../types'

/** Two plausible wrong answers near the correct one, clamped to the 0-10 range used everywhere. */
function pickDecoys(correct: number): [number, number] {
  const candidates = [correct - 1, correct + 1, correct - 2, correct + 2].filter((n) => n >= 0 && n <= 10)
  return [candidates[0], candidates[1]]
}

function makeOptions(correct: number): Question['options'] {
  const values = [correct, ...pickDecoys(correct)]
  return values.map((value) => ({ id: `v${value}`, label: String(value), visualCount: value }))
}

interface MathTemplate {
  a: number
  b: number
  operator: '+' | '-'
}

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

/**
 * Every addition fact a+b<=10 and every subtraction fact a-b (with a<=10,
 * b<a) using positive operands - the full first-grade fact family, not a
 * hand-picked sample. That gives a large enough pool (~90 questions) that a
 * 5-question session rarely looks the same twice.
 */
function generateTemplates(): MathTemplate[] {
  const templates: MathTemplate[] = []
  for (let a = 1; a <= 9; a++) {
    for (let b = 1; a + b <= 10; b++) {
      templates.push({ a, b, operator: '+' })
    }
  }
  for (let a = 2; a <= 10; a++) {
    for (let b = 1; b < a; b++) {
      templates.push({ a, b, operator: '-' })
    }
  }
  return templates
}

export const MATH_QUESTIONS: Question[] = generateTemplates().map((template, index) => {
  const correct = template.operator === '+' ? template.a + template.b : template.a - template.b
  const { instruction, spoken } = buildInstruction(template.a, template.b, template.operator)
  return {
    id: `math-${index + 1}`,
    category: 'math',
    instruction,
    spokenInstruction: spoken,
    options: makeOptions(correct),
    correctAnswerId: `v${correct}`,
    hint: `Laten we samen tellen tot ${correct}.`,
    difficulty: 1,
    visualNumber: template.a,
    operator: template.operator,
    operands: [template.a, template.b],
  }
})
