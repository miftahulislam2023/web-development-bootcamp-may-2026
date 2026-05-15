'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function Header() {
  const pathname = usePathname()

  return (
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
            Track your finances
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
              Monthly Stats
            </button>
          </Link>
          
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}