import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { profileKeys } from '@/lib/query-keys';
import type { SearchResult } from '@/types/api';

/**
 * @description
 * Searches for user profiles via GET /api/profile/search?q=.
 * The backend returns { user_profile, user } pairs — we map to flat SearchResult.
 * Enabled only when query is >= 2 characters.
 */
export function useSearchUsers(query: string) {
	return useQuery({
		queryKey: profileKeys.search(query),
		queryFn: async (): Promise<SearchResult[]> => {
			const res = await api.get('/api/profile/search', { params: { q: query } });
			const raw = res.data.results as Array<{
				user_profile: { id: string; displayName: string; avatarUrl: string | null };
				user: { id: string; name: string; email: string };
			}>;
			return raw.map((r) => ({
				id: r.user_profile.id,
				displayName: r.user_profile.displayName,
				avatarUrl: r.user_profile.avatarUrl,
			}));
		},
		enabled: query.length >= 2,
		staleTime: 5 * 60_000,
	});
}
