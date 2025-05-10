type DriveItem = {
  id: string
  name: string
  folder?: unknown
  parentReference: {
    driveId: string
  }
}

type SharedItem = {
  remoteItem?: DriveItem
}

export async function resolveOneDrivePath(
  accessToken: string,
  folderName: string,
  fileName?: string,
  isSharedFolder: boolean = false
): Promise<{ driveId: string; itemId: string }> {
  if (!isSharedFolder) {
    const path = fileName ? `${folderName}/${fileName}` : folderName
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root:/${path}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to resolve personal path: ${error}`)
    }

    const data: DriveItem = await res.json()
    return {
      driveId: data.parentReference.driveId,
      itemId: data.id
    }
  }

  const sharedRes = await fetch(
    'https://graph.microsoft.com/v1.0/me/drive/sharedWithMe',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (!sharedRes.ok) {
    const error = await sharedRes.text()
    throw new Error(`Failed to fetch shared items: ${error}`)
  }

  const sharedItems: { value: SharedItem[] } = await sharedRes.json()

  const folder = sharedItems.value.find(
    item => item.remoteItem?.name === folderName && item.remoteItem.folder
  )

  if (!folder || !folder.remoteItem) {
    throw new Error(`Shared folder '${folderName}' not found.`)
  }

  const driveId = folder.remoteItem.parentReference.driveId

  if (!fileName) {
    return {
      driveId,
      itemId: folder.remoteItem.id
    }
  }

  const childrenRes = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${folder.remoteItem.id}/children`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (!childrenRes.ok) {
    const error = await childrenRes.text()
    throw new Error(`Failed to list children in shared folder: ${error}`)
  }

  const children: { value: DriveItem[] } = await childrenRes.json()
  const match = children.value.find(item => item.name === fileName)

  if (!match) {
    throw new Error(
      `File '${fileName}' not found in shared folder '${folderName}'.`
    )
  }

  return {
    driveId,
    itemId: match.id
  }
}
