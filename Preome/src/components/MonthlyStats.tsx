'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
)

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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [chartType, setChartType] = useState('bar')

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i))

  const monthlyExpenses = months.map((month, index) => {
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === index && expenseDate.getFullYear() === selectedYear
    })
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    return {
      month,
      total,
      count: monthExpenses.length
    }
  })

  const monthlyIncomes = months.map((month, index) => {
    const monthIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date)
      return incomeDate.getMonth() === index && incomeDate.getFullYear() === selectedYear
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

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: monthlyIncomes.map(data => data.total),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: 'Expenses',
        data: monthlyExpenses.map(data => data.total),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: 'Savings',
        data: monthlySavings.map(data => data.total),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      }
    ],
  }

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: monthlyIncomes.map(data => data.total),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Expenses',
        data: monthlyExpenses.map(data => data.total),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Savings',
        data: monthlySavings.map(data => data.total),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(79, 70, 229)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += '৳' + context.parsed.y.toFixed(2)
            }
            return label
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '৳' + value.toFixed(2)
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Amount (BDT)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
          rotation: 45,
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Months',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
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
            Year: {selectedYear}
          </p>
        </div>
        
        <div>
          <label style={{ marginRight: '8px', fontSize: '14px', color: '#374151' }}>Select Year:</label>
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
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <button
          onClick={() => setChartType('bar')}
          style={{
            padding: '6px 16px',
            backgroundColor: chartType === 'bar' ? '#4f46e5' : 'transparent',
            color: chartType === 'bar' ? 'white' : '#4f46e5',
            border: chartType === 'bar' ? 'none' : '1px solid #4f46e5',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setChartType('line')}
          style={{
            padding: '6px 16px',
            backgroundColor: chartType === 'line' ? '#4f46e5' : 'transparent',
            color: chartType === 'line' ? 'white' : '#4f46e5',
            border: chartType === 'line' ? 'none' : '1px solid #4f46e5',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          Line Chart
        </button>
      </div>
      
      <div style={{ marginBottom: '32px', minHeight: '400px' }}>
        {chartType === 'bar' ? (
          <Bar data={barChartData} options={chartOptions} />
        ) : (
          <Line data={lineChartData} options={chartOptions} />
        )}
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
          No financial data available for {selectedYear}
        </div>
      )}
    </div>
  )
}