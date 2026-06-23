import { useRef, useEffect } from 'react'
import {Chatbot} from 'supersimpledev'
import { ChatMessage } from './ChatMessage'

function ChatMessages({ chatMessages}) {

  const chatMessagesRef = useRef(null)

  useEffect(() => {
    const containerElem = chatMessagesRef.current
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight
    }
  }, [chatMessages])

  return (
    <div className="chatContainer" ref={chatMessagesRef}>
      {
        chatMessages.map((chatMessage) => {
          return (
            <ChatMessage
              message={chatMessage.message}
              time={chatMessage.time}
              sender={chatMessage.sender}
              key={chatMessage.id}
            />
          )
        })
      }
    </div>
  )
}

export default ChatMessages