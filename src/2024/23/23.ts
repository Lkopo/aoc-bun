export function parse(input: string) {
  return input.split('\n').reduce((map, pair) => {
    const [left, right] = pair.split('-')
    map.set(left!, (map.get(left!) ?? new Set<string>()).add(right!))
    map.set(right!, (map.get(right!) ?? new Set<string>()).add(left!))
    return map
  }, new Map<string, Set<string>>())
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.entries().reduce((total, [pc, connectedPcs]) => {
    const pcsToCheck = [...connectedPcs].sort().filter(cpc => cpc > pc)
    while (pcsToCheck.length > 1) {
      const pcToCheck = pcsToCheck.shift()!
      for (const candidate of pcsToCheck) {
        if (
          input.get(pcToCheck)!.has(candidate) &&
          (pc.startsWith('t') ||
            pcToCheck.startsWith('t') ||
            candidate.startsWith('t'))
        ) {
          total += 1
        }
      }
    }
    return total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.entries().reduce(
    (winner, [pc, connectedPcs]) => {
      const pcsToCheck = [...connectedPcs].sort().filter(cpc => cpc > pc)
      while (pcsToCheck.length > 1) {
        const pcToCheck = pcsToCheck.shift()!
        const interconnected = new Set([pcToCheck])
        for (const candidate of pcsToCheck) {
          if (
            [...interconnected].every(interPc =>
              input.get(interPc)!.has(candidate)
            )
          ) {
            interconnected.add(candidate)
          }
        }
        if (interconnected.size > winner.max) {
          winner.max = interconnected.size
          winner.password = [pc, ...interconnected].join(',')
        }
      }
      return winner
    },
    { max: 0, password: '' }
  ).password
}
