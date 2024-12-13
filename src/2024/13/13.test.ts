import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './13'

const { default: example } = await import('./example.txt')

describe('Day 13', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(480)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(875318608908)
    })
  })
})
