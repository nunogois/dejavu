import { DataRow } from '@/types/datarow'

export function getRowSignature(row: DataRow): string {
  const copy = { ...row }
  delete copy.__sourceFile
  delete copy.__rowIndex
  return JSON.stringify(copy)
}
