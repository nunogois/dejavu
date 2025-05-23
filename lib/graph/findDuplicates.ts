import { DataRow } from '@/types/datarow'
import { findColumn } from './findColumn'

export function findDuplicates(
  existingRows: DataRow[],
  newRows: DataRow[],
  column: string
): { grouped: DataRow[]; newCount: number } {
  const targetColumn = findColumn([...existingRows, ...newRows][0], column)
  if (!targetColumn) throw new Error('Could not find target column in rows.')

  const groupedMap = new Map<string, DataRow[]>()
  const signatureSet = new Set<string>()

  for (const row of existingRows) {
    const key = String(row[targetColumn])
    if (!key) continue

    if (!groupedMap.has(key)) groupedMap.set(key, [])
    const group = groupedMap.get(key)!

    const signature = rowSignature(row)
    if (!group.some(r => rowSignature(r) === signature)) {
      group.push(row)
      signatureSet.add(signature)
    }
  }

  let newCount = 0

  for (const row of newRows) {
    const key = String(row[targetColumn])
    if (!key) continue

    if (!groupedMap.has(key)) groupedMap.set(key, [])
    const group = groupedMap.get(key)!

    const signature = rowSignature(row)
    if (!group.some(r => rowSignature(r) === signature)) {
      group.push(row)

      if (!signatureSet.has(signature)) {
        newCount++
        signatureSet.add(signature)
      }
    }
  }

  const grouped: DataRow[] = []
  for (const group of groupedMap.values()) {
    if (group.length <= 1) continue
    grouped.push(...group, {})
  }

  return { grouped, newCount }
}

function rowSignature(row: DataRow): string {
  const rowCopy = { ...row }
  delete rowCopy.__sourceFile
  delete rowCopy.__rowIndex
  return JSON.stringify(rowCopy)
}
