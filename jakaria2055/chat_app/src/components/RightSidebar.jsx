import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../store/ChatStore";
import { AuthContext } from "../../store/AuthStore";
import { LogOut, Image as ImageIcon } from "lucide-react";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    const images = messages.filter((msg) => msg.image).map((msg) => msg.image);
    setMsgImages(images);
  }, [messages]);

  return (
    selectedUser && (
      <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm border-l border-white/20 relative overflow-y-auto">
        {/* Profile Section */}
        <div className="pt-8 pb-6 flex flex-col items-center gap-3 border-b border-white/20">
          <div className="relative">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30"
            />
            {onlineUsers.includes(selectedUser?._id) && (
              <span className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white/50"></span>
            )}
          </div>
          
          <h1 className="text-white font-semibold text-lg text-center px-4">
            {selectedUser.fullName}
          </h1>
          
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser?._id) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            <span>{onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}</span>
          </div>
          
          {selectedUser.bio && (
            <p className="text-gray-300 text-sm text-center px-6 py-2 bg-white/10 rounded-lg max-w-[90%]">
              {selectedUser.bio}
            </p>
          )}
        </div>

        {/* Media Section */}
        <div className="flex-1 px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            <p className="text-gray-300 text-sm font-medium">Media</p>
            {msgImages.length > 0 && (
              <span className="text-xs text-gray-400">({msgImages.length})</span>
            )}
          </div>
          
          {msgImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-white/10"
                >
                  <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm py-8 bg-white/5 rounded-lg">
              No media shared yet
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="p-4 pt-0">
          <button
            onClick={() => logout()}
            className="w-full py-2.5 bg-red-500/50 hover:bg-red-500/60 border border-red-500/30 text-red-200 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default RightSidebar;