import Queue from '@/queue'

export function parse(input: string) {
  const [wiresSetup, gatesSetup] = input.split('\n\n')
  const wireMap = wiresSetup!.split('\n').reduce((wireMap, line) => {
    const [wire, value] = line.split(': ')
    return wireMap.set(wire!, parseInt(value!, 2))
  }, new Map<string, number>())
  const gates = gatesSetup!.split('\n').reduce((gates, line) => {
    const [, left, operator, right, out] = line!.match(
      /(.*) (\w+) (.*) -> (.*)/
    )!
    gates.push({
      left: left!,
      right: right!,
      operator: operator as Operator,
      out: out!
    })
    return gates
  }, [] as Gate[])
  return { wireMap, gates }
}

export function partOne(input: ReturnType<typeof parse>) {
  const queue = new Queue([...input.gates])
  while (!queue.isEmpty()) {
    const gate = queue.dequeue()!
    const [leftValue, rightValue] = [
      input.wireMap.get(gate.left),
      input.wireMap.get(gate.right)
    ]
    if (leftValue === undefined || rightValue === undefined) {
      queue.enqueue(gate)
      continue
    }
    input.wireMap.set(gate.out, compute[gate.operator](leftValue, rightValue))
  }
  return parseInt(
    input.wireMap
      .keys()
      .filter(key => key.startsWith('z'))
      .toArray()
      .sort((a, b) => b.localeCompare(a))
      .map(key => input.wireMap.get(key)!)
      .join(''),
    2
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  const printDotDiagram = false

  // If enabled, execute it to a .DOT file and generate SVG file:
  // $ bun solve 24 > graph.dot
  // $ dot -Tsvg graph.dot > graph.svg
  //
  // If there are problematic z-wires, they will be highlighed with red color.
  // Problematic wires are those which don't comply to following rules:
  // - it's constructed of XOR
  // - XOR is constructed of XOR and OR
  // - in my input, that was enough to find problematic ones, otherwise:
  //   - XOR is constructed of xn and yn
  //   - OR is constructed of 2 AND operators
  //
  // Try swapping them one by one and regenerate the graph to see whether they
  // are correct now. There might be a case for having reported more than 4
  // z-wires, but this might be caused if there is another problematic wire nearby,
  // so fix the first one (with the lower z-bit) and that might fix the another one
  // automatically.
  if (printDotDiagram) {
    const ignore = ['z00', 'z01', 'z45']
    const problematic = new Set<string>()
    input.gates.forEach(gate => {
      if (ignore.includes(gate.out)) return
      if (gate.out.startsWith('z')) {
        if (gate.operator !== 'XOR') {
          problematic.add(gate.out)
        } else {
          const leftGate = input.gates.find(g => g.out === gate.left)
          const rightGate = input.gates.find(g => g.out === gate.right)
          if (leftGate?.operator === 'XOR') {
            if (rightGate?.operator !== 'OR') {
              problematic.add(gate.out)
            }
          } else if (leftGate?.operator === 'OR') {
            if (rightGate!.operator !== 'XOR') {
              problematic.add(gate.out)
            }
          } else {
            problematic.add(gate.out)
          }
        }
      }
    })
    console.log('digraph {')
    input.gates.forEach(gate => {
      const operator = `${gate.left}_${gate.operator}_${gate.right}`
      if (problematic.has(gate.out)) {
        console.log(`  ${gate.out} [fillcolor=red, style=filled]`)
      }
      console.log(`  ${operator} [label="${gate.operator}"]`)
      console.log(`  ${gate.left} -> ${operator}`)
      console.log(`  ${gate.right} -> ${operator}`)
      console.log(`  ${operator} -> ${gate.out}`)
    })
    console.log('}')
    process.exit(0)
  }

  // Manually filled by analysis of graph and swapping incorrect wires
  const swappedWires = ['', '', '', '', '', '', '', '']
  return swappedWires.sort().join(',')
}

type Operator = 'AND' | 'OR' | 'XOR'
type Gate = { left: string; right: string; operator: Operator; out: string }

const compute: Record<Operator, (left: number, right: number) => number> = {
  AND: (left, right) => left & right,
  OR: (left, right) => left | right,
  XOR: (left, right) => left ^ right
}
