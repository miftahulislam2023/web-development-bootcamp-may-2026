import { useState } from 'react'
import { Chatbot } from 'supersimpledev'
import  dayjs  from 'dayjs'

export function ChatInput({ chatMessages, setChatMessages, }) {

    const [inputText, setInputText] = useState('')
    const [messageTime, setMessageTime] = useState(dayjs().format('h:mm A'))
    
    const time = dayjs().format('h:mm A')

    function saveInputText() {
        setInputText(event.target.value)
        setMessageTime(time)
    }

    function sendMessage() {

        const newChatMessages = [

            ...chatMessages,
            {
                message: inputText,
                time: messageTime,
                sender: 'user',
                id: crypto.randomUUID()
            }

        ]

        setChatMessages(newChatMessages)
        setInputText('')
        setMessageTime(time)

        const response = Chatbot.getResponse(inputText)
        setChatMessages([
            ...newChatMessages,
            {
                message: response,
                time: messageTime,
                sender: 'robot',
                id: crypto.randomUUID()
            }
        ])
        console.log(response)
    }

    function sendText() {
        if (event.key === 'Enter') {
            const newChatMessages = [

                ...chatMessages,
                {
                    message: inputText,
                    time: messageTime,
                    sender: 'user',
                    id: crypto.randomUUID()
                }

            ]

            setChatMessages(newChatMessages)
            setInputText('')
            setMessageTime(time)

            const response = Chatbot.getResponse(inputText)
            setChatMessages([
                ...newChatMessages,
                {
                    message: response,
                    time: messageTime,
                    sender: 'robot',
                    id: crypto.randomUUID()
                }
            ])
            console.log(response)
        }

        if (event.key === 'Escape') {
            setInputText('')
        }
    }

    return (
        <div className="chatField">
            <input className="chatInput" placeholder="Send a message to ChatBox" size="50"
                onChange={saveInputText}
                onKeyDown={sendText}
                value={inputText}
            />
            <button className="sendBtn" onClick={sendMessage}>Send</button>
        </div>
    )
}