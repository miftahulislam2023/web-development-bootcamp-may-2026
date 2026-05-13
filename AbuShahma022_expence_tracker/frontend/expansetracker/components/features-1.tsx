import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
    <div className="@container mx-auto max-w-5xl px-6">

        <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                Built to simplify your finances
            </h2>

            <p className="text-muted-foreground mt-4">
                Track expenses, manage budgets, and gain valuable financial insights with a clean and modern experience.
            </p>
        </div>

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">

            {/* Feature 1 */}
            <Card className="group shadow-zinc-950/5">

                <CardHeader className="pb-3">

                    <CardDecorator>
                        <Zap
                            className="size-6"
                            aria-hidden
                        />
                    </CardDecorator>

                    <h3 className="mt-6 font-medium">
                        Smart Expense Tracking
                    </h3>

                </CardHeader>

                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Easily record and organize your daily expenses to stay in control of your financial activities.
                    </p>
                </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group shadow-zinc-950/5">

                <CardHeader className="pb-3">

                    <CardDecorator>
                        <Settings2
                            className="size-6"
                            aria-hidden
                        />
                    </CardDecorator>

                    <h3 className="mt-6 font-medium">
                        Full Budget Control
                    </h3>

                </CardHeader>

                <CardContent>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Manage budgets, monitor spending habits, and customize expense categories based on your needs.
                    </p>
                </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group shadow-zinc-950/5">

                <CardHeader className="pb-3">

                    <CardDecorator>
                        <Sparkles
                            className="size-6"
                            aria-hidden
                        />
                    </CardDecorator>

                    <div className="flex items-center justify-center gap-2">
                        <h3 className="mt-6 font-medium">
                            AI Financial Insights
                        </h3>

                        <span className="mt-6 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Coming Soon
                        </span>
                    </div>

                </CardHeader>

                <CardContent>
                    <p className="mt-3 text-sm text-muted-foreground">
                        AI-powered insights and spending analysis to help you make smarter financial decisions.
                    </p>
                </CardContent>
            </Card>

        </div>
    </div>
</section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
