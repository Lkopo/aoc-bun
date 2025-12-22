import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './11'

const { default: example } = await import('./example.txt')
const { default: example2 } = await import('./example2.txt')

describe('Day 11', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(5)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example2))).toBe(2)
    })
  })
})
