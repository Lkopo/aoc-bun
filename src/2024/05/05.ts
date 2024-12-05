export function parse(input: string) {
  const splitInput = input.split('\n\n')
  const rules = splitInput[0]!.split('\n').reduce(
    (rules, rule) => {
      const [before, after] = rule.split('|').map(Number) as [number, number]
      ;(rules[before!] ??= []).push(after!)
      return rules
    },
    {} as Record<number, number[]>
  )
  const updates = splitInput[1]!
    .split('\n')
    .map(line => line.split(',').map(Number))
  return { rules, updates }
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.updates.reduce((total, updatePages) => {
    return arePagesValid(input.rules, updatePages)
      ? total + middlePage(updatePages)
      : total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.updates
    .filter(pages => !arePagesValid(input.rules, pages))
    .reduce((total, updatePages) => {
      const sortedPages = updatePages.sort((a, b) =>
        arePagesValid(input.rules, [a, b]) ? -1 : 1
      )
      return total + middlePage(sortedPages)
    }, 0)
}

const middlePage = (pages: number[]): number =>
  pages[Math.floor(pages.length / 2)]!

function arePagesValid(
  rules: Record<number, number[]>,
  updatePages: number[]
): boolean {
  return updatePages.every(
    (page, idx) =>
      idx === 0 ||
      !rules[page]?.some(prevPage =>
        updatePages.slice(0, idx).includes(prevPage)
      )
  )
}
