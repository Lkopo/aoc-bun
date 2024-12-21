import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './21'

const { default: example } = await import('./example.txt')

describe('Day 21', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(126384)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(154115708116294)
    })
  })
})
