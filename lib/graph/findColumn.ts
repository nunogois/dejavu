export function findColumn(
  row: Record<string, any>,
  column: string
): string | null {
  const keys = Object.keys(row)

  return keys.find(k => k === column) || null
}
