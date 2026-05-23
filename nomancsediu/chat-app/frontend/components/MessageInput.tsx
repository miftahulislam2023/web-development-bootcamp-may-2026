import React from 'react'
import { useState, useRef } from 'react';
import { Paperclip, Send, X, Pencil, Smile, FileText } from 'lucide-react';
import { Message } from '@/app/chat/page';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface MessageInputProps {
    selectedUser: string | null;
    message: string;
    setMessage: (message: string) => void;
    handleMessageSend: (e: any, imageFile?: File | null) => void;
    onTyping: () => void;
    onStopTyping: () => void;
    editingMessage?: Message | null;
    onCancelEdit?: () => void;
}

const MessageInput = ({ selectedUser, message, setMessage, handleMessageSend, onTyping, onStopTyping, editingMessage, onCancelEdit }: MessageInputProps) => {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    const isImage = imageFile && imageFile.type.startsWith('image/');

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    React.useEffect(() => {
        const handler = (e: MouseEvent | TouchEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
                setShowEmoji(false);
            }
        };
        
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler, { passive: true });
        
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (!message.trim() && !imageFile) return

        setIsUploading(true);
        await handleMessageSend(e, imageFile)
        setImageFile(null);
        setIsUploading(false)
    }

    if (!selectedUser) return null;

    const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        onTyping();
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(onStopTyping, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 border-t border-slate-800 px-3 py-3 bg-slate-900 flex-shrink-0'>
            {editingMessage && (
                <div className='flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg border-l-2 border-blue-500'>
                    <div className='flex items-center gap-2'>
                        <Pencil className='w-3.5 h-3.5 text-blue-400' />
                        <span className='text-xs text-blue-400 font-medium'>Editing message</span>
                        <span className='text-xs text-slate-400 truncate max-w-[200px]'>{editingMessage.text}</span>
                    </div>
                    <button type='button' onClick={onCancelEdit} className='text-slate-400 hover:text-white'>
                        <X className='w-4 h-4' />
                    </button>
                </div>
            )}
            {imageFile && (
                <div className='relative w-fit'>
                    {isImage ? (
                        <img src={URL.createObjectURL(imageFile)} alt="preview" className='w-24 h-24 object-cover rounded-lg border border-slate-600' />
                    ) : (
                        <div className='flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-600'>
                            <FileText className='w-5 h-5 text-blue-400' />
                            <div className='flex flex-col'>
                                <span className='text-xs text-white font-medium truncate max-w-[150px]'>{imageFile.name}</span>
                                <span className='text-xs text-slate-400'>{(imageFile.size / 1024).toFixed(1)} KB</span>
                            </div>
                        </div>
                    )}
                    <button type='button' className='absolute -top-2 -right-2 bg-black rounded-full p-1'
                        onClick={() => setImageFile(null)}>
                        <X className='w-4 h-4 text-white' />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-1.5">
                <label className='cursor-pointer flex-shrink-0 bg-slate-900 hover:bg-slate-800 rounded-lg p-2.5 transition-colors border border-slate-800'>
                    <Paperclip size={18} className='text-slate-300' />
                    <input type="file" accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar" className='hidden' onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const maxSize = 10 * 1024 * 1024; // 10MB
                            if (file.size > maxSize) {
                                alert('File size must be less than 10MB');
                                return;
                            }
                            setImageFile(file);
                        }
                    }} />
                </label>

                <div ref={emojiRef} className="relative flex-shrink-0">
                    {showEmoji && (
                        isMobile ? (
                            <div 
                                className="fixed inset-0 flex items-end justify-center z-50 bg-black/40 animate-in fade-in duration-200 pb-20"
                                onClick={(e) => e.target === e.currentTarget && setShowEmoji(false)}
                                onTouchStart={(e) => e.target === e.currentTarget && setShowEmoji(false)}
                            >
                                <div 
                                    className="animate-in slide-in-from-bottom-4 duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                >
                                    <EmojiPicker
                                        theme={Theme.DARK}
                                        onEmojiClick={(emojiData: EmojiClickData) => setMessage(message + emojiData.emoji)}
                                        height={Math.min(400, window.innerHeight - 200)}
                                        width={Math.min(380, window.innerWidth - 32)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="absolute bottom-14 left-0 z-50">
                                <EmojiPicker
                                    theme={Theme.DARK}
                                    onEmojiClick={(emojiData: EmojiClickData) => setMessage(message + emojiData.emoji)}
                                    height={350}
                                    width={320}
                                />
                            </div>
                        )
                    )}
                    <button type='button' onClick={() => setShowEmoji(p => !p)}
                        className='bg-slate-900 hover:bg-slate-800 rounded-lg p-2.5 transition-colors border border-slate-800'>
                        <Smile size={18} className='text-slate-300' />
                    </button>
                </div>

                <input type="text" className='flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors'
                    placeholder={imageFile ? "Add a caption..." : "Type a message..."}
                    value={message}
                    onChange={handleTypingChange} />

                <button type='submit' disabled={isUploading || (!message.trim() && !imageFile)}
                    className='flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2.5 transition-colors'>
                    <Send size={18} className='text-white' />
                </button>
            </div>
        </form>
    )
}

export default MessageInput