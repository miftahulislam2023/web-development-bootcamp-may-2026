'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/Dashboard'
import ExpenseList from '@/components/ExpenseList'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

interface Income {
  id: string
  amount: number
  source: string
  date: string
}

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
    fetchExpenses()
    fetchIncomes()
  }, [])

  const fetchUser = async () => {
    const response = await fetch('/api/auth/me')
    const data = await response.json()
    if (data.user) {
      setUserName(data.user.name)
    }
  }

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
    }
  }

  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/incomes')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setIncomes(data)
      } else {
        setIncomes([])
      }
    } catch (err) {
      setIncomes([])
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
            Welcome back, {userName}!
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '4px' }}>
            Track your income, expenses, and savings
          </p>
        </div>
        
        <Dashboard expenses={expenses} incomes={incomes} />
        
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Recent Expenses</h2>
          <ExpenseList 
            expenses={expenses.slice(0, 5)}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    </div>
  )
}