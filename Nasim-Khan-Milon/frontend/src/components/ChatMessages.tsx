import { Message } from '@/app/chat/page';
import { User } from '@/context/AppContext';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef } from 'react'
import moment from 'moment';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessagesProps {
    selectedUser: string | null;
    messages: Message[] | null;
    loggedInUser: User | null;
}

const ChatMessages = ({ selectedUser, messages, loggedInUser }: ChatMessagesProps) => {

    const bottomRef = useRef<HTMLDivElement>(null);

    //seen features
    const uniqueMessages = useMemo(() => {
        if (!messages) return [];

        const seen = new Set();
        return messages.filter((message) => {
            if (!message || !message.id) {
                return false;
            }

            if (seen.has(message.id)) {
                return false;
            }
            seen.add(message.id);
            return true;
        });
    }, [messages]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, uniqueMessages]);



    return (
        <div className="flex-1 overflow-hidden">
            <div className="h-full max-h-[calc(100vh-215px)] overflow-y-auto p-2 space-y-2 custom-scroll">
                {
                    !selectedUser ? (
                        <p className="text-gray-400 text-center mt-20">Please select a user to start chatting 📩</p>
                    ) : (
                        <>
                            {
                                uniqueMessages.map((e, i) => {
                                    const isSentByMe = e.sender === loggedInUser?.id;
                                    const uniqueKey = `${e.id}-${i}`

                                    return (
                                        <div className={`flex flex-col gap-1 mt-2 ${isSentByMe ? "items-end" : "items-start"}`} key={uniqueKey}>
                                            <div
                                                className={`rounded-lg p-3 max-w-sm ${isSentByMe ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}
                                            >
                                                {e.messageType === "image" && e.image?.url && (
                                                    <div className="relative group">
                                                        <img
                                                            src={e.image.url}
                                                            alt="sharedimage"
                                                            className="object-cover rounded-lg max-w-[250px] max-h-[300px]"
                                                        />
                                                    </div>
                                                )}

                                                {e.text && <p className='mt-1'>{e.text}</p>}
                                            </div>

                                            <div className={`flex items-center gap-1 text-xl text-gray-400 ${isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"}`}>
                                                <span>{moment(e.createdAt).format("hh:mm A . MMM D")}</span>
                                                {
                                                    isSentByMe &&
                                                    <div className="flex items-center ml-1">
                                                        {
                                                            e.seen ? (
                                                                <div className='flex items-center gap-1'>
                                                                    <CheckCheck className='w-3 h-3' />
                                                                    {
                                                                        e.seenAt && (
                                                                            <span>{moment(e.seenAt).format("hh:mm A · MMM D")}</span>
                                                                        )
                                                                    }
                                                                </div>
                                                            ) : (
                                                                <Check className='w-3 h-3 text-gray-500' />
                                                            )
                                                        }
                                                    </div>

                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div ref={bottomRef} />
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default ChatMessages