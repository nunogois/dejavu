import { resolveOneDrivePath } from './resolveOneDrivePath'

export async function uploadSummary(
  accessToken: string,
  folderName: string,
  dejavuFile: string,
  buffer: Buffer,
  isSharedFolder: boolean
) {
  const { driveId, itemId: folderId } = await resolveOneDrivePath(
    accessToken,
    folderName,
    undefined,
    isSharedFolder
  )

  const uploadRes = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${folderId}:/${dejavuFile}:/content`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      body: buffer
    }
  )

  if (!uploadRes.ok) {
    const error = await uploadRes.json()
    throw new Error(`Failed to upload summary: ${error.error?.message}`, error)
  }
}
