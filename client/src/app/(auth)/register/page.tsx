'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Camera, UserPlus, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff, Check, Sparkles, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { connectSocket } from '@/lib/socket';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', name: '', email: '', password: '' });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.name, form.email, form.password, avatar || undefined);
      connectSocket();
      toast.success('Account created! Welcome to ChatSphere.');
      router.push('/chat');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const floatingElements = [
    { icon: Zap, x: '10%', y: '20%', delay: 0, duration: 20, color: 'indigo' },
    { icon: Shield, x: '85%', y: '70%', delay: 2, duration: 25, color: 'purple' },
    { icon: Globe, x: '75%', y: '15%', delay: 4, duration: 18, color: 'pink' },
    { icon: Sparkles, x: '15%', y: '85%', delay: 6, duration: 22, color: 'cyan' },
  ];

  const passwordStrength = () => {
    const pwd = form.password;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return { level: strength, text: ['Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Very Weak' };
  };

  const passwordValid = passwordStrength();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/30 transition-colors duration-300">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/20 dark:bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-purple-500/20 dark:bg-purple-500/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-pink-500/20 dark:bg-pink-500/20 blur-3xl animate-pulse delay-500" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-slate-400/30 dark:bg-white/20"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              y: [null, -30, 30, -20, 20, 0],
              x: [null, 20, -20, 30, -30, 0],
            }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}

        {/* Floating icons */}
        {floatingElements.map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute hidden lg:block"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -40, 0, 40, 0],
              rotate: [0, 10, -10, 5, 0],
            }}
            transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
          >
            <div className={`rounded-2xl bg-${item.color}-500/10 dark:bg-${item.color}-500/10 backdrop-blur-sm border border-${item.color}-500/20`}>
              <item.icon className={`h-6 w-6 text-${item.color}-500 dark:text-${item.color}-400`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[460px]"
        >
          {/* Header with sparkle effect */}
          <div className="mb-8 text-center">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
              className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_8px_32px_rgba(99,102,241,0.4)]"
            >
              <span className="text-4xl">💬</span>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </motion.div>
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Create{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Join the real-time conversation and connect with friends
            </p>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Avatar Upload */}
                <div className="mb-2 flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative h-28 w-28 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 dark:border-white/20 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-white/5 transition-all duration-300 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10">
                      {preview ? (
                        <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-10 w-10 text-slate-400 dark:text-white/30 transition-all duration-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:scale-110" />
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-slate-950 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                      <UserPlus size={16} />
                    </div>
                  </motion.div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {preview ? 'Click to change photo' : 'Upload profile photo'}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1 sm:text-[13px]">
                      Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Write your name"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`h-12 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:ring-0 ${
                          focusedField === 'name' ? 'border-indigo-500/50 bg-indigo-50/50 dark:bg-white/10' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1 sm:text-[13px]">
                      Username <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="Write a username"
                        value={form.username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`h-12 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:ring-0 ${
                          focusedField === 'username' ? 'border-indigo-500/50 bg-indigo-50/50 dark:bg-white/10' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1 sm:text-[13px]">
                      Email <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Write your email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`h-12 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:ring-0 ${
                          focusedField === 'email' ? 'border-indigo-500/50 bg-indigo-50/50 dark:bg-white/10' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1 sm:text-[13px]">
                      Password <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`h-12 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:ring-0 ${
                          focusedField === 'password' ? 'border-indigo-500/50 bg-indigo-50/50 dark:bg-white/10' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {form.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordValid.level / 4) * 100}%` }}
                              className={`h-full rounded-full ${
                                passwordValid.level <= 1 ? 'bg-red-500' :
                                passwordValid.level === 2 ? 'bg-yellow-500' :
                                passwordValid.level === 3 ? 'bg-green-500' : 'bg-emerald-500'
                              }`}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordValid.level <= 1 ? 'text-red-600 dark:text-red-400' :
                            passwordValid.level === 2 ? 'text-yellow-600 dark:text-yellow-400' :
                            passwordValid.level === 3 ? 'text-green-600 dark:text-green-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {passwordValid.text}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-1.5 text-[10px] text-slate-500 dark:text-slate-500">
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${form.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300 dark:bg-white/20'}`} />
                            <span>8+ chars</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(form.password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-white/20'}`} />
                            <span>Uppercase</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(form.password) ? 'bg-green-500' : 'bg-slate-300 dark:bg-white/20'}`} />
                            <span>Number</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-0.5 rounded border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500"
                    required
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  id="register-btn"
                  type="submit"
                  disabled={loading}
                  className="relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 font-bold text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-100 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                  {!loading && (
                    <motion.div
                      className="absolute inset-0 -z-0 bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      initial={false}
                      whileHover={{ opacity: 1 }}
                    />
                  )}
                </Button>
              </form>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 transition-colors hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}