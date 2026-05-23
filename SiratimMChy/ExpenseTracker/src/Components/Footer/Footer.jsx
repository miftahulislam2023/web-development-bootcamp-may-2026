import { Link } from 'react-router';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import logo from '../../assets/logo.png';

const Footer = () => {
    return (
        <div className="w-full bg-base-200 px-6 pt-10 pb-5 border-t border-base-300 lg:px-30 mx-auto">
            <footer className="footer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-20 text-base-content pb-10">
                <aside>
                    <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4 hover:opacity-90 transition-opacity">
                        <img src={logo} alt="Cashnivo Logo" className="w-10 h-10" />
                        <span>Cashnivo</span>
                    </Link>
                    <p className="max-w-md text-base-content/80 mb-4 text-sm leading-relaxed">
                        Manage your expenses smarter. Track spending, set budgets, and achieve your financial goals with ease.
                    </p>
                </aside>

                {/* Quick Links */}
                <nav>
                    <h6 className="text-base-content text-lg font-semibold mb-4">Navigation</h6>
                    <ul className="space-y-3">
                        <li>
                            <Link
                                to="/"
                                className="text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                            >
                                Home
                            </Link>
                        </li>
                       
                        <li>
                            <Link
                                to="/dashboard/dashboardhome"
                                className="text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                        </li>
                         <li>
                            <Link
                                to="/categories"
                                className="text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                            >
                                Categories
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Company */}
                <nav>
                    <h6 className="text-base-content text-lg font-semibold mb-4">Company</h6>
                    <ul className="space-y-3">
                        
                        <li>
                            <Link
                                to="/about-us"
                                className="text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                            >
                               Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms-conditions"
                                className="text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                            >
                                Terms & Conditions
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Contact Info */}
                <nav>
                    <h6 className="text-base-content text-lg font-semibold mb-4">Contact Us</h6>
                    <div className="space-y-3">
                        <a
                            href="mailto:info@cashnivo.com"
                            className="flex items-center gap-2 text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                        >
                            <MdEmail className="w-5 h-5 shrink-0" />
                            <span>info@cashnivo.com</span>
                        </a>
                        <a
                            href="tel:+8801234567890"
                            className="flex items-center gap-2 text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200"
                        >
                            <MdPhone className="w-5 h-5 shrink-0" />
                            <span>+880 1777-76677777</span>
                        </a>
                        <div className="flex items-start gap-2 text-base-content/80 text-sm font-semibold hover:text-blue-600 transition-colors duration-200">
                            <MdLocationOn className="w-5 h-5 mt-0.5 shrink-0" />
                            <span>Sylhet, Bangladesh</span>
                        </div>
                    </div>
                </nav>
            </footer>

            {/* Bottom Bar */}
            <div className="border-t border-base-content/20 pt-6 text-center text-base-content/70 text-sm">
                <p>© {new Date().getFullYear()} Cashnivo -- All Rights Reserved.</p>
            </div>
        </div>
    );
};

export default Footer;