import { useState } from "react";
import socket from "../../socket/socket";

const MessageInput = ({ onSendMessage, selectedUser }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    onSendMessage(message);

    socket.emit("stop_typing", {
      receiverId: selectedUser?._id,
    });

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        p-4
        border-t
        border-gray-200
        bg-white
        flex
        gap-3
        shadow-sm
      "
    >
      <input
        type="text"
        placeholder="Type a message..."
        className="
          input
          flex-1
          rounded-2xl
          border
          bg-[#f4f7fb]
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#5b34f2]
        "
        value={message}
        onChange={(e) => {
          const value = e.target.value;

          setMessage(value);

          const currentUser = JSON.parse(localStorage.getItem("user"));

          if (value.trim()) {
            socket.emit("typing", {
              receiverId: selectedUser?._id,

              senderName: currentUser.name,
            });
          } else {
            socket.emit("stop_typing", {
              receiverId: selectedUser?._id,
            });
          }
        }}
      />

      <button
        className="
          btn
          border-none
          rounded-2xl
          px-8
          bg-[#5b34f2]
          hover:bg-[#4b28d9]
          text-white
          shadow-md
        "
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
