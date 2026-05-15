'use client'

import { useState, useEffect } from 'react'
import MonthlyStats from '@/components/MonthlyStats'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

export default function MonthlyStatsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setExpenses(data)
      } else {
        setExpenses([])
      }
    } catch (err) {
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
            Monthly Expense Overview
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '4px' }}>
            Track your spending patterns throughout the year
          </p>
        </div>
        
        <MonthlyStats expenses={expenses} />
      </div>
    </div>
  )
}