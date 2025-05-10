import { DataRow } from '@/types/datarow'
import * as XLSX from 'xlsx'

export function parseExcel(
  buffer: Buffer,
  options?: {
    sheetName: string | null
    fileName?: string
  }
): DataRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetToSelect = options?.sheetName || workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetToSelect]
  if (!sheet) {
    return []
  }
  const rawRows = XLSX.utils.sheet_to_json<DataRow>(sheet)

  const rows = rawRows.filter(row =>
    Object.values(row).some(value => value !== null && value !== '')
  )

  if (!options?.fileName) {
    return rows
  }

  return rows.map(row => ({ ...row, __sourceFile: options.fileName }))
}
