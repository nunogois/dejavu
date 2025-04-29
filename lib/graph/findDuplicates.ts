import { DataRow } from '@/types/datarow'
import { findColumn } from './findColumn'

export function findDuplicates(
  allRows: DataRow[],
  alreadyProcessed: Set<string>,
  column: string
): { grouped: DataRow[]; newCount: number } {
  if (allRows.length === 0) return { grouped: [], newCount: 0 }

  const targetColumn = findColumn(allRows[0], column)
  if (!targetColumn) throw new Error('Could not find target column in rows.')

  const groups = new Map<string, DataRow[]>()

  for (const row of allRows) {
    const key = row[targetColumn]
    if (!key) continue
    if (!groups.has(key as string)) groups.set(key as string, [])
    groups.get(key as string)!.push(row)
  }

  const grouped: DataRow[] = []
  let newCount = 0

  for (const rows of groups.values()) {
    if (rows.length <= 1) continue

    grouped.push(...rows, {})

    for (const row of rows) {
      const src = (row.__sourceFile as string)?.toLowerCase()
      if (src && !alreadyProcessed.has(src)) {
        newCount++
      }
    }
  }

  return { grouped, newCount }
}
