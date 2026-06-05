'use client'

import ErrorIcon from '@/components/ui/errors/ErrorIcon'
import ErrorMsg from '@/components/ui/errors/ErrorMsg'
import ErrorTitle from '@/components/ui/errors/ErrorTitle'
import ErrorWrapper from '@/components/ui/errors/ErrorWrapper'
import GoHomeBtn from '@/components/ui/errors/GoHomeBtn'
import { GlobeX } from 'lucide-react'

const NotFound = () => {
    return (
        <ErrorWrapper>
            <ErrorIcon>
                <GlobeX className="h-6 w-6" />
            </ErrorIcon>
            <ErrorTitle title="Oops...Error 404" />
            <ErrorMsg msg="The page you’re looking for is no longer available!" />
            <div className="flex gap-2">
                <GoHomeBtn />
            </div>
        </ErrorWrapper>
    )
}

export default NotFound