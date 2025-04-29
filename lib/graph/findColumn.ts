import { DataRow } from '@/types/datarow'

export function findColumn(row: DataRow, column: string): string | null {
  const keys = Object.keys(row)

  return keys.find(k => k === column) || null
}
