'use client'

import { format } from 'date-fns'
import { useState } from 'react'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString())

  const filteredExpenses = expenses.filter(expense => {
    if (!selectedMonth) return true
    const expenseDate = new Date(expense.date)
    const expenseMonth = months[expenseDate.getMonth()]
    const expenseYear = expenseDate.getFullYear().toString()
    return expenseMonth === selectedMonth && expenseYear === selectedYear
  })

  const getMonthTotal = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

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
          Filter by Month
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
          
          {selectedMonth && (
            <div style={{
              padding: '10px 20px',
              backgroundColor: '#eef2ff',
              borderRadius: '8px',
              minWidth: '180px'
            }}>
              <span style={{ fontSize: '14px', color: '#4b5563' }}>Total for {selectedMonth}: </span>
              <strong style={{ fontSize: '18px', color: '#4f46e5' }}>৳{getMonthTotal().toFixed(2)}</strong>
            </div>
          )}
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Description</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Category</th>
              <th style={{ padding: '16px', textAlign: 'right', color: '#4a5568', fontWeight: '600' }}>Amount (BDT)</th>
              <th style={{ padding: '16px', textAlign: 'center', color: '#4a5568', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px', color: '#374151' }}>
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </td>
                <td style={{ padding: '16px', color: '#374151' }}>{expense.description}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: '#eef2ff',
                    color: '#4f46e5',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {expense.category}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>
                  ৳{expense.amount.toFixed(2)}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button
                    onClick={() => onEdit(expense)}
                    style={{
                      padding: '6px 12px',
                      marginRight: '8px',
                      backgroundColor: 'transparent',
                      color: '#4f46e5',
                      border: '1px solid #4f46e5',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredExpenses.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#9ca3af'
          }}>
            No expenses found for {selectedMonth || 'this period'}. Add your first expense above.
          </div>
        )}
      </div>
    </div>
  )
}