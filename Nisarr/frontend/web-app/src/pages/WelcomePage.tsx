import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import {
    Sparkles, Brain, ListTodo, Wallet, BookOpen, Target,
    ArrowRight, Zap, Shield, BarChart3, Clock, Flame,
    ChevronDown, Star, Package, Sun, Moon, Snowflake,
    Gauge, WifiOff, Download, Menu, X, Globe, Layers, Trophy, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/translations";

// ❄️ Snowflake particle — falls from top with gentle sway
function SnowParticle({ delay, startX, size, duration, drift }: {
    delay: number; startX: number; size: number; duration: number; drift: number;
}) {
    return (
        <motion.div
            className="absolute top-0 rounded-full pointer-events-none"
            style={{
                left: `${startX}%`,
                width: size,
                height: size,
                background: `radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(200, 230, 255, 0.4) 100%)`,
                boxShadow: `0 0 ${size * 2}px rgba(180, 220, 255, 0.3)`,
            }}
            animate={{
                y: ["0vh", "105vh"],
                x: [0, drift, -drift * 0.5, drift * 0.7, 0],
                opacity: [0, 1, 1, 1, 0],
                rotate: [0, 360],
            }}
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
                x: { duration: duration * 0.8, repeat: Infinity, ease: "easeInOut" },
            }}
        />
    );
}

// ❄️ Snowfall layer — generates many snowflakes
function SnowfallLayer() {
    const snowflakes = useMemo(() =>
        Array.from({ length: 35 }, (_, i) => ({
            id: i,
            delay: Math.random() * 12,
            startX: Math.random() * 100,
            size: 2 + Math.random() * 5,
            duration: 8 + Math.random() * 10,
            drift: 15 + Math.random() * 30,
        })), []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {snowflakes.map((flake) => (
                <SnowParticle key={flake.id} {...flake} />
            ))}
        </div>
    );
}

// Feature card with frost hover
function FeatureCard({ icon: Icon, title, description, gradient, delay }: {
    icon: any; title: string; description: string; gradient: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="glass-card-hover p-4 sm:p-6 group cursor-default frost-card flex flex-col items-center sm:items-start text-center sm:text-left"
        >
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    );
}

// Stat counter
function StatCounter({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            className="text-center"
        >
            <div className="text-4xl md:text-5xl font-bold text-gradient-ice mb-1">{value}{suffix}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </motion.div>
    );
}

export default function WelcomePage() {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
    const [activeSection, setActiveSection] = useState<string>('');

    // 3D Tilt Effect State
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]), { damping: 30, stiffness: 200 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]), { damping: 30, stiffness: 200 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXOffset = e.clientX - rect.left;
        const mouseYOffset = e.clientY - rect.top;
        const xPct = mouseXOffset / width - 0.5;
        const yPct = mouseYOffset / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    // Scroll spy — track which section is in view
    useEffect(() => {
        const sectionIds = ['features', 'orbit-ai', 'why'];
        const observers: IntersectionObserver[] = [];

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const features = [
        { icon: ListTodo, title: t.features.list[0].title, description: t.features.list[0].desc, gradient: "bg-gradient-to-br from-sky-400 to-blue-600" },
        { icon: Wallet, title: t.features.list[1].title, description: t.features.list[1].desc, gradient: "bg-gradient-to-br from-teal-400 to-cyan-600" },
        { icon: BookOpen, title: t.features.list[2].title, description: t.features.list[2].desc, gradient: "bg-gradient-to-br from-indigo-400 to-violet-600" },
        { icon: Target, title: t.features.list[3].title, description: t.features.list[3].desc, gradient: "bg-gradient-to-br from-cyan-400 to-blue-500" },
        { icon: Package, title: t.features.list[4].title, description: t.features.list[4].desc, gradient: "bg-gradient-to-br from-blue-400 to-indigo-600" },
        { icon: Brain, title: t.features.list[5].title, description: t.features.list[5].desc, gradient: "bg-gradient-to-br from-slate-400 to-sky-600" },
    ];

    return (
        <main className="min-h-screen bg-background overflow-hidden">
            <SEO title="Welcome to LifeSolver" description="Your AI-powered personal operating system. Manage tasks, finances, studies, habits, and more — all in one place." />

            {/* ===== SNOWFALL (Dark Mode Only) ===== */}
            {theme === 'dark' && <SnowfallLayer />}

            {/* ===== ICE ATMOSPHERE BACKGROUND (Dark Mode Only) ===== */}
            {theme === 'dark' && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {/* Aurora-like ice glow blobs */}
                    <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full blur-[160px]"
                        style={{ background: "radial-gradient(circle, rgba(77,208,225,0.12) 0%, transparent 70%)" }} />
                    <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full blur-[120px]"
                        style={{ background: "radial-gradient(circle, rgba(128,222,234,0.08) 0%, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px]"
                        style={{ background: "radial-gradient(circle, rgba(176,190,255,0.1) 0%, transparent 70%)" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[180px]"
                        style={{ background: "radial-gradient(circle, rgba(200,230,255,0.05) 0%, transparent 60%)" }} />
                </div>
            )}

            {/* ===== SKY ATMOSPHERE BACKGROUND (Light Mode Only) ===== */}
            {theme === 'light' && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 left-1/4 w-[800px] h-[800px] rounded-full blur-[180px]"
                        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)" }} />
                    <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-[140px]"
                        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-1/2 w-[700px] h-[700px] rounded-full blur-[160px]"
                        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
                </div>
            )}

            {/* ===== DESKTOP NAVBAR ===== */}
            <div className="hidden md:flex fixed top-4 left-0 right-0 z-50 justify-center pointer-events-none">
                <motion.nav
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                    className="glass-card rounded-full px-6 py-2.5 flex items-center justify-between gap-6 shadow-lg shadow-sky-900/5 border border-sky-300/15 dark:border-sky-400/10 backdrop-blur-xl pointer-events-auto w-auto"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0">
                            <img src="/logo.svg" alt="LifeSolver Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-lg tracking-tight whitespace-nowrap">LifeSolver</span>
                    </div>

                    {/* Center Links */}
                    <div className="flex items-center gap-1 bg-secondary/40 rounded-full px-1.5 py-1 border border-white/5 shrink-0">
                        {[t.nav.features, t.nav.orbit, t.nav.why].map((item, index) => {
                            const ids = ['features', 'orbit-ai', 'why'];
                            const id = ids[index];
                            const isActive = activeSection === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => {
                                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap shrink-0 ${isActive
                                        ? 'bg-gradient-to-r from-sky-400 to-cyan-500 text-white shadow-md shadow-sky-500/20'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                                        } `}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors font-medium text-xs shrink-0"
                            aria-label="Toggle language"
                        >
                            {language.toUpperCase()}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                        </button>
                        <div className="h-5 w-px bg-border/40 shrink-0" />
                        <Link to="/register" className="shrink-0 ml-1">
                            <Button size="sm" className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-md shadow-sky-500/20 px-5 h-9 text-sm whitespace-nowrap">
                                {t.nav.getStarted}
                            </Button>
                        </Link>
                    </div>
                </motion.nav>
            </div>

            {/* ===== MOBILE TOP NAVBAR ===== */}
            <div className="md:hidden fixed top-4 left-4 right-4 z-50 pointer-events-none flex justify-center">
                <motion.nav
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                    className="glass-card rounded-full px-4 py-2.5 flex items-center justify-between shadow-lg shadow-sky-900/5 border-2 border-violet-500/40 dark:border-violet-400/40 backdrop-blur-xl pointer-events-auto w-full max-w-sm bg-background/90"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0 overflow-hidden">
                            <img src="/logo.svg" alt="LifeSolver Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-sm tracking-tight whitespace-nowrap">LifeSolver</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={toggleTheme}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors border border-border/50 shrink-0"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center justify-center gap-1 h-8 px-3 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors font-medium text-xs border border-border/50 shrink-0"
                            aria-label="Toggle language"
                        >
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            {language === 'en' ? 'EN' : 'বাং'}
                        </button>
                    </div>
                </motion.nav>
            </div>

            {/* ===== MOBILE BOTTOM NAVBAR ===== */}
            <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <motion.nav
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
                    className="glass-card rounded-full px-3 py-2.5 flex items-center justify-center shadow-xl shadow-indigo-900/10 border-2 border-violet-500/40 dark:border-violet-400/40 backdrop-blur-xl pointer-events-auto bg-background/95"
                >
                    {[
                        { id: 'features', label: t.nav.features, icon: Layers },
                        { id: 'orbit-ai', label: t.nav.orbit, icon: MessageSquare },
                        { id: 'why', label: t.nav.why, icon: Trophy }
                    ].map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`flex items-center mx-1 rounded-full transition-all duration-300 ease-out overflow-hidden ${isActive
                                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2'
                                    : 'bg-transparent text-muted-foreground hover:text-foreground px-3 py-2'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                                <div className={`overflow-hidden transition-all duration-300 ease-out flex items-center ${isActive ? 'max-w-[120px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}`}>
                                    <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </motion.nav>
            </div>

            {/* ===== HERO SECTION ===== */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12"
            >
                {/* Animated badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm text-muted-foreground mb-8 border-sky-300/30 dark:border-sky-400/20 shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all cursor-default"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <Snowflake className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                    </motion.div>
                    <span className="font-medium text-foreground">{t.hero.badge}</span>
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-400/20 to-cyan-500/20 text-sky-600 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">v2.0</span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(15px)', y: 20 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.3 }}
                    className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-center max-w-5xl leading-[1.05] tracking-tight mb-8"
                >
                    {t.hero.titlePre}
                    <motion.span
                        className="text-gradient-ice inline-block ml-1"
                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: '200% auto' }}
                    >
                        {t.hero.titlePost}
                    </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="text-lg md:text-2xl text-muted-foreground text-center max-w-3xl mb-12 leading-relaxed font-medium"
                >
                    {t.hero.subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
                    className="flex flex-row items-center justify-center gap-3 sm:gap-6 mb-16 md:mb-24 px-4"
                >
                    <Link to="/register" className="block">
                        <Button className="w-[150px] h-[56px] sm:w-[200px] sm:h-[68px] relative group overflow-hidden bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-bold text-sm sm:text-lg rounded-2xl shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 transition-all duration-300 hover:scale-[1.03]">
                            <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                                {t.hero.ctaStart}
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
                                </motion.div>
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                        </Button>
                    </Link>
                    <Link to="/login" className="block">
                        <Button variant="outline" className="w-[150px] h-[56px] sm:w-[200px] sm:h-[68px] text-sm sm:text-lg rounded-2xl border-2 border-sky-200 dark:border-sky-800 bg-background/50 backdrop-blur-sm hover:bg-sky-50 dark:hover:bg-sky-900/40 hover:border-sky-400 transition-all duration-300 font-semibold text-foreground/80 hover:text-foreground">
                            {t.hero.ctaLogin}
                        </Button>
                    </Link>
                </motion.div>

                {/* Hero visual - Mock dashboard preview */}
                <motion.div
                    initial={{ opacity: 0, y: 80, rotateX: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    transition={{ delay: 0.9, duration: 1.2, type: "spring", bounce: 0.4 }}
                    className="relative w-full max-w-5xl z-10"
                    style={{ perspective: 1200 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="glass-card p-6 md:p-8 relative overflow-hidden frost-card rounded-[2rem] shadow-2xl shadow-sky-900/20 border border-sky-300/40 dark:border-sky-400/20 bg-background/60 backdrop-blur-2xl"
                    >
                        {/* Frost border glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-cyan-400/10 pointer-events-none" style={{ transform: "translateZ(-10px)" }} />

                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 dark:opacity-10"
                            animate={{ left: ['150%', '-50%'] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                        />

                        {/* Mock Dashboard Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 relative z-10">
                            {[
                                { label: t.stats.tasks, value: "24", icon: ListTodo, color: "text-sky-500 dark:text-sky-400", bg: "bg-sky-500/10" },
                                { label: t.stats.budget, value: "৳12.5K", icon: Wallet, color: "text-teal-500 dark:text-teal-400", bg: "bg-teal-500/10" },
                                { label: t.stats.study, value: "8.5h", icon: BookOpen, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-500/10" },
                                { label: t.stats.streak, value: "15🔥", icon: Flame, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-500/10" },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                                    whileHover={{ y: -5, scale: 1.05 }}
                                    className="glass-card p-5 text-center flex flex-col items-center justify-center rounded-2xl cursor-default transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10 border border-black/5 dark:border-white/5"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{item.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium mt-1">{item.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mock progress bars */}
                        <div className="space-y-4 relative z-10 bg-black/5 dark:bg-white/5 rounded-2xl p-5 md:p-6 border border-black/5 dark:border-white/5">
                            {[
                                { label: t.stats.goals, progress: 78, color: "from-sky-400 to-blue-600" },
                                { label: t.stats.savings, progress: 62, color: "from-teal-400 to-cyan-500" },
                            ].map((bar, i) => (
                                <div key={bar.label} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-muted-foreground w-28 shrink-0">{bar.label}</span>
                                    <div className="flex-1 h-3 md:h-4 bg-secondary/80 rounded-full overflow-hidden shadow-inner flex items-center">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${bar.progress}%` }}
                                            transition={{ delay: 1.6 + i * 0.2, duration: 1.5, ease: "easeOut" }}
                                            className={`h-full rounded-full bg-gradient-to-r ${bar.color} relative overflow-hidden`}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-white/20 blur-sm"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                                style={{ skewX: -20 }}
                                            />
                                        </motion.div>
                                    </div>
                                    <span className="text-sm font-bold text-foreground w-12 text-right">{bar.progress}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-6 flex flex-col items-center gap-2"
                >
                    <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground opacity-70">{t.hero.scroll}</span>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                        <ChevronDown className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* ===== STATS SECTION ===== */}
            <section className="relative py-20 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatCounter value="7" label="Modules" suffix="+" />
                    <StatCounter value="AI" label="Powered Assistant" />
                    <StatCounter value="100" label="Free to Use" suffix="%" />
                    <StatCounter value="24/7" label="Access Anywhere" />
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section id="features" className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/10 text-sky-400 text-sm font-medium mb-4">
                            <Star className="w-4 h-4" /> {t.features.badge}
                        </div>
                        <h2 className="text-[1.35rem] xs:text-2xl sm:text-3xl md:text-5xl font-bold mb-4 whitespace-nowrap tracking-tight">
                            {t.features.title}
                            <span className="text-gradient-ice">{t.features.titleHighlight}</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            {t.features.desc}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== AI HIGHLIGHT SECTION ===== */}
            <section id="orbit-ai" className="relative py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/10 text-indigo-400 text-sm font-medium mb-4 border border-indigo-400/20">
                            <Sparkles className="w-4 h-4" /> {t.ai.badge}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            {t.ai.title}
                            <span className="text-gradient-ice">{t.ai.titleHighlight}</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                            {t.ai.desc}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Left — Mock Chat Interface */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                            className="glass-card p-1 relative overflow-hidden frost-card"
                        >
                            {/* Chat window chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-sky-200/10 dark:border-sky-400/10">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-xs text-muted-foreground font-medium">Orbit AI</span>
                                </div>
                                <Brain className="w-4 h-4 text-sky-400" />
                            </div>

                            {/* Chat messages */}
                            <div className="p-4 space-y-4 min-h-[320px]">
                                {/* User message */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex justify-end"
                                >
                                    <div className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm shadow-md shadow-sky-500/10">
                                        {language === 'bn' ? 'আমার এই মাসের বাজেট কেমন চলছে?' : "How's my budget looking this month?"}
                                    </div>
                                </motion.div>

                                {/* AI response */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex justify-start gap-2"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center shrink-0 mt-1">
                                        <Brain className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md max-w-[85%] text-sm leading-relaxed">
                                        <p className="text-foreground mb-2">
                                            {language === 'bn' ? 'তুমি ৳12,500 এর মধ্যে ৳8,200 খরচ করেছ।' : "You've spent ৳8,200 of your ৳12,500 budget."}
                                        </p>
                                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '66%' }}
                                                viewport={{ once: false, amount: 0.2 }}
                                                transition={{ delay: 0.8, duration: 0.8 }}
                                                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-500"
                                            />
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            {language === 'bn' ? '💡 পরামর্শ: খাবারে এই সপ্তাহে ৳1,200 বাঁচাতে পারো।' : '💡 Tip: You could save ৳1,200 on food this week.'}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Second user message */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ delay: 0.9 }}
                                    className="flex justify-end"
                                >
                                    <div className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm shadow-md shadow-sky-500/10">
                                        {language === 'bn' ? 'আমার কাল কী কী করা দরকার?' : 'What do I need to do tomorrow?'}
                                    </div>
                                </motion.div>

                                {/* AI response 2 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ delay: 1.2 }}
                                    className="flex justify-start gap-2"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center shrink-0 mt-1">
                                        <Brain className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md max-w-[85%] text-sm">
                                        <p className="text-foreground mb-1.5">
                                            {language === 'bn' ? 'তোমার কালকের ৩টি কাজ আছে:' : "You have 3 tasks for tomorrow:"}
                                        </p>
                                        <div className="space-y-1">
                                            {[
                                                { icon: '📝', text: language === 'bn' ? 'ফিজিক্স অ্যাসাইনমেন্ট জমা দাও' : 'Submit Physics assignment' },
                                                { icon: '💰', text: language === 'bn' ? 'ফ্রিল্যান্স ইনভয়েস পাঠাও' : 'Send freelance invoice' },
                                                { icon: '🏃', text: language === 'bn' ? 'সন্ধ্যা ৫টায় জিম' : 'Gym at 5 PM' },
                                            ].map((task) => (
                                                <div key={task.text} className="flex items-center gap-2 text-muted-foreground">
                                                    <span className="text-xs">{task.icon}</span>
                                                    <span className="text-xs">{task.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Chat input */}
                            <div className="px-4 pb-4">
                                <div className="glass-card rounded-full px-4 py-2.5 flex items-center gap-2 border border-sky-200/15 dark:border-sky-400/10">
                                    <span className="text-muted-foreground text-sm flex-1">{language === 'bn' ? 'অরবিটকে কিছু জিজ্ঞেস করো...' : 'Ask Orbit anything...'}</span>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right — Capability cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: Brain, label: t.ai.tags[0], desc: language === 'bn' ? 'বুদ্ধিমান ফর্ম পূরণ' : 'Context-aware assistance', gradient: 'from-indigo-500 to-violet-500', glow: 'shadow-indigo-500/20' },
                                { icon: BarChart3, label: t.ai.tags[1], desc: language === 'bn' ? 'তথ্য বিশ্লেষণ' : 'Smart analytics & reports', gradient: 'from-sky-400 to-cyan-500', glow: 'shadow-sky-500/20' },
                                { icon: Zap, label: t.ai.tags[2], desc: language === 'bn' ? 'প্রেক্ষাপট সচেতন পরামর্শ' : 'Personalized suggestions', gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/20' },
                                { icon: Clock, label: t.ai.tags[3], desc: language === 'bn' ? 'সক্রিয় বিজ্ঞপ্তি' : 'Timely notifications', gradient: 'from-teal-400 to-emerald-500', glow: 'shadow-teal-500/20' },
                            ].map((cap, i) => (
                                <motion.div
                                    key={cap.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ delay: 0.4 + i * 0.15 }}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="glass-card p-5 frost-card group cursor-default"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center mb-3 shadow-lg ${cap.glow} group-hover:scale-110 transition-transform duration-300`}>
                                        <cap.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-foreground text-sm mb-1">{cap.label}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
                                </motion.div>
                            ))}

                            {/* Bottom wide card — AI stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ delay: 1 }}
                                className="col-span-2 glass-card p-5 frost-card"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-foreground">{language === 'bn' ? 'অরবিট AI স্ট্যাটাস' : 'Orbit AI Status'}</div>
                                            <div className="text-xs text-muted-foreground">{language === 'bn' ? 'সর্বদা শিখছে, সর্বদা উন্নত হচ্ছে' : 'Always learning, always improving'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-medium text-emerald-400">{language === 'bn' ? 'সক্রিয়' : 'Active'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="why" className="relative py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            {t.why.title} <span className="text-gradient-ice">{t.why.titleHighlight}</span>?
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                        {[
                            { icon: Shield, title: t.why.cards[0].title, description: t.why.cards[0].desc, color: "text-teal-400" },
                            { icon: ListTodo, title: t.why.cards[1].title, description: t.why.cards[1].desc, color: "text-sky-400" },
                            { icon: Zap, title: t.why.cards[2].title, description: t.why.cards[2].desc, color: "text-indigo-400" },
                            { icon: Gauge, title: t.why.cards[3].title, description: t.why.cards[3].desc, color: "text-amber-400" },
                            { icon: WifiOff, title: t.why.cards[4].title, description: t.why.cards[4].desc, color: "text-rose-400" },
                            { icon: Download, title: t.why.cards[5].title, description: t.why.cards[5].desc, color: "text-emerald-400" },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ delay: i * 0.15 }}
                                className="text-center p-4 sm:p-6 flex flex-col items-center justify-start h-full glass-card frost-card border border-sky-200/50 dark:border-sky-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3 sm:mb-4 shrink-0 shadow-sm border border-black/5 dark:border-white/5`}>
                                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                                </div>
                                <h3 className="text-sm sm:text-lg font-bold mb-1.5 sm:mb-2 text-foreground">{item.title}</h3>
                                <p className="text-[11px] sm:text-[13px] text-muted-foreground leading-relaxed sm:leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="relative py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <div className="glass-card p-10 md:p-16 relative overflow-hidden frost-card">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-cyan-400/10 pointer-events-none" />
                        <div className="relative z-10">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="inline-block mb-6"
                            >
                                <img src="/logo.svg" alt="LifeSolver" className="w-12 h-12" />
                            </motion.div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                {t.cta.title} <span className="text-gradient-ice">{t.cta.titleHighlight}</span>?
                            </h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                {t.cta.desc}
                            </p>
                            <Link to="/register">
                                <Button size="lg" className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-semibold text-lg px-10 h-14 hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-sky-500/25">
                                    {t.cta.button} <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            <footer className="relative py-8 px-6 border-t border-sky-200/20 dark:border-sky-400/10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center overflow-hidden">
                            <img src="/logo.svg" alt="LifeSolver Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-gradient-ice">LifeSolver</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center md:text-right">
                        © {new Date().getFullYear()} LifeSolver. All rights are preserved by Orbit Saas. <br className="md:hidden" />
                        Website - <a href="https://orbitsaas.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">orbitsaas.cloud</a>
                    </p>
                </div >
            </footer >
        </main >
    );
}
