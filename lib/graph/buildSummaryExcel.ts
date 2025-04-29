import * as XLSX from 'xlsx'

export function buildSummaryExcel(rows: Record<string, any>[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
