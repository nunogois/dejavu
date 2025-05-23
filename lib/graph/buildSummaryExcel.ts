import { DataRow } from '@/types/datarow'
import * as XLSX from 'xlsx'

export function buildSummaryExcel(rows: DataRow[]) {
  if (!rows.length) return Buffer.alloc(0)

  const printable = rows.map(r => {
    const clone = { ...r }
    delete clone.__fmt
    return clone
  })

  const ws = XLSX.utils.json_to_sheet(printable, { cellDates: true })
  const headers = Object.keys(printable[0])

  rows.forEach((orig, rIdx) => {
    if (!orig.__fmt) return
    Object.entries(orig.__fmt).forEach(([key, z]) => {
      const cIdx = headers.indexOf(key)
      if (cIdx === -1) return
      const addr = XLSX.utils.encode_cell({ r: rIdx + 1, c: cIdx })
      const cell = ws[addr]
      if (cell) {
        cell.z = z
        if (cell.t !== 'd' && /[dmy]/i.test(z)) cell.t = 'd'
      }
    })
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Summary')
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', cellStyles: true })
}
