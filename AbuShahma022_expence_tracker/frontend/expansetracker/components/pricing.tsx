import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function Pricing() {
    return (
        <section className="py-16 md:py-32">
    <div className="mx-auto max-w-6xl px-6">

        <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-center text-4xl font-semibold lg:text-5xl">
                Simple Pricing for Smarter Expense Management
            </h1>

            <p className="text-muted-foreground">
                Choose the perfect plan to track expenses, manage budgets, and gain better financial insights with ease.
            </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">

            {/* Free Plan */}
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="font-medium">
                        Free
                    </CardTitle>

                    <span className="my-3 block text-2xl font-semibold">
                        $0 / mo
                    </span>

                    <CardDescription className="text-sm">
                        Perfect for personal use
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <hr className="border-dashed" />

                    <ul className="list-outside space-y-3 text-sm">
                        {[
                            'Track daily expenses',
                            'Basic analytics dashboard',
                            'Expense categories',
                            'Monthly spending overview',
                            'Secure account access',
                        ].map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2">

                                <Check className="size-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                    <Button
                        asChild
                        variant="outline"
                        className="w-full">

                        <Link href="/login">
                            Get Started
                        </Link>

                    </Button>
                </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="relative">

                <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                    Popular
                </span>

                <div className="flex flex-col">

                    <CardHeader>
                        <CardTitle className="font-medium">
                            Pro
                        </CardTitle>

                        <span className="my-3 block text-2xl font-semibold">
                            $19 / mo
                        </span>

                        <CardDescription className="text-sm">
                            Best for advanced financial tracking
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <hr className="border-dashed" />

                        <ul className="list-outside space-y-3 text-sm">
                            {[
                                'Everything in Free Plan',
                                'Advanced analytics & insights',
                                'Budget management tools',
                                'Custom expense reports',
                                'Priority support',
                                'Cloud sync across devices',
                                'Downloadable reports',
                                'Monthly financial summaries',
                                'Secure backup & recovery',
                            ].map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2">

                                    <Check className="size-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>

                    <CardFooter>
                        <Button
                            asChild
                            className="w-full">

                            <Link href="/login">
                                Get Started
                            </Link>

                        </Button>
                    </CardFooter>
                </div>
            </Card>

            {/* Business Plan */}
            <Card className="flex flex-col">

                <CardHeader>
                    <CardTitle className="font-medium">
                        Business
                    </CardTitle>

                    <span className="my-3 block text-2xl font-semibold">
                        $29 / mo
                    </span>

                    <CardDescription className="text-sm">
                        Ideal for teams & startups
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <hr className="border-dashed" />

                    <ul className="list-outside space-y-3 text-sm">
                        {[
                            'Everything in Pro Plan',
                            'Team expense management',
                            'Shared financial dashboards',
                            'Advanced reporting tools',
                            'Multi-user collaboration',
                            'Premium support access',
                        ].map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2">

                                <Check className="size-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                    <Button
                        asChild
                        variant="outline"
                        className="w-full">

                        <Link href="/login">
                            Get Started
                        </Link>

                    </Button>
                </CardFooter>
            </Card>

        </div>
    </div>
</section>
    )
}
