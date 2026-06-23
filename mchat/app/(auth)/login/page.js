'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    router.push('/chat')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900">
      <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-4 p-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl text-center font-bold text-white mb-6">
          Sign in to Your Account
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <motion.div
           whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          className='flex justify-center'>
            <Button
            type="submit"
            className=" px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:cursor-pointer hover:border-2 border-white"
              style={{ backgroundColor: '#168aad' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          </motion.div>

          
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:text-white">
            Register
          </Link>
        </p>
      </motion.div>
    </main>
  )
}