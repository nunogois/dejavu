import { DataRow } from '@/types/datarow'

export function getRowSignature(row: DataRow): string {
  const clean = Object.fromEntries(
    Object.entries(row)
      .filter(([k]) => !k.startsWith('__'))
      .sort(([a], [b]) => a.localeCompare(b))
  )
  return JSON.stringify(clean)
}
