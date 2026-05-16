'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CreateRoomModal({ userId, onRoomCreated, onClose }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Room name is required')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: createError } = await supabase
      .from('rooms')
      .insert({
        name: name.trim(),
        description: description.trim(),
        created_by: userId,
      })
      .select()  
      .single()  

    if (createError) {
      setError(createError.message)
      setLoading(false)
      return
    }
    onRoomCreated(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-bold mb-4">
          Create a Room
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Room Name *
            </label>
            <Input
              placeholder="Enter room name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Description 
            </label>
            <Input
              placeholder="Details of the room"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Room'}
          </Button>
        </div>
      </div>
    </div>
  )
}