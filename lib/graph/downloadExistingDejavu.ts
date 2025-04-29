import { downloadFile } from './downloadFile'
import { parseExcel } from './parseExcel'

export async function downloadExistingDejavu(
  accessToken: string,
  folderName: string,
  dejavuFile: string
) {
  try {
    const metadataRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root:/${folderName}/${dejavuFile}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (metadataRes.status === 404) {
      console.log(`No existing ${dejavuFile} found in folder ${folderName}.`)
      return []
    }

    if (!metadataRes.ok) {
      const error = await metadataRes.text()
      throw new Error(`Failed to locate dejavu file: ${error}`)
    }

    const metadata = await metadataRes.json()
    const fileId = metadata.id

    const buffer = await downloadFile(accessToken, fileId)
    const rows = parseExcel(buffer)

    return rows
  } catch (err) {
    console.error('Error downloading existing dejavu file:', err)
    return []
  }
}
