import { DataRow } from '@/types/datarow'

const isMeta = (k: string) => k.startsWith('__')

function normalise(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (v instanceof Date) return v.toISOString()
  return String(v).trim()
}

export function getRowSignature(row: DataRow): string {
  const kvPairs = Object.entries(row)
    .filter(([k]) => !isMeta(k))
    .map(([k, v]) => [k, normalise(v)])

  kvPairs.sort(([a], [b]) => a.localeCompare(b))

  return JSON.stringify(Object.fromEntries(kvPairs))
}
