import { downloadFile } from './downloadFile'
import { parseExcel } from './parseExcel'
import { removeFile } from './removeFile'
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

    if (process.env.RESET) {
      console.info('Resetting dejavu file.')
      await removeFile(accessToken, driveId, itemId)
      return []
    }

    const buffer = await downloadFile(accessToken, driveId, itemId)
    const rows = parseExcel(buffer)

    return rows
  } catch (e) {
    console.info('No existing dejavu file found.', e)
    return []
  }
}
