import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './05'

const { default: example } = await import('./example.txt')

describe('Day 5', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(143)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(123)
    })
  })
})
