import { listFiles } from './listFiles'
import { downloadFile } from './downloadFile'
import { parseExcel } from './parseExcel'
import { findDuplicates } from './findDuplicates'
import { buildSummaryExcel } from './buildSummaryExcel'
import { retryUploadSummary } from './retryUploadSummary'
import { downloadExistingDejavu } from './downloadExistingDejavu'
import { DataRow } from '@/types/datarow'
import { buildSignatureSet } from './buildSignatureSet'
import { getRowSignature } from './getRowSignature'

export async function processReports(
  accessToken: string,
  folderName: string,
  isSharedFolder: boolean,
  column: string,
  sheetName: string | null,
  fileFilter: string | null,
  outputFile: string | null,
  skipAlreadyReported: boolean,
  resetExistingDejavuFile: boolean
) {
  console.log('Processing reports...')

  const dejavuFile = `${outputFile || 'dejavu'}.xlsx`

  const existing = await downloadExistingDejavu(
    accessToken,
    folderName,
    dejavuFile,
    isSharedFolder,
    resetExistingDejavuFile
  )

  const alreadyProcessed = skipAlreadyReported
    ? new Set(
        existing
          .map(r => (r.__sourceFile as string)?.toLowerCase())
          .filter(Boolean)
      )
    : new Set<string>()

  const existingSignatures = buildSignatureSet(existing)

  const { driveId, files } = await listFiles(
    accessToken,
    folderName,
    isSharedFolder
  )

  const incoming: DataRow[] = []

  for (const file of files) {
    const name = file.name.toLowerCase()

    if (
      name === dejavuFile.toLowerCase() ||
      alreadyProcessed.has(name) ||
      (fileFilter && !name.includes(fileFilter.toLowerCase()))
    )
      continue

    console.log(`Processing file: ${file.name}...`)
    const buffer = await downloadFile(accessToken, driveId, file.id)
    const rows = parseExcel(buffer, { sheetName, fileName: file.name })

    rows.forEach(r => {
      const sig = getRowSignature(r)
      if (!existingSignatures.has(sig)) incoming.push(r)
    })
  }

  const { grouped, newRows } = findDuplicates(existing, incoming, column)

  if (newRows.length === 0) {
    const msg = 'No new duplicates found.'
    console.log(msg)
    return msg
  }

  const summary = buildSummaryExcel(grouped)
  await retryUploadSummary(
    accessToken,
    folderName,
    dejavuFile,
    summary,
    isSharedFolder
  )

  const ratio = ((newRows.length / incoming.length) * 100).toFixed(2)
  const msg = `Updated ${dejavuFile} with ${newRows.length}/${incoming.length} (${ratio} %) duplicate rows.`
  console.log(msg)
  return msg
}
