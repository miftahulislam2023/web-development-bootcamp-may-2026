"use client"

import { useAppData } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera, UserCircle, Trash2, AlertTriangle } from 'lucide-react'
import Loading from '@/components/Loading'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import { user_service } from '@/context/AppContext'

const SettingsPage = () => {
    const { user, loading, isAuth, updateProfile, logoutUser } = useAppData()
    const router = useRouter()

    const [name, setName] = useState("")
    const [isInvisible, setIsInvisible] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!loading && !isAuth) router.push('/login')
    }, [isAuth, loading])

    useEffect(() => {
        if (user) {
            setName(user.name)
            setIsInvisible(user.isInvisible ?? false)
        }
    }, [user])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const formData = new FormData()
        formData.append("name", name)
        formData.append("isInvisible", String(isInvisible))
        if (avatarFile) formData.append("avatar", avatarFile)
        await updateProfile(formData)
        setSaving(false)
    }

    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') return

        setIsDeleting(true)
        try {
            const token = Cookies.get('token')
            await axios.delete(`${user_service}/api/v1/user/delete`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            toast.success('Account deleted successfully')
            logoutUser()
            router.push('/login')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to delete account')
        } finally {
            setIsDeleting(false)
        }
    }

    if (loading) return <Loading />

    const avatarSrc = avatarPreview || user?.avatar?.url

    return (
        <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-white flex flex-col items-center justify-start sm:justify-center px-3 sm:px-4 py-4 sm:py-6">
            <div className="w-full max-w-md bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 p-4 sm:p-6 md:p-8">

                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <button onClick={() => router.push('/chat')} className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold text-white">Settings</h1>
                </div>

                <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">

                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                                    : <UserCircle className="w-12 h-12 sm:w-14 sm:h-14 text-slate-400" />
                                }
                            </div>
                            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 border-2 border-slate-900">
                                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">Click to change photo</p>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm text-slate-400 font-medium">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Invisible Toggle */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 rounded-lg sm:rounded-xl border border-slate-700">
                        <div className="flex-1 min-w-0 pr-3">
                            <p className="text-xs sm:text-sm font-medium text-white">Invisible Mode</p>
                            <p className="text-xs text-slate-500 mt-0.5">Others will see you as offline</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsInvisible(prev => !prev)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${isInvisible ? 'bg-blue-600' : 'bg-slate-600'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isInvisible ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Save */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-white transition-colors"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </form>

                {/* Delete Account Section */}
                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-700 mt-6 sm:mt-8">
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm font-medium text-red-400">Danger Zone</h3>
                        <p className="text-xs text-slate-500">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 hover:border-red-600/50 rounded-lg sm:rounded-xl font-medium text-sm text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    ) : (
                        <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-red-950/20 border border-red-800/30 rounded-lg sm:rounded-xl">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1 sm:space-y-2">
                                    <h4 className="text-sm font-medium text-red-400">Delete Account</h4>
                                    <p className="text-xs sm:text-sm text-slate-300">
                                        This action cannot be undone. This will permanently delete your account, 
                                        all your messages, chats, and remove all associated data.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2.5 sm:space-y-3">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-xs sm:text-sm text-slate-400">
                                        Type <span className="font-mono font-bold text-red-400">DELETE</span> to confirm:
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="Type DELETE here"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false)
                                            setConfirmText('')
                                        }}
                                        className="flex-1 py-2 px-3 sm:px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs sm:text-sm font-medium text-slate-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={confirmText !== 'DELETE' || isDeleting}
                                        className="flex-1 py-2 px-3 sm:px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs sm:text-sm font-medium text-white transition-colors"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SettingsPage