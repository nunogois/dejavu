import { downloadFile } from './downloadFile'
import { parseExcel } from './parseExcel'
import { removeFile } from './removeFile'
import { resolveOneDrivePath } from './resolveOneDrivePath'

export async function downloadExistingDejavu(
  accessToken: string,
  folderName: string,
  dejavuFile: string,
  isSharedFolder: boolean,
  resetExistingDejavuFile: boolean = false
) {
  try {
    const { driveId, itemId } = await resolveOneDrivePath(
      accessToken,
      folderName,
      dejavuFile,
      isSharedFolder
    )

    if (resetExistingDejavuFile) {
      console.log('Resetting dejavu file.')
      await removeFile(accessToken, driveId, itemId)
      return []
    }

    const buffer = await downloadFile(accessToken, driveId, itemId)
    const rows = parseExcel(buffer)

    console.log(`Found existing dejavu file with ${rows.length} rows.`)

    return rows
  } catch (e) {
    console.log('No existing dejavu file found.', e)
    return []
  }
}
