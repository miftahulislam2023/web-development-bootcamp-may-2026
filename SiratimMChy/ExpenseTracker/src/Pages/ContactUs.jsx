import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

const ContactUs = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setForm({ name: '', email: '', subject: '', message: '' });
        toast.success('Thank you for reaching out. We will review your message shortly.');
    };

    return (
        <div className="min-h-screen bg-base-100 px-4 py-10 lg:px-10">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">
                        Cashnivo
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mt-3">
                        Contact Us
                    </h1>
                    <p className="mt-4 text-base-content/70 max-w-2xl mx-auto">
                        Have a question or need support? Send us a message and our team will respond as soon as possible.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-8">
                        <h2 className="text-2xl font-semibold mb-4">Send a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <label className="flex flex-col gap-2">
                                <span className="font-semibold text-base-content">Your Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-semibold text-base-content">Email Address</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-semibold text-base-content">Subject</span>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="What can we help you with?"
                                    className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-semibold text-base-content">Message</span>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Write your message here..."
                                    className="textarea textarea-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                            </label>

                            <button
                                type="submit"
                                className="btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-8">
                        <h2 className="text-2xl font-semibold mb-4">Contact details</h2>
                        <div className="space-y-6 text-base-content/80">
                            <div>
                                <p className="font-semibold text-base-content mb-2">Customer support</p>
                                <p>support@cashnivo.com</p>
                                <p>+880 1777-76677777</p>
                            </div>
                            <div>
                                <p className="font-semibold text-base-content mb-2">Office hours</p>
                                <p>Monday - Friday</p>
                                <p>9:00 AM - 6:00 PM</p>
                            </div>
                            <div>
                                <p className="font-semibold text-base-content mb-2">Address</p>
                                <p>kumarpara house-6</p>
                                <p>Block-C</p>
                                <p>Sylhet, Sylhet-3100</p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-base-content/10 pt-6">
                            <p className="text-sm text-base-content/60 mb-3">Need immediate help?</p>
                            <Link
                                to="/about-us"
                                className="btn btn-outline w-full border-blue-500 text-blue-600 hover:bg-blue-500/10"
                            >
                                Learn more about Cashnivo
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

