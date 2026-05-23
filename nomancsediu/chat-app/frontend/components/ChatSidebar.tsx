import { User } from '@/context/AppContext';
import React, { useState } from 'react'
import { MessageCircle, Plus, Search, UserCircle, X, LogOut, Settings } from 'lucide-react';
import { Chats } from '@/context/AppContext';
import Link from 'next/link';

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUser: boolean;
  setShowAllUser: (show: boolean | ((prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleLogOut: () => void;
  chats: Chats[] | null;
  createChat: (user: User) => void;
  onlineUsers: string[];
}

const ChatSidebar = ({ sidebarOpen, setSidebarOpen, showAllUser,
  setShowAllUser, users, loggedInUser, selectedUser,
  setSelectedUser, handleLogOut, chats, createChat, onlineUsers }: ChatSidebarProps) => {

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {sidebarOpen && (
        <div className="hidden lg:block fixed inset-0 bg-black/50 z-10" onClick={() => setSidebarOpen(false)} />
      )}
<aside className={`lg:fixed z-20 top-0 left-0 h-full lg:h-dvh w-full lg:w-80 bg-slate-900 border-r border-slate-800 transform
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300
  flex flex-col`}>

        {/* Header */}
        <div className='px-4 py-4 border-b border-slate-800'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center'>
                <MessageCircle className='w-4 h-4 text-white' />
              </div>
              <span className='text-white font-bold text-lg tracking-wide'>{showAllUser ? 'New Chat' : 'Chats'}</span>
            </div>
            <button
              className={`p-2 rounded-lg transition-colors ${showAllUser ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={() => { setShowAllUser(prev => !prev); setSearchQuery(''); }}>
              {showAllUser ? <X className='w-4 h-4 text-white' /> : <Plus className='w-4 h-4 text-white' />}
            </button>
          </div>

          {/* Search bar */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <input
              type="text"
              placeholder={showAllUser ? 'Search users to start chatting...' : 'Search chats...'}
              className='w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-3 py-2 min-h-0 overscroll-contain'>
          {showAllUser ? (
            <div className='space-y-1'>
              {!searchQuery.trim() ? (
                <div className='flex flex-col items-center justify-center h-full text-center py-16'>
                  <Search className='w-12 h-12 text-slate-600 mb-4' />
                  <h3 className='text-slate-300 font-medium text-base mb-2'>Search for Users</h3>
                  <p className='text-slate-500 text-sm px-4'>Type in the search box above to find users and start a new conversation.</p>
                </div>
              ) : (
                users?.filter(u => u._id !== loggedInUser?._id &&
                  u.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).length ? (
                  users.filter(u => u._id !== loggedInUser?._id &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(u => (
                    <button key={u._id}
                      className='w-full text-left px-3 py-3 rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-3'
                      onClick={() => { createChat(u); setShowAllUser(false); setSearchQuery(''); }}>
                      <div className='w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0'>
                        {(u as any).avatar?.url
                          ? <img src={(u as any).avatar.url} alt={u.name} className='w-full h-full object-cover' />
                          : <UserCircle className='w-6 h-6 text-slate-300' />}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <span className='font-medium text-white text-sm block truncate'>{u.name}</span>
                        <span className='text-xs text-slate-400'>Tap to start chatting</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className='flex flex-col items-center justify-center text-center py-16'>
                    <UserCircle className='w-12 h-12 text-slate-600 mb-4' />
                    <h3 className='text-slate-300 font-medium text-base mb-2'>No Users Found</h3>
                    <p className='text-slate-500 text-sm px-4'>No users match your search &quot;{searchQuery}&quot;. Try a different search term.</p>
                  </div>
                )
              )}
            </div>
          ) : (
            chats && chats.length > 0 ? (
              <div className='space-y-1'>
                {chats.filter(chat =>
                  !searchQuery.trim() || chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(chat => {
                  const latestMessage = chat.chat.latestMessage;
                  const isSelected = selectedUser === chat.chat._id;
                  const isSentByMe = latestMessage?.sender === loggedInUser?._id;
                  const unseenCount = chat.chat.unseenCount || 0;

                  return (
                    <button key={chat.chat._id}
                      onClick={() => { setSelectedUser(chat.chat._id); setSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-3 rounded-xl transition-colors ${isSelected ? 'bg-blue-600' : 'hover:bg-slate-900'}`}>
                      <div className='flex items-center gap-3'>
                        <div className='relative flex-shrink-0'>
                          <div className='w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden'>
                            {chat.user.avatar?.url
                              ? <img src={chat.user.avatar.url} alt={chat.user.name} className='w-full h-full object-cover' />
                              : <UserCircle className='w-7 h-7 text-slate-300' />}
                          </div>
                          {onlineUsers.includes(chat.user._id) && (
                            <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between mb-0.5'>
                            <span className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{chat.user.name}</span>
                            {unseenCount > 0 && (
                              <span className='bg-green-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 flex-shrink-0'>
                                {unseenCount > 99 ? '99+' : unseenCount}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                            {latestMessage?.text ? `${isSentByMe ? 'You: ' : ''}${latestMessage.text}` : 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <MessageCircle className='w-10 h-10 text-slate-600 mb-3' />
                <p className='text-slate-400 font-medium text-sm'>No conversations yet</p>
                <p className='text-xs text-slate-500 mt-1'>Tap + to start a new chat</p>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className='p-3 border-t border-slate-800 flex gap-2 bg-slate-900 flex-shrink-0'>
          <Link href='/settings' className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors flex-1 border border-slate-800'>
            <Settings className='w-4 h-4 text-slate-300' />
            <span className='text-sm text-slate-300 font-medium'>Settings</span>
          </Link>
          <button onClick={handleLogOut} className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl flex-1 hover:bg-red-600/20 transition-colors border border-slate-800 hover:border-red-600 group'>
            <LogOut className='w-4 h-4 text-slate-400 group-hover:text-red-400' />
            <span className='text-sm text-slate-400 font-medium group-hover:text-red-400'>Logout</span>
          </button>
        </div>

      </aside>
    </>
  )
}

export default ChatSidebar
