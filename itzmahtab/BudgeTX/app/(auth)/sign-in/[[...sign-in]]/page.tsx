import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn 
      forceRedirectUrl="/dashboard"
      signUpUrl="/sign-up"
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "w-full shadow-none border border-gray-200",
        }
      }}
    />
  )
}
