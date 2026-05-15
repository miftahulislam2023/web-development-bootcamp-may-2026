'use client'

import { useState, useEffect, useMemo } from 'react'

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

interface MonthlyStatsProps {
  expenses: Expense[]
  incomes: Income[]
}

export default function MonthlyStats({ expenses, incomes }: MonthlyStatsProps) {
  const [filterType, setFilterType] = useState('month')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i))

  const filteredExpenses = useMemo(() => {
    if (filterType === 'month') {
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getFullYear() === selectedYear
      })
    } else {
      if (!startDate || !endDate) return expenses
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return expenseDate >= start && expenseDate <= end
      })
    }
  }, [expenses, filterType, selectedYear, startDate, endDate])

  const filteredIncomes = useMemo(() => {
    if (filterType === 'month') {
      return incomes.filter(income => {
        const incomeDate = new Date(income.date)
        return incomeDate.getFullYear() === selectedYear
      })
    } else {
      if (!startDate || !endDate) return incomes
      return incomes.filter(income => {
        const incomeDate = new Date(income.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return incomeDate >= start && incomeDate <= end
      })
    }
  }, [incomes, filterType, selectedYear, startDate, endDate])

  const monthlyExpenses = months.map((month, index) => {
    const monthExpenses = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      if (filterType === 'month') {
        return expenseDate.getMonth() === index && expenseDate.getFullYear() === selectedYear
      } else {
        return expenseDate.getMonth() === index
      }
    })
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    return {
      month,
      total,
      count: monthExpenses.length
    }
  })

  const monthlyIncomes = months.map((month, index) => {
    const monthIncomes = filteredIncomes.filter(income => {
      const incomeDate = new Date(income.date)
      if (filterType === 'month') {
        return incomeDate.getMonth() === index && incomeDate.getFullYear() === selectedYear
      } else {
        return incomeDate.getMonth() === index
      }
    })
    const total = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0)
    return {
      month,
      total,
      count: monthIncomes.length
    }
  })

  const monthlySavings = months.map((month, index) => ({
    month,
    total: monthlyIncomes[index].total - monthlyExpenses[index].total
  }))

  const maxExpense = Math.max(...monthlyExpenses.map(data => data.total), 0)
  const maxIncome = Math.max(...monthlyIncomes.map(data => data.total), 0)

  const totalYearlyExpense = monthlyExpenses.reduce((sum, data) => sum + data.total, 0)
  const totalYearlyIncome = monthlyIncomes.reduce((sum, data) => sum + data.total, 0)
  const totalYearlySavings = totalYearlyIncome - totalYearlyExpense
  const averageMonthlyExpense = totalYearlyExpense / 12
  const averageMonthlyIncome = totalYearlyIncome / 12

  const getDateRangeText = () => {
    if (filterType === 'month') {
      return `Year: ${selectedYear}`
    } else {
      if (startDate && endDate) {
        return `${startDate} to ${endDate}`
      }
      return 'Select date range'
    }
  }

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
            Monthly Financial Overview
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            {getDateRangeText()}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '8px', fontSize: '14px', color: '#374151' }}>Filter by:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="month">Month/Year</option>
              <option value="dateRange">Date Range</option>
            </select>
          </div>
          
          {filterType === 'month' ? (
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
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div>
                <label style={{ marginRight: '8px', fontSize: '14px', color: '#374151' }}>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ marginRight: '8px', fontSize: '14px', color: '#374151' }}>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Total Income</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>৳{totalYearlyIncome.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Total Expenses</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>৳{totalYearlyExpense.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Total Savings</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: totalYearlySavings >= 0 ? '#4f46e5' : '#ef4444' }}>
            ৳{totalYearlySavings.toFixed(2)}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Monthly Avg Income</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1f36' }}>৳{averageMonthlyIncome.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Monthly Avg Expense</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1f36' }}>৳{averageMonthlyExpense.toFixed(2)}</p>
        </div>
      </div>
      
      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1f36', marginBottom: '16px' }}>
        Monthly Income Overview
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {monthlyIncomes.map((data) => (
          <div key={data.month}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{data.month}</span>
                {data.count > 0 && (
                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                    ({data.count} income{data.count !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: data.total > 0 ? '#10b981' : '#6b7280' }}>
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
                width: `${maxIncome > 0 ? (data.total / maxIncome) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#10b981',
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
      
      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1f36', marginBottom: '16px' }}>
        Monthly Expenses Overview
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {monthlyExpenses.map((data) => (
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
                width: `${maxExpense > 0 ? (data.total / maxExpense) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#ef4444',
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
      
      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1f36', marginBottom: '16px' }}>
        Monthly Savings (Income - Expenses)
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {monthlySavings.map((data) => (
          <div key={data.month}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{data.month}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: data.total >= 0 ? '#4f46e5' : '#ef4444' }}>
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
                width: `${Math.abs(data.total) > 0 ? (Math.abs(data.total) / Math.max(Math.abs(totalYearlySavings), 1)) * 100 : 0}%`,
                height: '100%',
                backgroundColor: data.total >= 0 ? '#4f46e5' : '#ef4444',
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
                {data.total !== 0 && `৳${Math.round(Math.abs(data.total))}`}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {monthlyExpenses.every(data => data.total === 0) && monthlyIncomes.every(data => data.total === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#9ca3af'
        }}>
          No financial data available for the selected {filterType === 'month' ? `year ${selectedYear}` : 'date range'}
        </div>
      )}
    </div>
  )
}