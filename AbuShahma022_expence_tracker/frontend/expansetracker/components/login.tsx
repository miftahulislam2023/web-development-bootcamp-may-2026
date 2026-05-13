import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
    return (
       <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
    <form
        action=""
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">

        <div className="p-8 pb-6">
            <div>
                <Link
                    href="/"
                    aria-label="go home">
                    <LogoIcon />
                </Link>

                <h1 className="mb-1 mt-4 text-xl font-semibold">
                    Sign In to Expense Tracker
                </h1>

                <p className="text-sm text-muted-foreground">
                    Welcome back! Sign in to continue managing your finances.
                </p>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-6">

                {/* Email */}
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="block text-sm">
                        Email Address
                    </Label>

                    <Input
                        type="email"
                        required
                        name="email"
                        id="email"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Password */}
                <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="password"
                            className="text-sm">
                            Password
                        </Label>

                        <Button
                            asChild
                            variant="link"
                            size="sm">

                            <Link
                                href="#"
                                className="text-sm">
                                Forgot Password?
                            </Link>

                        </Button>
                    </div>

                    <Input
                        type="password"
                        required
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        className="input sz-md variant-mixed"
                    />
                </div>

                {/* Submit */}
                <Button className="w-full">
                    Sign In
                </Button>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
                Don&apos;t have an account?

                <Button
                    asChild
                    variant="link"
                    className="px-2">

                    <Link href="/signup">
                        Create account
                    </Link>

                </Button>
            </p>
        </div>
    </form>
</section>
    )
}
