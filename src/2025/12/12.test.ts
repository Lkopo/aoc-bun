import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './12'

const { default: example } = await import('./example.txt')

describe('Day 12', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(2)
    })
  })
})
