import { usePathname } from "next/navigation"

const AuthHeader = () => {
    const pathname = usePathname()
    return (
        <>
            {pathname === '/login' && (
                <div className="mb-7">
                    <h2 className="mb-2 text-3xl font-bold text-on-surface">Welcome back</h2>
                    <p className="text-sm font-medium text-on-surface-variant">Continue your collaboration journey.</p>
                </div>
            )}
            {pathname === '/signup' && (
                <div className="mb-7">
                    <h2 className="mb-2 text-3xl font-bold text-on-surface">Create your workspace</h2>
                    <p className="text-sm font-medium text-on-surface-variant">To get started, create your account for free now</p>
                </div>
            )}
        </>
    )
}

export default AuthHeader