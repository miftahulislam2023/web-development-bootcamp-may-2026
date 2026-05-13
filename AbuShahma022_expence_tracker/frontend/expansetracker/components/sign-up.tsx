import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SignupPage() {
    return (
        <section className="flex min-h-screen items-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
  <form
    action=""
    className="bg-card mx-auto w-full max-w-md rounded-3xl border shadow-xl">

    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/"
          aria-label="Go Home">
          <LogoIcon />
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Create Your Account
        </h1>

        <p className="text-muted-foreground mt-2 text-sm">
          Start tracking expenses, managing budgets, and organizing your finances smarter.
        </p>
      </div>

      <div className="space-y-5">

        {/* Profile Image */}
        <div className="space-y-2">
          <Label htmlFor="image">
            Profile Image <span className="text-muted-foreground">(Optional)</span>
          </Label>

          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
          />
        </div>

        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name
            </Label>

            <Input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="John"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name
            </Label>

            <Input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address
          </Label>

          <Input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Submit */}
        <Button className="h-11 w-full rounded-xl text-sm font-medium">
          Create Account
        </Button>
      </div>
    </div>

    {/* Footer */}
    <div className="bg-muted/40 rounded-b-3xl border-t px-8 py-4">
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?

        <Button
          asChild
          variant="link"
          className="px-2">
          <Link href="/login">
            Sign In
          </Link>
        </Button>
      </p>
    </div>
  </form>
</section>
    )
}
