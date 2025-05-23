import { DataRow } from '@/types/datarow'
import * as XLSX from 'xlsx'

export function parseExcel(
  buffer: Buffer,
  options?: { sheetName: string | null; fileName?: string }
): DataRow[] {
  const wb = XLSX.read(buffer, {
    type: 'buffer',
    cellDates: true,
    cellNF: true
  })

  const sheetName = options?.sheetName || wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  if (!ws) return []

  const [headerRow] = XLSX.utils.sheet_to_json<string[]>(ws, {
    header: 1,
    range: 0
  })
  const data = XLSX.utils.sheet_to_json<DataRow>(ws, {
    header: headerRow,
    range: 1
  })

  const idxToCol = (n: number) => {
    let s = ''
    for (++n; n; n = Math.floor((n - 1) / 26))
      s = String.fromCharCode(((n - 1) % 26) + 65) + s
    return s
  }

  return data.map((row, rIdx) => {
    const fmt: Record<string, string> = {}
    headerRow.forEach((hdr, cIdx) => {
      const addr = `${idxToCol(cIdx)}${rIdx + 2}`
      const cell = ws[addr]
      const numFmt = cell?.z || cell?.s?.numFmt
      if (numFmt) fmt[hdr] = numFmt
    })

    const base: DataRow = {
      ...row,
      ...(options?.fileName ? { __sourceFile: options.fileName } : {})
    }
    return Object.keys(fmt).length ? { ...base, __fmt: fmt } : base
  })
}
