import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { format } from "date-fns";

import EditProfile from "./EditProfile";

const Sidebar = ({
  conversations,
  selectedUser,
  setSelectedUser,
  typingUser,
  showSidebar,
  setShowSidebar,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed md:static z-50 w-80 h-full bg-white shadow-md border-r border-base-300 flex flex-col transition-all duration-300
    ${showSidebar ? "left-0" : "-left-full"}
    `}
    >
      <div className="p-5 border-b border-base-300 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chats</h1>

        <button
          onClick={() => setShowSidebar(false)}
          className="btn btn-ghost btn-circle md:hidden"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* USERS LIST */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const user = conversation.user;

          const unread = conversation.unreadCount > 0;

          return (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setShowSidebar(false);
              }}
              className={`w-full p-4 flex items-center gap-4 transition border-b border-base-200 hover:bg-base-200 ${
                unread ? "bg-green-50" : ""
              } ${selectedUser?._id === user._id ? "bg-base-200" : ""}`}
            >
              {/* AVATAR */}
              <div className="relative">
                <img
                  src={user.avatar || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt="user"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>

              {/* MESSAGE INFO */}
              <div className="flex-1 min-w-0 text-left">
                {/* TOP ROW */}
                <div className="flex items-center justify-between">
                  <h2
                    className={`font-semibold truncate ${
                      unread ? "text-black" : ""
                    }`}
                  >
                    {user.name}
                  </h2>

                  <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                    {format(new Date(conversation.latestMessageTime), "p")}
                  </span>
                </div>

                {/* BOTTOM ROW */}
                <div className="flex items-center justify-between mt-1 gap-2">
                  <p
                    className={`text-sm truncate flex-1 ${
                      unread ? "font-medium text-black" : "text-gray-500"
                    }`}
                  >
                    {typingUser === user.name
                      ? "Typing..."
                      : `${
                          conversation.latestMessageSender ===
                          (currentUser._id || currentUser.id)
                            ? "You: "
                            : ""
                        }${conversation.latestMessage}`}
                  </p>

                  {unread && (
                    <span className="bg-green-500 text-white text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shrink-0">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CURRENT USER PROFILE */}
      <div className="p-3.5 border-t-2 border-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar online">
              <div className="w-12 rounded-full">
                <img
                  src={currentUser?.avatar || "https://i.pravatar.cc/100"}
                  alt="profile"
                />
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg">{currentUser?.name}</h2>

              <p className="text-sm text-green-500 font-medium">Active Now</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-circle"
          >
            <FiEdit size={20} />
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfile isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Sidebar;
