'use client'

import { useState, useEffect } from 'react'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

interface MonthlyStatsProps {
  expenses: Expense[]
}

export default function MonthlyStats({ expenses }: MonthlyStatsProps) {
  const [monthlyData, setMonthlyData] = useState<{ month: string; total: number; count: number }[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    const yearExpenses = expenses.filter(expense => 
      new Date(expense.date).getFullYear() === selectedYear
    )
    
    const monthlyTotals = months.map((month, index) => {
      const monthExpenses = yearExpenses.filter(expense => 
        new Date(expense.date).getMonth() === index
      )
      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      return {
        month,
        total,
        count: monthExpenses.length
      }
    })
    
    setMonthlyData(monthlyTotals)
  }, [expenses, selectedYear])

  const maxTotal = Math.max(...monthlyData.map(data => data.total), 0)
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i))

  const totalYearlyExpense = monthlyData.reduce((sum, data) => sum + data.total, 0)
  const averageMonthlyExpense = totalYearlyExpense / 12

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1f36' }}>
            Monthly Expense Overview
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Track your spending patterns throughout the year
          </p>
        </div>
        
        <div>
          <label style={{ marginRight: '8px', fontSize: '14px', color: '#374151' }}>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
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
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Yearly Total</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1f36' }}>৳{totalYearlyExpense.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Monthly Average</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1f36' }}>৳{averageMonthlyExpense.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Total Transactions</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1f36' }}>{expenses.filter(e => new Date(e.date).getFullYear() === selectedYear).length}</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {monthlyData.map((data) => (
          <div key={data.month}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{data.month}</span>
                {data.count > 0 && (
                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                    ({data.count} expense{data.count !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: data.total > 0 ? '#ef4444' : '#6b7280' }}>
                ৳{data.total.toFixed(2)}
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '36px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${maxTotal > 0 ? (data.total / maxTotal) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#4f46e5',
                borderRadius: '8px',
                transition: 'width 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '10px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {data.total > 0 && `৳${Math.round(data.total)}`}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {monthlyData.every(data => data.total === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#9ca3af'
        }}>
          No expense data available for {selectedYear}
        </div>
      )}
    </div>
  )
}