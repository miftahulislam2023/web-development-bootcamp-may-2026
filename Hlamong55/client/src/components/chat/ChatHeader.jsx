import { formatDistanceToNow } from "date-fns";
import { RiLogoutCircleRLine } from "react-icons/ri";

const ChatHeader = ({ selectedUser, onlineUsers, setShowSidebar }) => {
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return (
    <div className="h-18 bg-base-100 border-b border-base-300 px-5 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => setShowSidebar(true)}
          className="btn btn-ghost btn-circle md:hidden"
        >
          ☰
        </button>

        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.avatar || "https://i.pravatar.cc/100?img=2"}
              alt="user"
            />
          </div>
        </div>

        <div className="ml-3">
          <h2 className="font-semibold text-lg">
            {selectedUser?.name || "Select User"}
          </h2>

          <p
            className={`text-sm ${isOnline ? "text-green-500 font-semibold" : "text-gray-500 font-medium"}`}
          >
            {isOnline
              ? "Online"
              : selectedUser?.lastSeen
                ? `Last seen ${formatDistanceToNow(
                    new Date(selectedUser.lastSeen),
                    {
                      addSuffix: true,
                    },
                  )}`
                : "Offline"}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
        className="btn btn-sm bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition rounded-lg"
      >
        Logout
        <RiLogoutCircleRLine size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;
