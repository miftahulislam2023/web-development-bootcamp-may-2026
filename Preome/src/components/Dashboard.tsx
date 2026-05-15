'use client'

import { useState, useMemo } from 'react'

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

interface DashboardProps {
  expenses: Expense[]
  incomes: Income[]
}

export default function Dashboard({ expenses, incomes }: DashboardProps) {
  const [filterType, setFilterType] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString())

  const filteredExpenses = useMemo(() => {
    if (filterType === 'month') {
      if (!selectedMonth) return expenses
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        const expenseMonth = months[expenseDate.getMonth()]
        const expenseYear = expenseDate.getFullYear().toString()
        return expenseMonth === selectedMonth && expenseYear === selectedYear
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
  }, [expenses, filterType, selectedMonth, selectedYear, startDate, endDate, months])

  const filteredIncomes = useMemo(() => {
    if (filterType === 'month') {
      if (!selectedMonth) return incomes
      return incomes.filter(income => {
        const incomeDate = new Date(income.date)
        const incomeMonth = months[incomeDate.getMonth()]
        const incomeYear = incomeDate.getFullYear().toString()
        return incomeMonth === selectedMonth && incomeYear === selectedYear
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
  }, [incomes, filterType, selectedMonth, selectedYear, startDate, endDate, months])

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [filteredExpenses])

  const totalIncome = useMemo(() => {
    return filteredIncomes.reduce((sum, income) => sum + income.amount, 0)
  }, [filteredIncomes])

  const remainingBalance = useMemo(() => {
    return totalIncome - totalExpenses
  }, [totalIncome, totalExpenses])

  const averageExpense = useMemo(() => {
    return filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0
  }, [filteredExpenses, totalExpenses])

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
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                value="month"
                checked={filterType === 'month'}
                onChange={(e) => setFilterType(e.target.value)}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>Monthly Filter</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                value="dateRange"
                checked={filterType === 'dateRange'}
                onChange={(e) => setFilterType(e.target.value)}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>Date Range</span>
            </label>
          </div>
        </div>
        
        {filterType === 'month' ? (
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
        ) : (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        )}
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
            Total Income
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            ৳{totalIncome.toFixed(2)}
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Total Expenses
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>
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
            Remaining Balance
          </h3>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: remainingBalance >= 0 ? '#4f46e5' : '#ef4444'
          }}>
            ৳{remainingBalance.toFixed(2)}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Average Expense
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1f36' }}>
            ৳{averageExpense.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}