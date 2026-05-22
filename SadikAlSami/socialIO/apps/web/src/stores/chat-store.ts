import { create } from 'zustand';

type WSStatus = 'connecting' | 'open' | 'closed';

interface ChatState {
	activeConversationId: string | null;
	typingUsers: Record<string, string[]>;
	drafts: Record<string, string>;
	wsStatus: WSStatus;
}

interface ChatActions {
	setActiveConversation: (id: string | null) => void;
	setTypingUsers: (convId: string, userIds: string[]) => void;
	setDraft: (convId: string, text: string) => void;
	setWsStatus: (status: WSStatus) => void;
}

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
	activeConversationId: null,
	typingUsers: {},
	drafts: {},
	wsStatus: 'closed',
};

/**
 * @description
 * Chat store for managing chat state
 */
export const useChatStore = create<ChatStore>()((set) => ({
	...initialState,
	setActiveConversation: (id) => set({ activeConversationId: id }),
	setTypingUsers: (convId, userIds) => set((s) => ({ typingUsers: { ...s.typingUsers, [convId]: userIds } })),
	setDraft: (convId, text) => set((s) => ({ drafts: { ...s.drafts, [convId]: text } })),
	setWsStatus: (wsStatus) => set({ wsStatus }),
}));
