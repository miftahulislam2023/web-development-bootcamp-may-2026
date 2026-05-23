import { Link } from 'react-router';
import { ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';

const perks = [
    { icon: <Zap size={15} />, text: 'Free forever' },
    { icon: <ShieldCheck size={15} />, text: 'Secure & private' },
    { icon: <RefreshCw size={15} />, text: 'Always up to date' },
];

const CTABanner = () => {
    const { user } = useContext(AuthContext);

    return (
        <section className="bg-base-100 px-4 py-20 lg:px-10">
            <div className="max-w-5xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-8 py-14 lg:px-16 lg:py-20 text-center">

                    {/* Decorative blurs */}
                    <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

                    {/* Content */}
                    <div className="relative">
                        <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold mb-4">
                            {user ? 'Welcome back' : 'Get started today'}
                        </p>
                        <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            Stop wondering where<br className="hidden sm:block" />
                            your money went.
                        </h2>
                        <p className="text-white/50 text-sm lg:text-base max-w-xl mx-auto mb-10 leading-relaxed">
                            {user
                                ? 'Your dashboard is ready. Track your spending, review your categories, and stay on top of your finances.'
                                : 'Join thousands of people who use Cashnivo to take back control of their finances — one transaction at a time.'
                            }
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard/dashboardhome"
                                        className="btn bg-white text-slate-900 hover:bg-blue-50 border-none font-bold px-8 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                                    >
                                        Go to Dashboard
                                        <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                    <Link
                                        to="/dashboard/add-transaction"
                                        className="btn btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-semibold px-8 transition-all duration-200"
                                    >
                                        Add Transaction
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn bg-white text-slate-900 hover:bg-blue-50 border-none font-bold px-8 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                                    >
                                        Create Free Account
                                        <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                    <Link
                                        to="/about-us"
                                        className="btn btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-semibold px-8 transition-all duration-200"
                                    >
                                        Learn More
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Perks */}
                        <div className="flex flex-wrap items-center justify-center gap-5">
                            {perks.map((perk, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-white/40 text-xs font-semibold">
                                    <span className="text-white/30">{perk.icon}</span>
                                    {perk.text}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CTABanner;