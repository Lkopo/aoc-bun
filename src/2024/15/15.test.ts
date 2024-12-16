import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './15'

const { default: example } = await import('./example.txt')

describe('Day 15', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(10092)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(9021)
    })
  })
})
