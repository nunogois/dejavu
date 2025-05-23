import { DataRow } from '@/types/datarow'
import { findColumn } from './findColumn'
import { buildSignatureSet } from './buildSignatureSet'
import { getRowSignature } from './getRowSignature'

export function findDuplicates(
  existing: DataRow[],
  incoming: DataRow[],
  column: string
): { grouped: DataRow[]; newRows: DataRow[] } {
  if (!existing.length && !incoming.length) {
    return { grouped: [], newRows: [] }
  }

  const keyCol = findColumn(existing[0] ?? incoming[0], column)
  if (!keyCol) throw new Error(`Column "${column}" not found.`)

  const buckets = new Map<
    string,
    { existing: DataRow[]; incoming: DataRow[] }
  >()

  const addToBucket = (row: DataRow, bucketPart: 'existing' | 'incoming') => {
    const key = String(row[keyCol]).trim().toLowerCase()
    if (!key) return
    if (!buckets.has(key)) buckets.set(key, { existing: [], incoming: [] })
    buckets.get(key)![bucketPart].push(row)
  }

  existing.forEach(r => addToBucket(r, 'existing'))
  incoming.forEach(r => addToBucket(r, 'incoming'))

  const grouped: DataRow[] = []
  const newRows: DataRow[] = []

  for (const { existing, incoming } of buckets.values()) {
    const all = [...existing, ...incoming]
    if (all.length < 2) continue

    grouped.push(...all, {})

    const existingSigs = buildSignatureSet(existing)
    incoming.forEach(row => {
      const sig = getRowSignature(row)
      if (!existingSigs.has(sig)) newRows.push(row)
    })
  }

  return { grouped, newRows }
}
