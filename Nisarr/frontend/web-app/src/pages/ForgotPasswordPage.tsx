import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/seo/SEO";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await forgotPassword(email);
        if (result.success) {
            setStep(2);
        } else {
            setError(result.error || "Failed to request reset");
        }
        setIsLoading(false);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setError("");
        setIsLoading(true);

        const result = await resetPassword(email, otpCode, newPassword);
        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } else {
            setError(result.error || "Failed to reset password");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <SEO title="Reset Password" description="Reset your LifeSolver password" />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            </div>

            <motion.div className="w-full max-w-md relative z-10 glass-card p-8">
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
                            <p className="text-muted-foreground mb-6">You can now login with your new password.</p>
                            <Button onClick={() => navigate("/login")} className="w-full">Return to Login</Button>
                        </motion.div>
                    ) : step === 1 ? (
                        <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
                                <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset code.</p>
                            </div>
                            <form onSubmit={handleRequestOtp} className="space-y-4">
                                {error && <div className="p-3 bg-destructive/20 text-destructive rounded-lg text-sm text-center">{error}</div>}
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="h-12"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
                                </Button>
                                <div className="text-center mt-4 text-sm">
                                    <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                                <p className="text-muted-foreground text-sm">Enter the code sent to {email}</p>
                            </div>
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                {error && <div className="p-3 bg-destructive/20 text-destructive rounded-lg text-sm text-center">{error}</div>}

                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => inputRefs.current[index] = el}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-2xl font-bold bg-background/50 border border-black/[0.08] dark:border-white/[0.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="h-12 pl-10"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12" disabled={isLoading || otp.join("").length !== 6 || newPassword.length < 6}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
