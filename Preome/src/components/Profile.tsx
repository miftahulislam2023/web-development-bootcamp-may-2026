'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

interface ProfileProps {
  onClose: () => void
  onNameUpdate: (newName: string) => void
}

export default function Profile({ onClose, onNameUpdate }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile')
      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
        setNewName(data.user.name)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setError('Name cannot be empty')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        onNameUpdate(data.user.name)
        setSuccess('Name updated successfully!')
        setEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to update name')
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>

        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1a1f36',
          marginBottom: '8px'
        }}>
          Profile Settings
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '24px'
        }}>
          Manage your account information
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151',
            fontSize: '14px'
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#f9fafb',
              color: '#6b7280'
            }}
          />
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '4px'
          }}>
            Email cannot be changed
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151',
            fontSize: '14px'
          }}>
            Full Name
          </label>
          {editing ? (
            <div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleUpdateName}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setNewName(user?.name || '')
                    setError('')
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <span style={{ color: '#1f2937', fontSize: '14px' }}>
                {user?.name || ''}
              </span>
              <button
                onClick={() => setEditing(true)}
                style={{
                  padding: '4px 12px',
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
            </div>
          )}
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
          </p>
        </div>
      </div>
    </div>
  )
}