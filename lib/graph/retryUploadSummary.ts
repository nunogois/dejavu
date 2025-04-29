import { uploadSummary } from './uploadSummary'

export async function retryUploadSummary(
  accessToken: string,
  folderName: string,
  dejavuFile: string,
  buffer: Buffer
) {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await uploadSummary(accessToken, folderName, dejavuFile, buffer)
      return
    } catch (err: any) {
      const isLocked = err.message?.includes('locked')
      const isLast = attempt === maxAttempts

      if (!isLocked || isLast) throw err

      const jitter = Math.floor(Math.random() * 300)
      const wait = 1000 * attempt + jitter
      console.warn(
        `Upload failed (attempt ${attempt}), retrying in ${wait}ms...`
      )
      await new Promise(res => setTimeout(res, wait))
    }
  }
}
