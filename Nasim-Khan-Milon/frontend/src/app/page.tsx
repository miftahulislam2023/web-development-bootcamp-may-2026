import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
  return (
    redirect('/login')
  )
}

export default page