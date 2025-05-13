import { signIn, useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, useState } from 'react'

interface ISyncButtonProps {
  setMessage: Dispatch<SetStateAction<string | null>>
}

export const SyncButton = ({ setMessage }: ISyncButtonProps) => {
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [folder, setFolder] = useState('')
  const [column, setColumn] = useState('')
  const [sheet, setSheet] = useState('')
  const [fileFilter, setFileFilter] = useState('')
  const [outputFile, setOutputFile] = useState('')
  const [isSharedFolder, setIsSharedFolder] = useState(false)
  const [skipAlreadyReported, setSkipAlreadyReported] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const onSync = async () => {
    if (!folder || !column) {
      setMessage('Please select a folder and column.')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const params = new URLSearchParams({
        folder,
        column,
        ...(sheet && { sheet }),
        ...(fileFilter && { file_filter: fileFilter }),
        ...(outputFile && { output_file: outputFile }),
        ...(isSharedFolder && { is_shared_folder: '1' }),
        ...(skipAlreadyReported && { skip_already_reported: '1' })
      })
      const res = await fetch(`/api/sync?${params}`)

      if (!res.ok) {
        setMessage(`Failed to sync reports: ${res.status} ${res.statusText}`)
        return
      }

      const data = await res.json()
      setMessage(data.message || 'Done.')
    } catch (e) {
      console.error('Error syncing reports:', e)
      setMessage('Error syncing reports. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className='flex flex-col gap-4 items-center w-full max-w-xs min-h-[164px]' />
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className='flex flex-col gap-4 items-center w-full max-w-xs min-h-[164px]'>
        <button
          onClick={() => signIn('azure-ad')}
          className='cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 px-6 w-full sm:w-auto md:w-[160px]'
        >
          Sign in
        </button>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 items-center w-full max-w-xs min-h-[164px]'>
      <input
        type='text'
        placeholder='Folder path'
        value={folder}
        onChange={e => setFolder(e.target.value)}
        className='border rounded-md px-4 py-2 w-full bg-transparent border-black/[.08] dark:border-white/[.145] text-black dark:text-white'
      />
      <input
        type='text'
        placeholder='Sheet name'
        value={sheet}
        onChange={e => setSheet(e.target.value)}
        className='border rounded-md px-4 py-2 w-full bg-transparent border-black/[.08] dark:border-white/[.145] text-black dark:text-white'
      />
      <input
        type='text'
        placeholder='Column name'
        value={column}
        onChange={e => setColumn(e.target.value)}
        className='border rounded-md px-4 py-2 w-full bg-transparent border-black/[.08] dark:border-white/[.145] text-black dark:text-white'
      />

      <button
        type='button'
        onClick={() => setShowAdvanced(!showAdvanced)}
        className='text-sm underline text-blue-600 dark:text-blue-400'
      >
        {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
      </button>

      {showAdvanced && (
        <div className='flex flex-col gap-2 w-full'>
          <input
            type='text'
            placeholder='File filter (optional)'
            value={fileFilter}
            onChange={e => setFileFilter(e.target.value)}
            className='border rounded-md px-4 py-2 w-full bg-transparent border-black/[.08] dark:border-white/[.145] text-black dark:text-white'
          />
          <input
            type='text'
            placeholder='Output file name (optional)'
            value={outputFile}
            onChange={e => setOutputFile(e.target.value)}
            className='border rounded-md px-4 py-2 w-full bg-transparent border-black/[.08] dark:border-white/[.145] text-black dark:text-white'
          />
          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={isSharedFolder}
              onChange={e => setIsSharedFolder(e.target.checked)}
            />
            Shared folder
          </label>
          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={skipAlreadyReported}
              onChange={e => setSkipAlreadyReported(e.target.checked)}
            />
            Skip already processed files
          </label>
        </div>
      )}

      <button
        onClick={onSync}
        disabled={loading}
        className='cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 px-6 w-full sm:w-auto md:w-[160px]'
      >
        {loading ? 'Syncing...' : 'Sync'}
      </button>
    </div>
  )
}
