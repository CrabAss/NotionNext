/**
 * 控制台用户账号面板
 * @returns
 */
export default function DashboardUser() {
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!enableClerk) {
    return null
  }
  // eslint-disable-next-line global-require
  const { UserProfile } = require('@clerk/nextjs')
  return (
    <UserProfile
      appearance={{
        elements: {
          cardBox: 'w-full',
          rootBox: 'w-full'
        }
      }}
      className='bg-blue-300'
      routing='path'
      path='/dashboard/user-profile'
    />
  )
}
