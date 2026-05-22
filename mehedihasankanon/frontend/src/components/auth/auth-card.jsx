'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'
import { ForgotPasswordForm } from './forgot-password-form'

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),

  center: {
    x: 0,
    opacity: 1,
  },

  exit: (direction) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
}

export function AuthCard() {
  const [tab, setTab] = useState('signin')
  const [direction, setDirection] = useState(1)
  const [isForgot, setIsForgot] = useState(false)

  function switchTab(next) {
    if (next === tab) return

    setDirection(next === 'signup' ? 1 : -1)
    setTab(next)
    setIsForgot(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Tab switcher */}
      <AnimatePresence>
        {!isForgot && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex border-b border-zinc-800"
          >
            {['signin', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={[
                  'relative flex-1 py-2.5 text-sm font-semibold tracking-tighter transition-colors',
                  tab === t
                    ? 'text-white'
                    : 'text-zinc-600 hover:text-zinc-400',
                ].join(' ')}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}

                {tab === t && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-white"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 40,
                    }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated form area */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {isForgot ? (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ForgotPasswordForm onBack={() => setIsForgot(false)} />
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.22,
                ease: 'easeInOut',
              }}
            >
              {tab === 'signin' ? (
                <SignInForm onForgotPassword={() => setIsForgot(true)} />
              ) : (
                <SignUpForm />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}