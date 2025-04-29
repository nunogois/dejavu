'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { SyncButton } from '@/components/SyncButton'
import { Header } from '@/components/Header'

export default function Home() {
  const [message, setMessage] = useState<string | null>(null)

  return (
    <SessionProvider>
      <div className='relative min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white dark:bg-black text-black dark:text-white transition-colors'>
        <Header />

        <div className='flex flex-col gap-8 items-center justify-center text-center min-h-[calc(100vh-80px)]'>
          <h1 className='text-4xl font-bold'>🌀 dejavu</h1>

          <SyncButton setMessage={setMessage} />

          <div className='min-h-[1.5rem]'>
            {message && (
              <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-md'>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}
