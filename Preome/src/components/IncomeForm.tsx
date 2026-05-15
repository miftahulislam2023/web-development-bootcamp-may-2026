'use client'

import { useState } from 'react'

interface IncomeFormProps {
  onIncomeAdded: () => void
  editingIncome?: any
  onCancel?: () => void
}

export default function IncomeForm({ onIncomeAdded, editingIncome, onCancel }: IncomeFormProps) {
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const [date, setDate] = useState('')

  useState(() => {
    if (editingIncome) {
      setAmount(editingIncome.amount.toString())
      setSource(editingIncome.source)
      setDate(editingIncome.date.split('T')[0])
    } else {
      setDate(new Date().toISOString().split('T')[0])
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const incomeData = {
      amount: parseFloat(amount),
      source,
      date
    }

    const url = editingIncome ? `/api/incomes/${editingIncome.id}` : '/api/incomes'
    const method = editingIncome ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeData)
      })

      if (response.ok) {
        setAmount('')
        setSource('')
        setDate(new Date().toISOString().split('T')[0])
        
        if (onIncomeAdded) {
          onIncomeAdded()
        }
        
        if (onCancel) {
          onCancel()
        }
      }
    } catch (error) {
      console.error('Failed to save income:', error)
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#1a1f36' }}>
        {editingIncome ? 'Edit Income' : 'Add Monthly Income'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Amount (BDT)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter income amount in Taka"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              placeholder="e.g., Salary, Freelance, Business"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {editingIncome ? 'Update Income' : 'Add Income'}
            </button>
            
            {editingIncome && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}