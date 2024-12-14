import { Range } from '@/utils'

export function parse(input: string) {
  return input.split('').reduce(
    (disk, char, idx) => {
      const length = parseInt(char)
      if (length === 0) return disk
      const rangeStart = disk.breakdown.length
      const rangeEnd = rangeStart + length - 1
      if (idx % 2 === 0) {
        const id = Math.floor(idx / 2)
        disk.blocksRanges.push([rangeStart, rangeEnd])
        for (let i = 0; i < length; ++i) {
          const length = disk.breakdown.push(id.toString())
          disk.blocks.push(length - 1)
        }
      } else {
        disk.gapsRanges.push([rangeStart, rangeEnd])
        for (let i = 0; i < length; ++i) {
          const length = disk.breakdown.push('.')
          disk.gaps.push(length - 1)
        }
      }
      return disk
    },
    {
      breakdown: [] as string[],
      gaps: [] as number[],
      gapsRanges: [] as Range[],
      blocks: [] as number[],
      blocksRanges: [] as Range[]
    }
  )
}

export function partOne(input: ReturnType<typeof parse>) {
  while (input.gaps.length) {
    const gapIdx = input.gaps.shift()!
    const blockIdx = input.blocks.pop()!
    if (blockIdx < gapIdx) break
    input.breakdown[gapIdx] = input.breakdown[blockIdx]!
    input.breakdown[blockIdx] = '.'
  }
  return input.breakdown.reduce(
    (total, char, idx) => total + (char === '.' ? 0 : parseInt(char) * idx),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  for (const [id, block] of [...input.blocksRanges.entries()].reverse()) {
    const blockSize = block[1] - block[0]
    const gapIdx = input.gapsRanges.findIndex(
      gap => blockSize <= gap[1] - gap[0]
    )
    const gap = input.gapsRanges[gapIdx]
    if (gap === undefined || gap[0] > block[0]) continue
    for (let i = 0; i < blockSize + 1; ++i) {
      input.breakdown[gap[0] + i] = id.toString()
      input.breakdown[block[0] + i] = '.'
    }
    if (blockSize === gap[1] - gap[0]) {
      input.gapsRanges.splice(gapIdx, 1)
    } else {
      gap[0] += blockSize + 1
    }
  }
  return input.breakdown.reduce(
    (total, char, idx) => total + (char === '.' ? 0 : Number(char) * idx),
    0
  )
}
