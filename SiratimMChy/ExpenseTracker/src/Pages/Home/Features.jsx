import { Wallet, FolderOpen } from 'lucide-react';
import { SiMoneygram } from 'react-icons/si';



const Features = () => {
    return (
        <section className="bg-base-100 px-4 py-20 lg:px-10">
            <div className="max-w-7xl mx-auto">
                {/* header section */}
                <div className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">
                        Features
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-base-content mt-2">
                        Why Choose Cashnivo
                    </h2>
                    <p className="mt-4 text-base-content/70 max-w-2xl mx-auto">
                        Simple tools that actually help you manage money better
                    </p>
                </div>

                {/* cards */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* card 1 */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Wallet className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-base-content">
                            Easy Transaction Tracking
                        </h3>
                        <p className="text-base-content/70 leading-relaxed">
                            Add your expenses and income quickly. No complicated forms, just the info you need to stay on top of your spending.
                        </p>
                    </div>

                    {/* card 2 */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <FolderOpen className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-base-content">
                            Custom Categories
                        </h3>
                        <p className="text-base-content/70 leading-relaxed">
                            Create categories that make sense for your life. Whether it's groceries, rent, or that coffee habit - organize it your way.
                        </p>
                    </div>

                    {/* card 3 */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-green-600 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <SiMoneygram className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-base-content">
                            See Where Your Money Goes
                        </h3>
                        <p className="text-base-content/70 leading-relaxed">
                            Get a clear picture of your spending habits. Our dashboard shows you exactly where every dollar went so you can make better choices.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
