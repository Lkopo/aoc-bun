import Queue from '@/queue'
import { execFileSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export function parse(input: string) {
  return input.split('\n').map(line => {
    const [, lightsSchema, buttonsSchemas, joltagesSchema] = line.match(
      /\[(.*)\] (.*) \{(.*)\}/
    )!
    const desiredLights = parseInt(
      lightsSchema!.replaceAll('.', '0').replaceAll('#', '1'),
      2
    )
    const buttons = buttonsSchemas!
      .split(' ')
      .map(buttonsSchema =>
        buttonsSchema.replaceAll(/\(|\)/g, '').split(',').map(Number)
      )
    const buttonMasks = buttons.map(toMask(lightsSchema!.length))
    const desiredJoltages = joltagesSchema!.split(',').map(Number)
    return { desiredLights, buttonMasks, desiredJoltages, buttons }
  })
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce(
    (total, { desiredLights, buttonMasks }) =>
      total + getMinLightPresses(desiredLights, buttonMasks),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>, simple = false) {
  return input.reduce(
    (total, { desiredJoltages, buttons }) =>
      total +
      (simple
        ? getMinJoltagePresses(desiredJoltages, buttons)
        : solveLP(toLP(desiredJoltages, buttons))),
    0
  )
}

const toMask = (len: number) => (indices: number[]) =>
  indices.reduce((mask, idx) => mask | (1 << (len - 1 - idx)), 0)

const getMinLightPresses = (
  desiredLights: number,
  buttonMasks: number[]
): number => {
  const queue = new Queue<{ lights: number; presses: number }>()
  const visited = new Set<number>()
  queue.enqueue({ lights: 0, presses: 0 })
  visited.add(0)
  while (!queue.isEmpty()) {
    const { lights, presses } = queue.dequeue()!
    for (const mask of buttonMasks) {
      const next = lights ^ mask
      if (visited.has(next)) continue
      if (next === desiredLights) return presses + 1
      visited.add(next)
      queue.enqueue({ lights: next, presses: presses + 1 })
    }
  }
  return Infinity
}

const getMinJoltagePresses = (
  desiredJoltages: number[],
  buttons: number[][]
): number => {
  const desiredJoltagesKey = desiredJoltages.join(',')
  const queue = new Queue<{ joltages: number[]; presses: number }>()
  const visited = new Set<string>()
  const joltages = new Array(desiredJoltages.length).fill(0)
  queue.enqueue({ joltages, presses: 0 })
  visited.add(joltages.join(','))
  while (!queue.isEmpty()) {
    const { joltages, presses } = queue.dequeue()!
    buttonLoop: for (const button of buttons) {
      const next = joltages.slice()
      for (const buttonIdx of button) {
        if (++next[buttonIdx]! > desiredJoltages[buttonIdx]!)
          continue buttonLoop
      }
      const key = next.join(',')
      if (visited.has(key)) continue
      if (key === desiredJoltagesKey) return presses + 1
      visited.add(key)
      queue.enqueue({ joltages: next, presses: presses + 1 })
    }
  }
  return Infinity
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const toLP = (desiredJoltages: number[], buttons: number[][]) => {
  const cols = Array.from({ length: buttons.length }, (_, i) => `x${i}`)
  const lines: string[] = []
  lines.push('Minimize')
  lines.push(' obj: ' + cols.join(' + '))
  lines.push('Subject To')
  for (let k = 0; k < desiredJoltages.length; k++) {
    const terms: string[] = []
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i]!.includes(k)) terms.push(`1 ${cols[i]}`)
    }
    lines.push(` c${k}: ${terms.join(' + ')} = ${desiredJoltages[k]}`)
  }
  lines.push('Bounds')
  for (let i = 0; i < buttons.length; i++) lines.push(` 0 <= ${cols[i]}`)
  lines.push('General')
  lines.push(' ' + cols.join(' '))
  lines.push('End')
  return lines.join('\n')
}

// CBC required - brew install cbc
const solveLP = (lp: string): number => {
  const modelPath = join(__dirname, 'model.lp')
  const solutionPath = join(__dirname, 'solution.txt')
  writeFileSync(modelPath, lp)
  execFileSync('cbc', [modelPath, 'solve', 'solu', solutionPath], {
    stdio: 'ignore'
  })
  const solution = readFileSync(solutionPath, 'utf8')
  const result = solution.match(/objective value\s+([0-9]+)/)
  if (!result) throw new Error('No solution')
  return Number(result[1])
}
