import { DataRow } from '@/types/datarow'
import { getRowSignature } from './getRowSignature'

export function buildSignatureSet(rows: DataRow[]): Set<string> {
  return new Set(rows.map(getRowSignature))
}
