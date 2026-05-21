import { useEffect, useState, useCallback } from "react";

import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";

import socket from "../socket/socket";
import axiosInstance from "../lib/axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const currentUser = JSON.parse(
  localStorage.getItem("user")
);

  const fetchConversations = useCallback(async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      const userId = currentUser._id || currentUser.id;

      const response = await axiosInstance.get(
        `/conversations?userId=${userId}`,
      );

      setConversations(response.data.conversations);

      if (response.data.conversations.length > 0) {
        setSelectedUser((prev) => {
          if (prev) return prev;
          return response.data.conversations[0].user;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const userId = currentUser?._id || currentUser?.id;

    if (userId) {
      socket.emit("join", userId);
    }
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      fetchConversations();
    });

    return () => {
      socket.off("receive_message");
    };
  }, [fetchConversations]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!selectedUser) return;

        const response = await axiosInstance.get(
          `/messages?senderId=${
            currentUser._id || currentUser.id
          }&receiverId=${selectedUser._id}`,
        );

        setMessages(response.data.messages);
        await axiosInstance.put("/messages/seen", {
          senderId: selectedUser._id,
          receiverId: currentUser._id || currentUser.id,
        });

        await new Promise((resolve) => setTimeout(resolve, 200));

        socket.emit("messages_seen", {
          senderId: selectedUser._id,
        });
        fetchConversations();
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedUser, fetchConversations]);

  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    socket.on("typing", (userName) => {
      setTypingUser(userName);
    });

    socket.on("stop_typing", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  useEffect(() => {
    socket.on("messages_seen", () => {
      setMessages((prev) =>
        prev.map((msg) => {
          const senderId = msg.senderId?._id || msg.senderId;

          const receiverId = msg.receiverId?._id || msg.receiverId;

          if (
            senderId === (currentUser?._id || currentUser?.id) &&
            receiverId === selectedUser?._id
          ) {
            return {
              ...msg,
              seen: true,
            };
          }

          return msg;
        }),
      );
    });

    return () => {
      socket.off("messages_seen");
    };
  }, [selectedUser, currentUser]);

  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const messageData = {
      text: messageText,
      senderId: currentUser._id || currentUser.id,
      senderName: currentUser.name,
      receiverId: selectedUser?._id,
      createdAt: new Date(),
    };

    socket.emit("send_message", messageData);
  };

  return (
    <div className="h-screen bg-base-200 flex overflow-hidden">
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        ></div>
      )}

      <Sidebar
        conversations={conversations}
        onlineUsers={onlineUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        typingUser={typingUser}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedUser={selectedUser}
          onlineUsers={onlineUsers}
          setShowSidebar={setShowSidebar}
        />

        <MessageList
          messages={messages.filter((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;

            const receiverId = msg.receiverId?._id || msg.receiverId;

            return (
              senderId === selectedUser?._id || receiverId === selectedUser?._id
            );
          })}
          typingUser={typingUser}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
};

export default Chat;
