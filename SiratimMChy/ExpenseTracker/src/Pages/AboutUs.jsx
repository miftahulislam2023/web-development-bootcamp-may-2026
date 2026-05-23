import { Link } from 'react-router';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-base-100 px-4 py-8 lg:px-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">
                        Cashnivo
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mt-2">
                        About Us
                    </h1>
                    <p className="mt-4 text-base-content/70 max-w-2xl mx-auto">
                        Learn more about Cashnivo, your smart expense tracking companion.
                    </p>
                </div>

                {/* Content */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* What is Cashnivo */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <h2 className="text-2xl font-semibold mb-4">What is Cashnivo?</h2>
                        <p className="text-base-content/70 leading-relaxed">
                            Cashnivo is a modern expense tracking application designed to help individuals and families manage their finances effortlessly. 
                            With intuitive features for adding expenses, incomes, and categories, we make budgeting simple and effective.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                        <ul className="list-disc list-inside space-y-2 text-base-content/70">
                            <li>Track expenses and incomes in real-time</li>
                            <li>Organize with customizable categories</li>
                            <li>View detailed dashboards and reports</li>
                            <li>Secure user authentication and data storage</li>
                            <li>Responsive design for all devices</li>
                        </ul>
                    </div>

                    {/* Our Mission */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-base-content/70 leading-relaxed">
                            Our mission is to empower users with financial awareness through simple, powerful tools. 
                            We believe everyone deserves control over their money, and we're here to make that possible.
                        </p>
                    </div>

                    {/* Try Other Features */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <h2 className="text-2xl font-semibold mb-4">Try Other Features</h2>
                        <p className="text-base-content/70 leading-relaxed mb-4">
                            Explore Cashnivo's full suite of tools to manage your budget, track spending trends, and stay financially organized.
                        </p>
                        <Link
                            to="/"
                            className="btn bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none"
                        >
                            Explore Features
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;