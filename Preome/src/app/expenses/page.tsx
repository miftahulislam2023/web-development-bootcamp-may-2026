'use client'

import { useState, useEffect } from 'react'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        if (data.error) {
          setError(data.error)
        }
      }
    } catch (err) {
      setError('Failed to load expenses')
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchExpenses()
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const handleCancelEdit = () => {
    setEditingExpense(null)
  }

  const handleExpenseAdded = async () => {
    await fetchExpenses()
    setEditingExpense(null)
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
            Expense Manager
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '4px' }}>
            Add, edit, and manage your expenses
          </p>
        </div>
        
        <ExpenseForm 
          onExpenseAdded={handleExpenseAdded}
          editingExpense={editingExpense}
          onCancel={handleCancelEdit}
        />
        
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            Error: {error}
          </div>
        )}
        
        <ExpenseList 
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}