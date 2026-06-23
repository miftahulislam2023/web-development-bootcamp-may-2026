'use client'

import { format } from 'date-fns'

interface Income {
  id: string
  amount: number
  source: string
  date: string
}

interface IncomeListProps {
  incomes: Income[]
  onEdit: (income: Income) => void
  onDelete: (id: string) => void
}

export default function IncomeList({ incomes, onEdit, onDelete }: IncomeListProps) {
  return (
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
            <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600' }}>Source</th>
            <th style={{ padding: '16px', textAlign: 'right', color: '#4a5568', fontWeight: '600' }}>Amount (BDT)</th>
            <th style={{ padding: '16px', textAlign: 'center', color: '#4a5568', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '16px', color: '#374151' }}>
                {format(new Date(income.date), 'MMM dd, yyyy')}
              </td>
              <td style={{ padding: '16px', color: '#374151' }}>{income.source}</td>
              <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#10b981' }}>
                ৳{income.amount.toFixed(2)}
              </td>
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <button
                  onClick={() => onEdit(income)}
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
                  onClick={() => onDelete(income.id)}
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
      
      {incomes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: '#9ca3af'
        }}>
          No income records found. Add your monthly income above.
        </div>
      )}
    </div>
  )
}