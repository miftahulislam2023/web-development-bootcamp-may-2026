'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import LogoutButton from './LogoutButton'
import Profile from './Profile'

export default function Header() {
  const pathname = usePathname()
  const [showProfile, setShowProfile] = useState(false)
  const [userName, setUserName] = useState('')

  const isAuthPage = pathname === '/login' || pathname === '/register'

  useEffect(() => {
    if (!isAuthPage) {
      fetchUser()
    }
  }, [isAuthPage])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (data.user) {
        setUserName(data.user.name)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleNameUpdate = (newName: string) => {
    setUserName(newName)
  }

  if (isAuthPage) {
    return null
  }

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <Link href="/">
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
                margin: 0
              }}>
                Expense Tracker
              </h2>
            </Link>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '2px'
            }}>
              Welcome, {userName || 'User'}
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/">
              <button style={{
                padding: '8px 20px',
                backgroundColor: pathname === '/' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}>
                Dashboard
              </button>
            </Link>
            
            <Link href="/incomes">
              <button style={{
                padding: '8px 20px',
                backgroundColor: pathname === '/incomes' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}>
                Incomes
              </button>
            </Link>
            
            <Link href="/expenses">
              <button style={{
                padding: '8px 20px',
                backgroundColor: pathname === '/expenses' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}>
                Expenses
              </button>
            </Link>
            
            <Link href="/monthly-stats">
              <button style={{
                padding: '8px 20px',
                backgroundColor: pathname === '/monthly-stats' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}>
                Stats
              </button>
            </Link>
            
            <button
              onClick={() => setShowProfile(true)}
              style={{
                padding: '8px 20px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Profile
            </button>
            
            <LogoutButton />
          </div>
        </div>
      </header>
      
      {showProfile && (
        <Profile 
          onClose={() => setShowProfile(false)}
          onNameUpdate={handleNameUpdate}
        />
      )}
    </>
  )
}