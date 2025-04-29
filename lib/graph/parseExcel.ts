import * as XLSX from 'xlsx'

export function parseExcel(buffer: Buffer, fileName?: string) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)

  const rows = rawRows.filter(row =>
    Object.values(row).some(value => value !== null && value !== '')
  )

  if (!fileName) {
    return rows
  }

  return rows.map(row => ({ ...row, __sourceFile: fileName }))
}
