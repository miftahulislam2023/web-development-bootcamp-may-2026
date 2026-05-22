import { db } from '@socialIO/db';
import { userProfile } from '@socialIO/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { presenceGetBulk, presenceRefresh, presenceSetOffline, presenceSetOnline } from '@socialIO/db/redis/service';

export async function setOnline(userId: string): Promise<void> {
	await presenceSetOnline(userId);
}

export async function refreshPresenceTTL(userId: string): Promise<void> {
	await presenceRefresh(userId);
}

export async function setOffline(userId: string): Promise<void> {
	await presenceSetOffline(userId);
	await db.update(userProfile).set({ lastSeenAt: new Date() }).where(eq(userProfile.id, userId));
}

export async function getBulkPresence(userIds: string[]): Promise<Record<string, boolean>> {
	return presenceGetBulk(userIds);
}

export async function getLastSeen(userIds: string[]): Promise<Record<string, Date | null>> {
	if (userIds.length === 0) return {};
	const ids = userIds.slice(0, 50);

	const rows = await db
		.select({ id: userProfile.id, lastSeenAt: userProfile.lastSeenAt })
		.from(userProfile)
		.where(inArray(userProfile.id, ids));

	const result: Record<string, Date | null> = {};
	ids.forEach((id) => {
		result[id] = null;
	});
	rows.forEach((row) => {
		result[row.id] = row.lastSeenAt ?? null;
	});
	return result;
}
