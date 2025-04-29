import { listFiles } from './listFiles'
import { downloadFile } from './downloadFile'
import { parseExcel } from './parseExcel'
import { findDuplicates } from './findDuplicates'
import { buildSummaryExcel } from './buildSummaryExcel'
import { retryUploadSummary } from './retryUploadSummary'
import { downloadExistingDejavu } from './downloadExistingDejavu'

export async function processReports(
  accessToken: string,
  folderName: string,
  column: string
) {
  const dejavuFile = `${process.env.ONEDRIVE_DUPLICATES_FILE || 'dejavu'}.xlsx`

  const existing = await downloadExistingDejavu(
    accessToken,
    folderName,
    dejavuFile
  )

  const alreadyProcessed = new Set(
    existing.map(r => r.__sourceFile?.toLowerCase()).filter(Boolean)
  )

  const files = await listFiles(accessToken, folderName)

  const newRows: Record<string, any>[] = []

  for (const file of files) {
    const name = file.name.toLowerCase()
    if (name === dejavuFile.toLowerCase() || alreadyProcessed.has(name))
      continue

    console.log(`Processing file: ${file.name}...`)
    const buffer = await downloadFile(accessToken, file.id)
    const rows = parseExcel(buffer, file.name)
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
  await retryUploadSummary(accessToken, folderName, dejavuFile, summary)

  const message = `Uploaded ${newCount} duplicate rows to ${dejavuFile}.`
  console.log(message)
  return message
}
