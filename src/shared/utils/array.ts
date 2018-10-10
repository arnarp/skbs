export function newValues<T>(before: T[], after: T[]): T[] {
  return after.filter(i => !before.includes(i))
}

export function chunks<T>(arr: T[], maxChunkSize: number): T[][] {
  const ratio = arr.length / maxChunkSize;
  if (ratio <= 0) {
    return [arr]
  }
  const sizes: number[] = Array(Math.floor(ratio)).fill(maxChunkSize)
  const lastSize = arr.length % maxChunkSize
  if (lastSize !== 0) {
    sizes.push(lastSize)
  }
  const result: T[][] = []
  sizes.forEach((_value, index) => {
    result.push(arr.slice(index * maxChunkSize, (index + 1) * maxChunkSize))
  })
  return result
}