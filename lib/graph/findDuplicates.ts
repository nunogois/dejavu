import { findColumn } from './findColumn'

export function findDuplicates(
  allRows: Record<string, any>[],
  alreadyProcessed: Set<string>,
  column: string
): { grouped: Record<string, any>[]; newCount: number } {
  if (allRows.length === 0) return { grouped: [], newCount: 0 }

  const targetColumn = findColumn(allRows[0], column)
  if (!targetColumn) throw new Error('Could not find target column in rows.')

  const groups = new Map<string, Record<string, any>[]>()

  for (const row of allRows) {
    const key = row[targetColumn]
    if (!key) continue
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }

  const result: Record<string, any>[] = []
  let newCount = 0

  for (const rows of groups.values()) {
    if (rows.length <= 1) continue

    result.push(...rows, {})

    for (const row of rows) {
      const src = row.__sourceFile?.toLowerCase()
      if (src && !alreadyProcessed.has(src)) {
        newCount++
      }
    }
  }

  return { grouped: result, newCount }
}
