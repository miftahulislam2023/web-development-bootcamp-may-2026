'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NewDMPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const startChat = () => {
    if (email.trim()) {
      router.push(`/dm/${encodeURIComponent(email.trim())}`)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 p-8 bg-gray-800 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          New Message
        </h2>
        <label className="text-gray-400 text-sm mb-1 block">
          Recipient's Email
        </label>
        <input
          type="email"
          placeholder="Enter their email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && startChat()}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 mb-4 outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startChat}
          className="w-full py-2 rounded-full text-white font-semibold"
          style={{ backgroundColor: '#168aad' }}
        >
          Start Chat
        </motion.button>
      </motion.div>
    </main>
  )
}