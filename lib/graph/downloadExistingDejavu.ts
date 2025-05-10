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
    const { itemId } = await resolveOneDrivePath(
      accessToken,
      folderName,
      dejavuFile,
      isSharedFolder
    )

    const buffer = await downloadFile(accessToken, itemId)
    const rows = parseExcel(buffer)

    return rows
  } catch (err) {
    console.error('Error downloading existing dejavu file:', err)
    return []
  }
}
