import { FileText, Shield, Lock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-base-100 px-4 py-8 lg:px-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-[0.2em] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Cashnivo
                    </p>
                    <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Please read these terms and conditions carefully before using Cashnivo expense tracker service.
                    </p>
                    <p className="text-sm text-base-content/50 mt-2">
                        Last Updated: May 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Introduction */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <FileText className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">1. Introduction</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                Welcome to Cashnivo! These Terms and Conditions ("Terms") govern your use of our expense tracking application and services. By accessing or using Cashnivo, you agree to be bound by these Terms.
                            </p>
                            <p>
                                Cashnivo is a personal finance management tool designed to help you track your income and expenses, manage categories, and gain insights into your financial habits.
                            </p>
                        </div>
                    </div>

                    {/* Acceptance of Terms */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-green-600 p-2 rounded-lg">
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">2. Acceptance of Terms</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                By creating an account and using Cashnivo, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                            </p>
                            <p>
                                If you do not agree to these Terms, please do not use our service.
                            </p>
                        </div>
                    </div>

                    {/* User Accounts */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-purple-600 p-2 rounded-lg">
                                <Shield className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">3. User Accounts</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p className="font-semibold text-base-content">Account Registration:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>You must provide accurate and complete information during registration</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>You must be at least 13 years old to use Cashnivo</li>
                                <li>One person or entity may not maintain more than one account</li>
                            </ul>
                            <p className="font-semibold text-base-content mt-4">Account Security:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>You are responsible for all activities that occur under your account</li>
                                <li>Notify us immediately of any unauthorized use of your account</li>
                                <li>We are not liable for any loss or damage arising from your failure to maintain account security</li>
                            </ul>
                        </div>
                    </div>

                    {/* Service Usage */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-cyan-600 p-2 rounded-lg">
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">4. Permitted Use</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>You may use Cashnivo to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Track your personal income and expenses</li>
                                <li>Create and manage custom categories</li>
                                <li>View financial statistics and reports</li>
                                <li>Manage your transaction history</li>
                            </ul>
                        </div>
                    </div>

                    {/* Prohibited Activities */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-red-600 p-2 rounded-lg">
                                <XCircle className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">5. Prohibited Activities</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>You agree NOT to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Use the service for any illegal or unauthorized purpose</li>
                                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                                <li>Upload malicious code, viruses, or any harmful content</li>
                                <li>Interfere with or disrupt the service or servers</li>
                                <li>Use automated systems or bots to access the service</li>
                                <li>Reverse engineer, decompile, or disassemble any part of the service</li>
                                <li>Share your account credentials with others</li>
                                <li>Use the service to store or transmit illegal content</li>
                            </ul>
                        </div>
                    </div>

                    {/* Data and Privacy */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <Lock className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">6. Data and Privacy</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p className="font-semibold text-base-content">Your Data:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>You retain ownership of all data you input into Cashnivo</li>
                                <li>We store your financial data securely using industry-standard encryption</li>
                                <li>We will never sell your personal or financial data to third parties</li>
                                <li>You can export or delete your data at any time</li>
                            </ul>
                            <p className="font-semibold text-base-content mt-4">Data Collection:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>We collect only the information necessary to provide our services</li>
                                <li>We use cookies and similar technologies to improve user experience</li>
                                <li>Please refer to our Privacy Policy for detailed information</li>
                            </ul>
                        </div>
                    </div>

                    {/* Intellectual Property */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-orange-600 p-2 rounded-lg">
                                <Shield className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">7. Intellectual Property</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                All content, features, and functionality of Cashnivo, including but not limited to text, graphics, logos, icons, images, and software, are the exclusive property of Cashnivo and are protected by copyright, trademark, and other intellectual property laws.
                            </p>
                            <p>
                                You may not copy, modify, distribute, sell, or lease any part of our service without our explicit written permission.
                            </p>
                        </div>
                    </div>

                    {/* Service Availability */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-yellow-600 p-2 rounded-lg">
                                <AlertCircle className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">8. Service Availability</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                We strive to provide uninterrupted service, but we do not guarantee that Cashnivo will be available at all times. We may experience downtime for maintenance, updates, or unforeseen technical issues.
                            </p>
                            <p>
                                We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
                            </p>
                        </div>
                    </div>

                    {/* Limitation of Liability */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-red-600 p-2 rounded-lg">
                                <AlertCircle className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">9. Limitation of Liability</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                Cashnivo is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the service.
                            </p>
                            <p>
                                We are not responsible for any financial decisions you make based on the data or insights provided by Cashnivo. You should consult with a qualified financial advisor for professional advice.
                            </p>
                        </div>
                    </div>

                    {/* Termination */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-gray-600 p-2 rounded-lg">
                                <XCircle className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">10. Termination</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                You may terminate your account at any time by contacting us or using the account deletion feature.
                            </p>
                            <p>
                                We reserve the right to suspend or terminate your account if you violate these Terms or engage in any prohibited activities.
                            </p>
                            <p>
                                Upon termination, your right to use the service will immediately cease, and we may delete your data in accordance with our data retention policies.
                            </p>
                        </div>
                    </div>

                    {/* Changes to Terms */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-teal-600 p-2 rounded-lg">
                                <FileText className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">11. Changes to Terms</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                We reserve the right to modify these Terms at any time. We will notify you of any significant changes by email or through the service.
                            </p>
                            <p>
                                Your continued use of Cashnivo after changes are made constitutes your acceptance of the new Terms.
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <FileText className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">12. Contact Us</h2>
                            </div>
                        </div>
                        <div className="space-y-3 text-base-content/80">
                            <p>
                                If you have any questions or concerns about these Terms and Conditions, please contact us:
                            </p>
                            <div className="bg-base-100 p-4 rounded-lg border border-base-300">
                                <p className="font-semibold text-base-content">Cashnivo Support</p>
                                <p>Email: support@cashnivo.com</p>
                                <p>Website: www.cashnivo.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Agreement */}
                    <div className="card bg-gradient-to-r from-blue-600 to-cyan-600 border-none shadow-lg p-6 text-white">
                        <div className="flex items-start gap-3">
                            <CheckCircle size={24} className="shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">Agreement</h3>
                                <p className="text-white/90">
                                    By using Cashnivo, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. Thank you for choosing Cashnivo to manage your finances!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
