import { create } from "zustand";

type ConnectionStatus = "connected" | "connecting" | "disconnected";

type ChatUiState = {
  activeRoomId: string | null;
  activeDmUserId: string | null;
  connectionStatus: ConnectionStatus;
  setActiveRoomId: (roomId: string | null) => void;
  setActiveDmUserId: (userId: string | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
};

export const useChatUiStore = create<ChatUiState>((set) => ({
  activeRoomId: null,
  activeDmUserId: null,
  connectionStatus: "disconnected",
  setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
  setActiveDmUserId: (userId) => set({ activeDmUserId: userId }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
}));
