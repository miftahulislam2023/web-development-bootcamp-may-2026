import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
