export async function downloadFile(
  accessToken: string,
  driveId: string,
  fileId: string
) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${fileId}/content`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Failed to download file: ${error}`)
  }

  return Buffer.from(await res.arrayBuffer())
}
