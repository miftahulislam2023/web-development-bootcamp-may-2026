import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../library/utils";
import { ChatContext } from "../../store/ChatStore";
import { AuthContext } from "../../store/AuthStore";
import toast from "react-hot-toast";
import { CircleChevronLeft, Images, Info, Send, MessageCircle, ArrowLeft } from "lucide-react";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 bg-white/5 max-md:hidden select-none">
    {/* Animated chat bubbles */}
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping" />
      <div className="relative w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center">
        <MessageCircle className="w-10 h-10 text-purple-400" />
      </div>
    </div>

    {/* Skeleton preview cards */}
    <div className="flex flex-col gap-3 w-64">
      {/* Incoming bubble skeleton */}
      <div className="flex items-end gap-2 flex-row-reverse">
        <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="h-8 w-40 rounded-lg rounded-bl-none bg-white/10 animate-pulse" />
          <div className="h-3 w-12 rounded bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Outgoing bubble skeleton */}
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-1 items-end">
          <div className="h-8 w-52 rounded-lg rounded-br-none bg-purple-500/20 animate-pulse" />
          <div className="h-3 w-12 rounded bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Incoming bubble skeleton smaller */}
      <div className="flex items-end gap-2 flex-row-reverse">
        <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="h-8 w-28 rounded-lg rounded-bl-none bg-white/10 animate-pulse" />
          <div className="h-3 w-12 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>

    {/* Text */}
    <div className="text-center">
      <p className="text-white font-medium text-base mb-1">Your messages</p>
      <p className="text-gray-400 text-sm">
        Select a friend to start chatting
      </p>
    </div>

    {/* Fake input bar */}
    <div className="flex items-center gap-3 w-64 px-4 py-2.5 rounded-full bg-white/10 border border-white/10">
      <p className="text-gray-500 text-sm flex-1">Send a message...</p>
      <Send size={14} className="text-gray-600" />
    </div>

    {/* Arrow hint pointing left toward sidebar */}
    <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
      <ArrowLeft className="w-3 h-3 animate-bounce-x" />
      <span>Pick someone from the list</span>
    </div>
  </div>
);

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (scrollEnd.current && messages.length > 0) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-hidden flex flex-col relative backdrop-blur-lg">
      {/* CHAT PROFILE HEADER */}
      <div className="flex-shrink-0 flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <CircleChevronLeft
          onClick={() => setSelectedUser(null)}
          className="md:hidden max-w-7 cursor-pointer"
        />
        <Info className="max-md:hidden max-w-5" />
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end mb-2 ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
              />
            ) : (
              <p
                className={`p-1.5 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser?._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs flex-shrink-0">
              <img
                src={
                  msg.senderId === authUser?._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-400 text-xs">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT BAR */}
      <div className="flex-shrink-0 flex items-center gap-3 p-3 border-t border-white/10">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            type="text"
            placeholder="Leave Message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <Images className="w-7 cursor-pointer text-gray-300 hover:text-white transition-colors" />
          </label>
        </div>
        <Send
          onClick={handleSendMessage}
          size={16}
          className="w-10 h-7 cursor-pointer rounded-full p-1 bg-purple-500 hover:bg-purple-600 transition-colors flex-shrink-0"
        />
      </div>
    </div>
  ) : (
    <EmptyState />
  );
};

export default ChatContainer;