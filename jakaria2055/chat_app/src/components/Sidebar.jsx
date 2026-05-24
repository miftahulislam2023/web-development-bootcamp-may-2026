import { useContext, useEffect, useState, useRef } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthStore";
import { ChatContext } from "../../store/ChatStore";
import { EllipsisVertical, Search, LogOut, User, Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
  const usersListRef = useRef(null);

  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : users;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

  return (
    <div
      className={`h-full overflow-hidden flex flex-col bg-white/10 backdrop-blur-sm border-r border-white/20 ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 p-5 border-b border-white/20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={assets.logo} alt="logo" className="max-w-32 h-8 object-contain" />
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <EllipsisVertical className="w-5 text-gray-300" />
            </button>
            
            {showMenu && (
              <div className="absolute top-full right-0 z-20 mt-2 w-48 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {authUser?.fullName || "User"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  Edit Profile
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-2 px-4 py-2.5 border border-white/30 focus-within:border-white/50 transition-all duration-300">
          <Search className="w-4 h-4 text-gray-700" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-700 flex-1"
            placeholder="Search friends..."
          />
        </div>
      </div>

      {/* Users List Section - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-scroll scroll-smooth">
        <div className="p-3">
          {/* Header with count */}
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-300" />
              <span className="text-xs text-gray-300 font-medium">CONTACTS</span>
            </div>
            <span className="text-xs text-gray-300">{filteredUsers.length} friends</span>
          </div>

          {/* Users List */}
          <div className="space-y-1">
            {filteredUsers.map((user) => (
              <div
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMessages((prev) => ({
                    ...prev,
                    [user._id]: 0,
                  }));
                }}
                key={user._id}
                className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedUser?._id === user._id
                    ? "bg-white/20 backdrop-blur-sm shadow-sm"
                    : "hover:bg-white/10"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user?.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/30"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white/50"></span>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white font-medium text-sm truncate">
                      {user.fullName}
                    </p>
                    {(unseenMessages[user._id] || 0) > 0 && (
                      <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-purple-500/80 text-white text-xs flex items-center justify-center font-medium">
                        {unseenMessages[user._id]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {onlineUsers.includes(user._id) ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-green-400 text-xs">Online</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                        <span className="text-gray-400 text-xs">Offline</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">No friends found</p>
              <p className="text-gray-500 text-xs mt-1">Try a different search</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Footer - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-white/20 bg-white/5">
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePic || assets.avatar_icon}
            alt="Your profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {authUser?.fullName || "User"}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {authUser?.email || "user@example.com"}
            </p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;