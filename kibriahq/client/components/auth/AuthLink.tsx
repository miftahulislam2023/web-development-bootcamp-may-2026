import Link from "next/link"
import { usePathname } from "next/navigation"

const AuthLink = () => {
    const pathname = usePathname()
    return (
        <>
            {pathname === '/login' && (
                <p className="mt-6 text-center text-sm font-medium text-on-surface-variant">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            )}
            {pathname === '/signup' && (
                <p className="mt-6 text-center text-sm font-medium text-on-surface-variant">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Log in
                    </Link>
                </p>
            )}
        </>
    )
}

export default AuthLink