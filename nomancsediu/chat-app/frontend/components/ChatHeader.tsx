import React, { useState } from 'react'
import { ArrowLeft, Menu, UserCircle, Trash2, AlertTriangle, MoreVertical } from 'lucide-react'
import { User } from '@/context/AppContext'

interface ChatHeaderProps {
    user: User | null;
    setSidebarOpen: (open: boolean) => void;
    onlineUsers: string[];
    isTyping: boolean;
    onBack?: () => void;
    selectedUser: string | null;
    onDeleteChat?: (chatId: string) => void;
}

const ChatHeader = ({ user, setSidebarOpen, onlineUsers, isTyping, onBack, selectedUser, onDeleteChat }: ChatHeaderProps) => {
  const isOnlineUser = user && onlineUsers.includes(user._id)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleDeleteChat = async () => {
    if (!selectedUser || !onDeleteChat) return
    setIsDeleting(true)
    try {
      await onDeleteChat(selectedUser)
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Failed to delete chat:', error)
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <>
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0 flex items-center gap-3 relative">
        <button className='lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors' onClick={onBack}>
          <ArrowLeft className='w-5 h-5 text-slate-200' />
        </button>
        <button className='hidden p-2 hover:bg-slate-700 rounded-lg transition-colors' onClick={() => setSidebarOpen(true)}>
          <Menu className='w-5 h-5 text-slate-200' />
        </button>
        <div className='w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0'>
          {user?.avatar?.url
            ? <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
            : <UserCircle className='w-5 h-5 text-slate-300' />}
        </div>
        <div className='flex-1 min-w-0'>
          <h2 className='text-sm font-semibold text-white truncate'>{user?.name}</h2>
          <p className={`text-xs ${isTyping || isOnlineUser ? 'text-green-400' : 'text-slate-400'}`}>
            {isTyping ? 'Typing...' : isOnlineUser ? 'Online' : 'Offline'}
          </p>
        </div>
        
        {/* Mobile Menu Button */}
        {selectedUser && onDeleteChat && (
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className='lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors'
            title='More options'
          >
            <MoreVertical className='w-5 h-5 text-slate-200' />
          </button>
        )}

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMobileMenu(false)} />
            <div className="absolute right-4 top-14 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[180px]">
              <button
                onClick={() => {
                  setShowMobileMenu(false)
                  setShowDeleteConfirm(true)
                }}
                className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/10 transition-colors text-left'
              >
                <Trash2 className='w-4 h-4' />
                <span className='text-sm font-medium'>Delete Chat</span>
              </button>
            </div>
          </>
        )}
        
        {/* Desktop Delete Chat Button */}
        {selectedUser && onDeleteChat && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className='hidden lg:flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors'
            title='Delete Chat'
          >
            <Trash2 className='w-4 h-4' />
            <span className='text-sm font-medium'>Delete Chat</span>
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl sm:rounded-2xl border border-slate-700 p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-start gap-2 sm:gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Delete Chat</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Are you sure you want to delete this conversation with <span className="font-medium text-white">{user?.name}</span>? 
                  This action cannot be undone and will permanently delete all messages.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-xs sm:text-sm font-medium text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChat}
                disabled={isDeleting}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-xs sm:text-sm font-medium text-white transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatHeader
