import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { profileKeys } from '@/lib/query-keys';
import type { CreateProfileBody } from '@/types/api';

/**
 * @description
 * Creates a profile after signup via POST /api/profile.
 * Invalidates profile query on success.
 */
export function useCreateProfile() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateProfileBody) => api.post('/api/profile', data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: profileKeys.all });
		},
	});
}
