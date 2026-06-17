import NavigationRail from "@/app/rooms/components/NavigationRail";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ReactNode, Suspense } from "react";
import ChatList from "./components/ChatList";

const RoomsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-[#111b21] relative">
      {/* CHAT LIST PANEL */}
      <Suspense fallback={<LoadingSpinner />}>
        {/* NAVIGATION RAIL */}
        <NavigationRail />

        <ChatList />
      </Suspense>

      {children}
    </div>
  );
};

export default RoomsLayout;
