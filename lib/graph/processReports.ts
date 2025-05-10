import { listFiles } from './listFiles'
import { downloadFile } from './downloadFile'
import { parseExcel } from './parseExcel'
import { findDuplicates } from './findDuplicates'
import { buildSummaryExcel } from './buildSummaryExcel'
import { retryUploadSummary } from './retryUploadSummary'
import { downloadExistingDejavu } from './downloadExistingDejavu'
import { DataRow } from '@/types/datarow'

export async function processReports(
  accessToken: string,
  folderName: string,
  isSharedFolder: boolean,
  column: string,
  sheetName: string | null,
  fileFilter: string | null,
  outputFile: string | null
) {
  const dejavuFile = `${outputFile || 'dejavu'}.xlsx`

  const existing = await downloadExistingDejavu(
    accessToken,
    folderName,
    dejavuFile,
    isSharedFolder
  )

  const alreadyProcessed = new Set(
    existing.map(r => (r.__sourceFile as string)?.toLowerCase()).filter(Boolean)
  )

  const files = await listFiles(accessToken, folderName, isSharedFolder)

  const newRows: DataRow[] = []

  console.log(`Found ${files.length} files in the folder:`, {
    files: files.map(f => f.name)
  })

  for (const file of files) {
    const name = file.name.toLowerCase()
    if (
      name === dejavuFile.toLowerCase() ||
      alreadyProcessed.has(name) ||
      (fileFilter && !name.includes(fileFilter))
    )
      continue

    console.log(`Processing file: ${file.name}...`)
    const buffer = await downloadFile(accessToken, file.id)
    const rows = parseExcel(buffer, {
      sheetName,
      fileName: file.name
    })
    newRows.push(...rows)
  }

  const allRows = [...existing, ...newRows]
  const { grouped, newCount } = findDuplicates(
    allRows,
    alreadyProcessed,
    column
  )

  if (newCount === 0) {
    const message = `No new duplicates found.`
    console.log(message)
    return message
  }

  const summary = buildSummaryExcel(grouped)
  await retryUploadSummary(
    accessToken,
    folderName,
    dejavuFile,
    summary,
    isSharedFolder
  )

  const message = `Uploaded ${newCount} duplicate rows to ${dejavuFile}.`
  console.log(message)
  return message
}
