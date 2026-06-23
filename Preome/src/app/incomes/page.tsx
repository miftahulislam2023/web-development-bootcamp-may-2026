'use client'

import { useState, useEffect } from 'react'
import IncomeForm from '@/components/IncomeForm'
import IncomeList from '@/components/IncomeList'

interface Income {
  id: string
  amount: number
  source: string
  date: string
}

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/incomes')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setIncomes(data)
      } else {
        setIncomes([])
        if (data.error) {
          setError(data.error)
        }
      }
    } catch (err) {
      setError('Failed to load incomes')
      setIncomes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/incomes/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchIncomes()
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (income: Income) => {
    setEditingIncome(income)
  }

  const handleCancelEdit = () => {
    setEditingIncome(null)
  }

  const handleIncomeAdded = async () => {
    await fetchIncomes()
    setEditingIncome(null)
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
            Income Manager
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '4px' }}>
            Add and manage your income sources
          </p>
        </div>
        
        <IncomeForm 
          onIncomeAdded={handleIncomeAdded}
          editingIncome={editingIncome}
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
        
        <IncomeList 
          incomes={incomes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}