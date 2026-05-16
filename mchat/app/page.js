'use client';
import Link from 'next/link'
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0a1628' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#1a759f' }}
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: '#075E54' }}
        />
        <motion.div
          animate={{
            x: [0, 15, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#128C7E' }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold text-white mb-2 tracking-tight"
          style={{ fontFamily: 'var(--font-amrante)' }}
        >
          M<span style={{ color: '#168aad' }}>Chat</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-xl md:text-2xl mb-2 font-light"
        >
          Chat instantly with anyone, anywhere.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-500 text-base mb-6 max-w-md mx-auto"
        >
          Create rooms, invite friends and start chatting
          in real-time — No downloads required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full text-white font-semibold text-lg shadow-lg hover:cursor-pointer"
              style={{ backgroundColor: '#168aad' }}
            >
              Get Started
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full font-semibold text-lg border hover:cursor-pointer"
              style={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            >
              Login
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-10"
        >
          {[
            {  text: 'Real-time messaging' },
            {  text: 'Secure & private' },
            {  text: 'Multiple rooms' },
            {  text: 'Responsive' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-400"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}