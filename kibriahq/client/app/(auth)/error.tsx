"use client"

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import RefreshBtn from "@/components/ui/errors/RefreshBtn";
import GoHomeBtn from "@/components/ui/errors/GoHomeBtn";
import ErrorIcon from "@/components/ui/errors/ErrorIcon";
import ErrorTitle from "@/components/ui/errors/ErrorTitle";
import ErrorMsg from "@/components/ui/errors/ErrorMsg";
import ErrorWrapper from "@/components/ui/errors/ErrorWrapper";

const Error = ({ error, reset }: { error: Error, reset: () => void }) => {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <ErrorWrapper>
            <ErrorIcon>
                <TriangleAlert className="h-6 w-6" />
            </ErrorIcon>
            <ErrorTitle title="Oops...Error" />
            <ErrorMsg msg={error.message} />
            <div className="flex gap-2">
                <RefreshBtn onClick={reset} />
                <GoHomeBtn />
            </div>
        </ErrorWrapper>
    )
}

export default Error