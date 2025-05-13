import { downloadFile } from './downloadFile'
import { parseExcel } from './parseExcel'
import { resolveOneDrivePath } from './resolveOneDrivePath'

export async function downloadExistingDejavu(
  accessToken: string,
  folderName: string,
  dejavuFile: string,
  isSharedFolder: boolean
) {
  try {
    const { driveId, itemId } = await resolveOneDrivePath(
      accessToken,
      folderName,
      dejavuFile,
      isSharedFolder
    )

    const buffer = await downloadFile(accessToken, driveId, itemId)
    const rows = parseExcel(buffer)

    return rows
  } catch (e) {
    console.info('No existing dejavu file found.', e)
    return []
  }
}
