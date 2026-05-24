import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center fixed inset-0 z-50">
        <div className='h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin' />
    </div>
  )
}

export default Loading