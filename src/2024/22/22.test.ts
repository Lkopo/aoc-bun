import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './22'

const { default: example } = await import('./example.txt')

describe('Day 22', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(37327623)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(0)
    })
  })
})
