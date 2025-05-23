export async function removeFile(
  accessToken: string,
  driveId: string,
  fileId: string
) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (res.status !== 204 && res.status !== 404) {
    const error = await res.text()
    throw new Error(`Failed to delete file: ${error}`)
  }
}
