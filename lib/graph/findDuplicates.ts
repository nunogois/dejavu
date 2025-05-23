import { DataRow } from '@/types/datarow'
import { findColumn } from './findColumn'

export function findDuplicates(
  existingRows: DataRow[],
  newRows: DataRow[],
  column: string
): { grouped: DataRow[]; newCount: number } {
  const allRows = [...existingRows, ...newRows]
  if (allRows.length === 0) return { grouped: [], newCount: 0 }

  const targetColumn = findColumn(allRows[0], column)
  if (!targetColumn) throw new Error('Could not find target column in rows.')

  const groupedMap = new Map<string, { existing: DataRow[]; new: DataRow[] }>()
  const grouped: DataRow[] = []
  let newCount = 0

  const getKey = (row: DataRow) =>
    String(row[targetColumn])?.trim().toLowerCase()

  for (const row of existingRows) {
    const key = getKey(row)
    if (!key) continue
    if (!groupedMap.has(key)) groupedMap.set(key, { existing: [], new: [] })
    groupedMap.get(key)!.existing.push(row)
  }

  for (const row of newRows) {
    const key = getKey(row)
    if (!key) continue
    if (!groupedMap.has(key)) groupedMap.set(key, { existing: [], new: [] })
    groupedMap.get(key)!.new.push(row)
  }

  for (const { existing, new: newOnes } of groupedMap.values()) {
    const all = [...existing, ...newOnes]
    if (all.length <= 1) continue

    grouped.push(...all, {})

    const seen = new Set<string>()
    for (const row of newOnes) {
      const sig = rowSignature(row)
      if (!seen.has(sig)) {
        seen.add(sig)
        newCount++
      }
    }
  }

  return { grouped, newCount }
}

function rowSignature(row: DataRow): string {
  const rowCopy = { ...row }
  delete rowCopy.__sourceFile
  delete rowCopy.__rowIndex
  return JSON.stringify(rowCopy)
}
