export type OneDriveFile = {
  id: string
  name: string
}

export async function listFiles(
  accessToken: string,
  folderName: string
): Promise<OneDriveFile[]> {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/root:/${folderName}:/children`,
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
  return data.value as OneDriveFile[]
}
