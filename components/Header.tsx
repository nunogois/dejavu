import { signOut, useSession } from 'next-auth/react'

export const Header = () => (
  <div className='absolute top-6 right-8 flex items-center gap-6'>
    <a
      href='https://github.com/nunogois/dejavu'
      target='_blank'
      rel='noopener noreferrer'
      className='text-sm font-medium hover:underline'
    >
      GitHub
    </a>
    <a
      href='/api/token'
      target='_blank'
      rel='noopener noreferrer'
      className='text-sm font-medium hover:underline'
    >
      Get token
    </a>
    <AuthMenu />
  </div>
)

const AuthMenu = () => {
  const { status } = useSession()

  if (status === 'loading') return null
  if (status === 'authenticated') {
    return (
      <button
        onClick={() => signOut()}
        className='cursor-pointer text-sm font-medium hover:underline'
      >
        Sign out
      </button>
    )
  }
  return null
}
