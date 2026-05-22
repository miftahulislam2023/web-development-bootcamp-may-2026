import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, Sparkles, Check, X, ArrowRight, Rocket, Star, Users, Cloud, Database, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/seo/SEO";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (!credentialResponse.credential) return;
        setIsLoading(true);
        setError("");
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            navigate("/", { replace: true });
        } else {
            setError(result.error || "Google registration failed");
        }
        setIsLoading(false);
    };

    // Password strength checks
    const passwordChecks = {
        length: password.length >= 6,
        match: password === confirmPassword && confirmPassword.length > 0,
    };

    const canSubmit = name && email && password && passwordChecks.length && passwordChecks.match;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!passwordChecks.length) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!passwordChecks.match) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        const result = await register(name, email, password);

        if (result.success) {
            navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
        } else {
            setError(result.error || "Registration failed");
        }

        setIsLoading(false);
    };

    const highlights = [
        { icon: Rocket, title: "Get Started Fast", desc: "Set up in under 2 minutes" },
        { icon: Star, title: "Free Forever", desc: "Core features always free" },
        { icon: Users, title: "Join 1K+ Users", desc: "Growing community" },
    ];

    return (
        <div className="min-h-screen flex bg-background">
            <SEO title="Register" description="Create a new LifeSolver account to get started." />

            {/* Left Branding Panel — hidden on mobile */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden flex-col justify-between p-10">
                {/* Dark cosmic gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />

                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }} />

                {/* Floating orbs */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-16 right-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-24 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 w-56 h-56 bg-teal-500/10 rounded-full blur-[80px]"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg shadow-emerald-500/10">
                            <img src="/logo.svg" alt="LifeSolver" className="w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">LifeSolver</span>
                    </motion.div>
                </div>

                {/* Main visual area */}
                <div className="relative z-10 flex-1 flex flex-col justify-center -mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-emerald-300/80 text-sm font-semibold uppercase tracking-[0.2em] mb-3">Get started free</p>
                        <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4">
                            One app for<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400">your entire life.</span>
                        </h2>
                        <p className="text-white/50 text-base max-w-sm leading-relaxed">
                            Tasks, finances, notes, and AI — beautifully unified.
                        </p>
                    </motion.div>

                    {/* Orbital Ring System */}
                    <div className="mt-10 relative w-full max-w-[420px] h-[300px]">
                        {/* Orbital rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px]">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-white/10"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-30px] rounded-full border border-white/[0.06] border-dashed"
                            />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-60px] rounded-full border border-white/[0.04]"
                            />
                        </div>

                        {/* Center brain node */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 z-30"
                        >
                            <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/50 border border-emerald-400/30">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-2xl border-2 border-emerald-400/40"
                            />
                        </motion.div>

                        {/* Orbiting Nodes */}
                        {[
                            { icon: Check, label: "Tasks", color: "from-blue-500 to-indigo-600", border: "border-blue-400/30", shadow: "shadow-blue-900/50", angle: 0, radius: 120, delay: 0.8 },
                            { icon: Database, label: "Finance", color: "from-emerald-500 to-green-600", border: "border-emerald-400/30", shadow: "shadow-emerald-900/50", angle: 120, radius: 120, delay: 1.0 },
                            { icon: Sparkles, label: "Notes", color: "from-amber-500 to-orange-600", border: "border-amber-400/30", shadow: "shadow-amber-900/50", angle: 240, radius: 120, delay: 1.2 },
                        ].map((node, i) => {
                            const x = Math.cos((node.angle * Math.PI) / 180) * node.radius;
                            const y = Math.sin((node.angle * Math.PI) / 180) * node.radius;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                                    transition={{
                                        opacity: { delay: node.delay, duration: 0.5 },
                                        scale: { delay: node.delay, type: "spring", stiffness: 200 },
                                        y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: node.delay + 0.5 }
                                    }}
                                    className="absolute z-20"
                                    style={{
                                        top: `calc(50% + ${y}px - 24px)`,
                                        left: `calc(50% + ${x}px - 24px)`,
                                    }}
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${node.color} rounded-xl flex items-center justify-center shadow-lg ${node.shadow} border ${node.border}`}>
                                        <node.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-white/60 text-[10px] font-semibold text-center mt-1.5 uppercase tracking-wider">{node.label}</p>
                                </motion.div>
                            );
                        })}

                        {/* Animated connection lines */}
                        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                            {[0, 120, 240].map((angle, i) => {
                                const x = Math.cos((angle * Math.PI) / 180) * 120;
                                const y = Math.sin((angle * Math.PI) / 180) * 120;
                                return (
                                    <motion.line
                                        key={i}
                                        x1="50%" y1="50%"
                                        x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`}
                                        stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                                        strokeDasharray="4 4"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 1.5 + i * 0.2, duration: 1 }}
                                    />
                                );
                            })}
                        </svg>

                        {/* Floating feature pills */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
                            transition={{ opacity: { delay: 1.8 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 } }}
                            className="absolute -right-2 top-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5 shadow-lg"
                        >
                            <p className="text-white/70 text-[10px] font-semibold">🚀 Set up in 2 min</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0, y: [0, 5, 0] }}
                            transition={{ opacity: { delay: 2.2 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 } }}
                            className="absolute -left-2 bottom-12 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5 shadow-lg"
                        >
                            <p className="text-white/70 text-[10px] font-semibold">⭐ Free forever</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: [0, -3, 0] }}
                            transition={{ opacity: { delay: 2.5 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 } }}
                            className="absolute right-4 bottom-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full px-3 py-1.5 shadow-lg shadow-emerald-900/50 border border-emerald-400/20"
                        >
                            <p className="text-white text-[10px] font-semibold">👥 1K+ Users</p>
                        </motion.div>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-white/30 text-sm">© 2026 LifeSolver. All rights reserved.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex items-start lg:items-center justify-center px-4 py-6 sm:p-8 relative overflow-y-auto min-h-screen lg:min-h-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)', paddingTop: 'env(safe-area-inset-top, 16px)' }}>
                {/* Mobile-only background blobs */}
                <div className="lg:hidden fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px] relative z-10 my-auto py-2"
                >
                    {/* Header Card */}
                    <div className="rounded-2xl sm:rounded-3xl border border-violet-300/60 dark:border-violet-500/30 bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-sm mb-3 sm:mb-4">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-4 sm:mb-5">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center gap-2.5 mb-3"
                            >
                                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                                    <img src="/logo.svg" alt="LifeSolver" className="w-7 h-7 object-contain" />
                                </div>
                                <span className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-400">LifeSolver</span>
                            </motion.div>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Create account</h1>
                            <p className="text-muted-foreground mt-1 sm:mt-1.5 text-sm sm:text-base">Fill in your details to get started.</p>
                        </div>
                    </div>

                    {/* Google Card - Temporarily Hidden
                    <div className="rounded-2xl sm:rounded-3xl border border-violet-300/60 dark:border-violet-500/30 bg-card/60 backdrop-blur-sm p-4 sm:p-5 shadow-sm mb-3 sm:mb-4">
                        <div className="relative h-12 w-full rounded-full overflow-hidden">
                            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center gap-3 rounded-full bg-foreground text-background font-semibold text-sm border border-border/20 shadow-sm">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </div>
                            <div className="absolute inset-x-0 inset-y-[-10px] z-20 opacity-0 cursor-pointer overflow-hidden flex items-center justify-center [&>div]:!w-full [&>div]:!min-w-full [&>div]:!h-full [&>div]:!min-h-full [&_iframe]:!w-full [&_iframe]:!min-w-full [&_iframe]:!h-[60px] [&_div[role=button]]:!h-full [&_div[role=button]]:!w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Google Registration Failed")}
                                    shape="rectangular"
                                    theme="filled_black"
                                    size="large"
                                    width="400"
                                    ux_mode="popup"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-3 sm:mb-5">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-violet-200/60 dark:border-violet-500/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-3 text-muted-foreground font-medium tracking-wider">
                                or register with email
                            </span>
                        </div>
                    </div>
                    */}

                    {/* Form Card */}
                    <div className="rounded-2xl sm:rounded-3xl border border-violet-300/60 dark:border-violet-500/30 bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 px-5"
                                >
                                    <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Adnan Shahria"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    className="h-11 sm:h-12 rounded-full bg-background border-border/50 focus:border-primary transition-colors px-4 sm:px-5 text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="h-11 sm:h-12 rounded-full bg-background border-border/50 focus:border-primary transition-colors px-4 sm:px-5 text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="h-11 sm:h-12 pr-12 rounded-full bg-background border-border/50 focus:border-primary transition-colors px-4 sm:px-5 text-sm sm:text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary/50"
                                    >
                                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    className="h-11 sm:h-12 rounded-full bg-background border-border/50 focus:border-primary transition-colors px-4 sm:px-5 text-sm sm:text-base"
                                />
                            </div>

                            {/* Password Strength Indicators */}
                            {password && (
                                <div className="space-y-1.5 pt-1">
                                    <div className={`flex items-center gap-2 text-sm ${passwordChecks.length ? "text-emerald-500" : "text-muted-foreground"}`}>
                                        {passwordChecks.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        <span>At least 6 characters</span>
                                    </div>
                                    {confirmPassword && (
                                        <div className={`flex items-center gap-2 text-sm ${passwordChecks.match ? "text-emerald-500" : "text-red-400"}`}>
                                            {passwordChecks.match ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            <span>Passwords match</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-11 sm:h-12 text-sm sm:text-base rounded-full font-semibold group mt-1 sm:mt-2 bg-blue-800 hover:bg-blue-900 text-white" disabled={isLoading || !canSubmit}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="flex justify-center mt-3 sm:mt-5">
                        <Link to="/login" className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-blue-800 hover:bg-blue-900 py-2.5 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm font-medium text-white/80 transition-colors shadow-sm">
                            Already have an account?
                            <span className="bg-white text-blue-800 font-semibold px-3 py-1 rounded-full text-xs">Sign in</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div >
    );
}
