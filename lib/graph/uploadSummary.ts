export async function uploadSummary(
  accessToken: string,
  folderName: string,
  dejavuFile: string,
  buffer: Buffer
) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/root:/${folderName}/${dejavuFile}:/content`,
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

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Failed to upload summary: ${error.error?.message}`)
  }
}
