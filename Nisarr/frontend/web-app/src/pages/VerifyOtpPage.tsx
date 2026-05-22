import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/seo/SEO";

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";

    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            if (pastedData.length < 6) {
                inputRefs.current[pastedData.length]?.focus();
            } else {
                inputRefs.current[5]?.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setError("");
        setIsLoading(true);

        const result = await verifyOtp(email, otpCode);

        if (result.success) {
            navigate("/", { replace: true });
        } else {
            setError(result.error || "Verification failed");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <SEO title="Verify Email" description="Verify your email address" />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 mb-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <KeyRound className="w-6 h-6 text-background" />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-2">Check your email</h1>
                    <p className="text-muted-foreground">We sent a 6-digit code to <br /><span className="font-medium text-foreground">{email}</span></p>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-3 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-background/50 border border-black/[0.08] dark:border-white/[0.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            ))}
                        </div>

                        <Button type="submit" className="w-full h-12 text-base" disabled={isLoading || otp.join("").length !== 6}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Account"
                            )}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
