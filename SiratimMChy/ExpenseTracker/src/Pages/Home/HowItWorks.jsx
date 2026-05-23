import { UserPlus, PlusCircle, LayoutDashboard } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: UserPlus,
        title: 'Create your account',
        description:
            'Sign up in seconds with your email. No credit card, no setup hassle — just log in and you\'re ready to go.',
    },
    {
        number: '02',
        icon: PlusCircle,
        title: 'Log your transactions',
        description:
            'Add your daily expenses and incomes with a category and amount. Takes less than 10 seconds per entry.',
    },
    {
        number: '03',
        icon: LayoutDashboard,
        title: 'See the full picture',
        description:
            'Your dashboard updates instantly. Spot patterns, track your balance, and make smarter money decisions.',
    },
];

const HowItWorks = () => {
    return (
        <section className="bg-base-600 px-4 py-20 lg:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-14 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">
                        How it works
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-base-content mt-2">
                        Up and running in minutes
                    </h2>
                    <p className="mt-4 text-base-content/70 max-w-xl mx-auto">
                        No learning curve. Three simple steps and your finances are already more organised than yesterday.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative grid gap-8 md:grid-cols-3">

                    {/* Connector line — desktop only */}
                    <div className="hidden md:block absolute top-10 left-[calc(16.66%+1.75rem)] right-[calc(16.66%+1.75rem)] h-px bg-gradient-to-r from-blue-600/30 via-cyan-500/50 to-blue-600/30" />

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={i}
                                className="relative flex flex-col items-center text-center group"
                            >
                                {/* Icon circle */}
                                <div className="relative mb-6 z-10">
                                    <div className="w-20 h-20 rounded-full bg-base-100 border-2 border-base-content/10 shadow-md flex items-center justify-center group-hover:border-blue-500 group-hover:shadow-blue-500/20 group-hover:shadow-lg transition-all duration-300">
                                        <Icon className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                                    </div>
                                    {/* Step number badge */}
                                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                                        {i + 1}
                                    </span>
                                </div>

                                {/* Text */}
                                <div className="card bg-base-100 border border-base-content/10 shadow-sm p-6 w-full group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                                    <p className="text-xs uppercase tracking-widest text-blue-600/70 font-bold mb-2">
                                        Step {step.number}
                                    </p>
                                    <h3 className="text-xl font-bold text-base-content mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-base-content/70 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;