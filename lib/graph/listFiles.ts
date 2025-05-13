import { resolveOneDrivePath } from './resolveOneDrivePath'

export type OneDriveFile = {
  id: string
  name: string
}

export async function listFiles(
  accessToken: string,
  folderName: string,
  isSharedFolder: boolean
): Promise<{ driveId: string; files: OneDriveFile[] }> {
  const { driveId, itemId } = await resolveOneDrivePath(
    accessToken,
    folderName,
    undefined,
    isSharedFolder
  )

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/children`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Failed to list files: ${error.error?.message}`)
  }

  const data = await res.json()
  return { driveId, files: data.value as OneDriveFile[] }
}
