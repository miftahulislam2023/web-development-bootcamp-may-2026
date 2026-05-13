export default function About() {
    return (
       <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
    <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">

            <div className="text-center lg:text-left">
                <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                    Frequently <br className="hidden lg:block" />
                    Asked <br className="hidden lg:block" />
                    Questions
                </h2>

                <p className="text-muted-foreground">
                    Everything you need to know about managing expenses, budgets, and your account.
                </p>
            </div>

            <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">

                {/* Question 1 */}
                <div className="pb-6">
                    <h3 className="font-medium">
                        Is Expense Tracker free to use?
                    </h3>

                    <p className="text-muted-foreground mt-4">
                        Yes, you can start using Expense Tracker for free to manage your daily expenses and financial activities.
                    </p>

                    <ol className="list-outside list-decimal space-y-2 pl-4">
                        <li className="text-muted-foreground mt-4">
                            Track income and expenses easily.
                        </li>

                        <li className="text-muted-foreground mt-4">
                            View spending insights and summaries.
                        </li>

                        <li className="text-muted-foreground mt-4">
                            Upgrade options may be added in future for advanced analytics and features.
                        </li>
                    </ol>
                </div>

                {/* Question 2 */}
                <div className="py-6">
                    <h3 className="font-medium">
                        Can I access my expense history anytime?
                    </h3>

                    <p className="text-muted-foreground mt-4">
                        Yes, your transactions and expense history are securely stored and accessible anytime from your dashboard.
                    </p>
                </div>

                {/* Question 3 */}
                <div className="py-6">
                    <h3 className="font-medium">
                        Can I manage different expense categories?
                    </h3>

                    <p className="text-muted-foreground my-4">
                        Absolutely. You can organize expenses into categories to better understand your spending habits.
                    </p>

                    <ul className="list-outside list-disc space-y-2 pl-4">
                        <li className="text-muted-foreground">
                            Track categories like Food, Transport, Bills, Shopping, and more.
                        </li>

                        <li className="text-muted-foreground">
                            Analyze category-based spending with reports and insights.
                        </li>
                    </ul>
                </div>

                {/* Question 4 */}
                <div className="py-6">
                    <h3 className="font-medium">
                        Is my financial data secure?
                    </h3>

                    <p className="text-muted-foreground mt-4">
                        Yes, we prioritize data security and ensure your account information and financial records remain protected.
                    </p>
                </div>

            </div>
        </div>
    </div>
</section>
    )
}
