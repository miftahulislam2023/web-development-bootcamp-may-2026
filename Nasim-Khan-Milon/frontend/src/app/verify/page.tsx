import Loading from '@/components/Loading'
import VerifyOtp from '@/components/VerifyOtp'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
        <VerifyOtp />
    </Suspense>
  )
}

export default page