import { product, toCharGrid } from '@/utils'

export function parse(input: string) {
  const sections = input.split('\n\n')

  return {
    shapes: sections
      .slice(0, -1)
      .map(shapeSection =>
        toCharGrid(shapeSection.slice(1)).reduce(
          (total, parts) => total + parts.filter(part => part === '#').length,
          0
        )
      ),
    regions: sections
      .at(-1)!
      .split('\n')
      .map(regionSection => {
        const [sizeSchema, quantitiesSchema] = regionSection.split(': ')
        const size = sizeSchema!.split('x').map(Number).reduce(product)
        const quantities = quantitiesSchema!.split(' ').map(Number)

        return { size, quantities }
      })
  }
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.regions.reduce(
    (total, region) =>
      total +
      (region.quantities.reduce(
        (sum, quantity, idx) => sum + quantity * input.shapes[idx]!,
        0
      ) <= region.size
        ? 1
        : 0),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {}
