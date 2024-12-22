export function parse(input: string) {
  return input.split('\n').map(Number)
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((total, secret) => {
    for (let i = 0; i < 2000; ++i) {
      secret = calculateSecret(secret)
    }
    return total + secret
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  const sequenceMap = new Map<number, number>()
  input.forEach(secret => {
    const processedSequences = new Set<number>()
    const sequence = []
    let prevDigit = secret % 10
    for (let i = 0; i < 2000; ++i) {
      secret = calculateSecret(secret)
      const digit = secret % 10
      if (sequence.length === 4) sequence.shift()
      sequence.push(digit - prevDigit)
      if (sequence.length === 4) {
        const key = getSequenceKey(sequence)
        if (!processedSequences.has(key)) {
          processedSequences.add(key)
          sequenceMap.set(key, (sequenceMap.get(key) ?? 0) + digit)
        }
      }
      prevDigit = digit
    }
  })
  return Math.max(...sequenceMap.values())
}

const calculateSecret = (secret: number) => {
  secret ^= (secret << 6) & 16777215
  secret ^= (secret >> 5) & 16777215
  return secret ^ ((secret << 11) & 16777215)
}

const getSequenceKey = (sequence: number[]) =>
  sequence.reduce((total, value) => total * 100 + value, 0)
