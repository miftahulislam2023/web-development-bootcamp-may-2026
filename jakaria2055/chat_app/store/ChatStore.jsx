import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthStore";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // ← removed sessionStorage restore
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // removed sessionStorage persist effect entirely

  // =========================
  // GET USERS
  // =========================
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =========================
  // GET MESSAGES
  // =========================
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUser) return;

      setMessages([]); // clear stale messages immediately

      try {
        const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
        if (data.success) {
          setMessages(data.messages || []);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    loadMessages();
  }, [selectedUser?._id]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =========================
  // SOCKET LISTENER
  // =========================
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentUser = selectedUserRef.current;

      if (currentUser && newMessage.senderId === currentUser._id) {
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};