import { create } from 'zustand';

import type { Session } from '@/lib/auth-client';

interface AuthState {
	session: Session | null;
	isPending: boolean;
}

interface AuthActions {
	setSession: (session: Session | null) => void;
	setPending: (v: boolean) => void;
	clear: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
	session: null,
	isPending: true,
};

/**
 * @description
 * Auth store for managing user session
 */
export const useAuthStore = create<AuthStore>()((set) => ({
	...initialState,
	setSession: (session) => set({ session, isPending: false }),
	setPending: (isPending) => set({ isPending }),
	clear: () => set(initialState),
}));
