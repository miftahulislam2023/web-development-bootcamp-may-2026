import React from "react";

const ErrorWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <section>
            <div className="relative min-h-screen w-full">
                <div className="grid min-h-screen px-8">
                    <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ErrorWrapper