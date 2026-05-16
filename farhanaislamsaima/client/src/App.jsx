import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import apiClient from './api/apiClient';
import AuthPage from './components/AuthPage';
import ChatPage from './components/ChatPage';
import { registerNotifications } from './utils/notifications';
import {
  getSavedToken,
  getSavedUser,
  removeUser,
  saveToken,
  saveUser
} from './utils/storage';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
const socket = io(socketUrl, {
  autoConnect: false
});

function playSendSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 620;
  gain.gain.setValueAtTime(0.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function App() {
  const [user, setUser] = useState(() => (
    getSavedToken() ? getSavedUser() : null
  ));
  const [mode, setMode] = useState('login');
  const [authMessage, setAuthMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [status, setStatus] = useState('Connecting...');
  const [typingUser, setTypingUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    const token = getSavedToken();

    if (!token) {
      removeUser();
      setUser(null);
      return;
    }

    socket.auth = { token };
    socket.connect();
    registerNotifications().catch((error) => {
      console.log('Notification registration failed:', error);
    });
    setStatus(socket.connected ? 'Connected' : 'Connecting...');

    async function loadChatData() {
      try {
        const [usersRes, conversationsRes] = await Promise.all([
          apiClient.get('/conversations/users'),
          apiClient.get(`/conversations?userId=${user.id}`)
        ]);

        setUsers(usersRes.data);
        setConversations(conversationsRes.data);

        if (!selectedConversation && conversationsRes.data.length > 0) {
          setSelectedConversation(conversationsRes.data[0]);
        }
      } catch (err) {
        console.log(err);
        setStatus('Could not load chats');
      }
    }

    loadChatData();

    socket.on('connect', () => {
      setStatus('Connected');
    });

    socket.on('receiveMessage', (msg) => {
      setMessages((oldMessages) => [...oldMessages, msg]);
      setTypingUser('');
    });

    socket.on('typing', (payload) => {
      if (payload.userId !== user.id) {
        setTypingUser(payload.userName);
      }
    });

    socket.on('stopTyping', (payload) => {
      if (payload.userId !== user.id) {
        setTypingUser('');
      }
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      try {
        const res = await apiClient.get(
          `/messages?conversationId=${selectedConversation.id}`
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
        setStatus('Could not load messages');
      }
    }

    socket.emit('joinConversation', selectedConversation.id);
    setTypingUser('');
    loadMessages();

    return () => {
      socket.emit('leaveConversation', selectedConversation.id);
    };
  }, [selectedConversation]);

  async function handleAuth(formData) {
    const url = mode === 'login' ? '/auth/login' : '/auth/register';

    setAuthMessage('');

    try {
      const res = await apiClient.post(url, formData);

      saveToken(res.data.token);
      saveUser(res.data.user);
      setUser(res.data.user);
    } catch (err) {
      const message = err.response?.data?.message || 'Server is not responding';
      setAuthMessage(message);
    }
  }

  const handleGoogleAuth = useCallback(async (credential) => {
    setAuthMessage('');

    try {
      const res = await apiClient.post('/auth/google', { credential });

      saveToken(res.data.token);
      saveUser(res.data.user);
      setUser(res.data.user);
    } catch (err) {
      const message = err.response?.data?.message || 'Google login failed';
      setAuthMessage(message);
    }
  }, []);

  function changeMode(nextMode) {
    setMode(nextMode);
    setAuthMessage('');
  }

  function logout() {
    removeUser();
    socket.disconnect();
    setUser(null);
    setConversations([]);
    setMessages([]);
    setSelectedConversation(null);
    setTypingUser('');
    setUsers([]);
  }

  async function createConversation(data) {
    try {
      const res = await apiClient.post('/conversations', {
        ...data,
        creatorId: user.id
      });

      setConversations((oldConversations) => {
        const exists = oldConversations.some(
          (conversation) => conversation.id === res.data.id
        );

        return exists ? oldConversations : [res.data, ...oldConversations];
      });
      setSelectedConversation(res.data);
    } catch (err) {
      console.log(err);
      setStatus(err.response?.data?.message || 'Could not create chat');
    }
  }

  async function leaveGroup() {
    if (!selectedConversation || selectedConversation.type !== 'group') {
      return;
    }

    try {
      await apiClient.patch(`/conversations/${selectedConversation.id}/leave`, {
        userId: user.id
      });

      socket.emit('leaveConversation', selectedConversation.id);
      setConversations((oldConversations) => (
        oldConversations.filter((conversation) => (
          conversation.id !== selectedConversation.id
        ))
      ));
      setSelectedConversation(null);
      setMessages([]);
      setTypingUser('');
      setStatus('Left group');
    } catch (err) {
      console.log(err);
      setStatus(err.response?.data?.message || 'Could not leave group');
    }
  }

  function sendMessage({ text, imageUrl }) {
    if (!selectedConversation) {
      return;
    }

    socket.emit('sendMessage', {
      conversationId: selectedConversation.id,
      imageUrl,
      senderId: user.id,
      user: user.name,
      text
    });

    playSendSound();
    stopTyping();
  }

  function typing() {
    if (!selectedConversation) {
      return;
    }

    socket.emit('typing', {
      conversationId: selectedConversation.id,
      userId: user.id,
      userName: user.name
    });
  }

  function stopTyping() {
    if (!selectedConversation) {
      return;
    }

    socket.emit('stopTyping', {
      conversationId: selectedConversation.id,
      userId: user.id
    });
  }

  if (!user) {
    return (
      <AuthPage
        mode={mode}
        message={authMessage}
        onGoogleSubmit={handleGoogleAuth}
        onModeChange={changeMode}
        onSubmit={handleAuth}
      />
    );
  }

  return (
    <ChatPage
      conversations={conversations}
      messages={messages}
      selectedConversation={selectedConversation}
      status={status}
      typingUser={typingUser}
      user={user}
      users={users}
      onCreateConversation={createConversation}
      onLeaveGroup={leaveGroup}
      onLogout={logout}
      onSelectConversation={setSelectedConversation}
      onSendMessage={sendMessage}
      onStopTyping={stopTyping}
      onTyping={typing}
    />
  );
}

export default App;
