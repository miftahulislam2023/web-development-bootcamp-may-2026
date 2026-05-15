'use client'

import { useState, useMemo } from 'react'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

interface DashboardProps {
  expenses: Expense[]
}

export default function Dashboard({ expenses }: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString())

  const filteredExpenses = useMemo(() => {
    if (!selectedMonth) return expenses
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      const expenseMonth = months[expenseDate.getMonth()]
      const expenseYear = expenseDate.getFullYear().toString()
      return expenseMonth === selectedMonth && expenseYear === selectedYear
    })
  }, [expenses, selectedMonth, selectedYear, months])

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [filteredExpenses])

  const averageExpense = useMemo(() => {
    return filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0
  }, [filteredExpenses, totalExpenses])

  const categoryTotals = useMemo(() => {
    const categories: Record<string, number> = {}
    filteredExpenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount
    })
    return categories
  }, [filteredExpenses])

  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#1a1f36' }}>
          Dashboard Filter
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Total Expenses {selectedMonth && `(${selectedMonth})`}
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1f36' }}>
            ৳{totalExpenses.toFixed(2)}
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Average Expense {selectedMonth && `(${selectedMonth})`}
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1f36' }}>
            ৳{averageExpense.toFixed(2)}
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Transactions {selectedMonth && `(${selectedMonth})`}
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1f36' }}>
            {filteredExpenses.length}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '16px' }}>
            Category Breakdown {selectedMonth && `(${selectedMonth})`}
          </h3>
          <div>
            {Object.entries(categoryTotals).map(([category, total]) => (
              <div key={category} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '14px'
              }}>
                <span style={{ color: '#4b5563' }}>{category}</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>৳{total.toFixed(2)}</span>
              </div>
            ))}
            {Object.keys(categoryTotals).length === 0 && (
              <p style={{ color: '#9ca3af', textAlign: 'center' }}>No expenses for this period</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}