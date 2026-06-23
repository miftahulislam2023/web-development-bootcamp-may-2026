import { useState} from 'react'
import {Chatbot} from 'supersimpledev'
import { ChatInput } from './components/ChatInput'
import { ChatMessage } from './components/ChatMessage'
import  ChatMessages  from './components/ChatMessages'

import './App.css'

function App() {

  const [chatMessages, setChatMessages] = useState([])

  return (
    <div className="appContainer">
      <ChatMessages
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />

      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />

    </div>
  )
}

export default App
