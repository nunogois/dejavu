import { DataRow } from '@/types/datarow'

const isMeta = (k: string) => k.startsWith('__')

function canon(v: unknown): string {
  if (v == null) return ''
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v).trim()
}

export function getRowSignature(row: DataRow): string {
  const stable = Object.entries(row)
    .filter(([k]) => !isMeta(k))
    .map(([k, v]) => [k, canon(v)])
    .sort(([a], [b]) => a.localeCompare(b))

  return JSON.stringify(Object.fromEntries(stable))
}
