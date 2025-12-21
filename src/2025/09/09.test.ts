import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './09'

const { default: example } = await import('./example.txt')

describe('Day 9', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(50)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(24)
    })
  })
})
