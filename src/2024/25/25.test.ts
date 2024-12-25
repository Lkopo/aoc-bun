import { describe, expect, test } from 'bun:test'
import { parse, partOne } from './25'

const { default: example } = await import('./example.txt')

describe('Day 25', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(3)
    })
  })
})
