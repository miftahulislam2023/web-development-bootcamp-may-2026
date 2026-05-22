import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { profileKeys } from '@/lib/query-keys';
import { profileResponseSchema } from '@/types/api';
import type { ProfileResponse } from '@/types/api';

/**
 * @description
 * Fetches the current user's profile via GET /api/profile/me.
 * Returns { exists, profile } — used to check if onboarding is needed.
 */
export function useProfile() {
	return useQuery({
		queryKey: profileKeys.me(),
		queryFn: async (): Promise<{ exists: boolean; profile: ProfileResponse | null }> => {
			const res = await api.get('/api/profile/me');
			const { exists, profile } = res.data;
			return {
				exists: Boolean(exists),
				profile: profile ? profileResponseSchema.parse(profile) : null,
			};
		},
		retry: false,
	});
}
