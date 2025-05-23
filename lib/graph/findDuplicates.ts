import { DataRow } from '@/types/datarow'
import { findColumn } from './findColumn'

export function findDuplicates(
  allRows: DataRow[],
  column: string
): { grouped: DataRow[]; newCount: number } {
  if (allRows.length === 0) return { grouped: [], newCount: 0 }

  const targetColumn = findColumn(allRows[0], column)
  if (!targetColumn) throw new Error('Could not find target column in rows.')

  const groups = new Map<string, DataRow[]>()
  const seenSignatures = new Set<string>()
  let newCount = 0

  for (const row of allRows) {
    const key = row[targetColumn]
    if (!key) continue

    if (!groups.has(key as string)) groups.set(key as string, [])

    const group = groups.get(key as string)!
    const signature = rowSignature(row)

    const alreadyInGroup = group.some(r => rowSignature(r) === signature)
    if (!alreadyInGroup) {
      group.push(row)
      if (!seenSignatures.has(signature)) {
        seenSignatures.add(signature)
        newCount++
      }
    }
  }

  const grouped: DataRow[] = []

  for (const rows of groups.values()) {
    if (rows.length <= 1) continue
    grouped.push(...rows, {})
  }

  return { grouped, newCount }
}

function rowSignature(row: DataRow): string {
  const { __sourceFile, __rowIndex, ...rest } = row
  return JSON.stringify(rest)
}
