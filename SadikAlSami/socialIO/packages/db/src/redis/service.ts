import { redis, RedisKeys, RedisTTL } from './index';

/**
 * @description
 * Adds a message to the Redis cache for a specific conversation. This function is used after a new message is created in the database to ensure that the cache remains up-to-date with the latest messages.
 *
 * @param conversationId - The ID of the conversation to which the message belongs.
 * @param sequenceNumber - The sequence number of the message, used as the score in the sorted set for ordering.
 * @param messageJson - The JSON string representation of the message to be cached.
 *
 * @returns A promise that resolves when the message has been added to the cache and the cache has been trimmed to maintain a maximum of 50 messages.
 */
export async function cacheAddMessage(
	conversationId: string,
	sequenceNumber: number,
	messageJson: string,
): Promise<void> {
	const key = RedisKeys.messageCache(conversationId);

	// Redis pipeline to execute multiple commands
	const pipeline = redis.pipeline();

	// Add the new message to the sorted set with the sequence number as the score
	// First remove any existing message with the same sequence number to prevent duplicates
	// (Since ZADD uniqueness is based on the string itself, an updated message would create a duplicate)
	pipeline.zremrangebyscore(key, sequenceNumber, sequenceNumber);
	pipeline.zadd(key, sequenceNumber, messageJson);
	pipeline.zremrangebyrank(key, 0, -51);
	pipeline.expire(key, RedisTTL.messageCache);

	await pipeline.exec();
}

/**
 * @description
 * Retrieves messages from the Redis cache for a specific conversation. This function is used to quickly fetch recent messages without hitting the database, improving performance for frequently accessed conversations.
 *
 * @param conversationId - The ID of the conversation for which to retrieve messages.
 * @param limit - The maximum number of messages to retrieve from the cache.
 *
 * @returns A promise that resolves to an array of message JSON strings if the cache contains messages, or null if the cache is empty (indicating a cache miss and that the database should be queried).
 */
export async function cacheGetMessages(conversationId: string, limit: number): Promise<string[] | null> {
	const key = RedisKeys.messageCache(conversationId);
	const cached = await redis.zrevrangebyscore(key, '+inf', '-inf', 'LIMIT', 0, limit);
	return cached.length === limit ? cached : null;
}

/**
 * @description
 * Updates a specific message in the Redis cache for a conversation. This function is used when a message is edited to ensure that the cache reflects the latest content of the message.
 *
 * @param conversationId - The ID of the conversation to which the message belongs.
 * @param sequenceNumber - The sequence number of the message to be updated, used to identify the message in the sorted set.
 * @param messageJson - The new JSON string representation of the message after editing.
 *
 * @returns A promise that resolves when the message has been updated in the cache. The function removes the old message with the same sequence number and adds the updated message to maintain cache consistency.
 */
export async function cacheUpdateMessage(
	conversationId: string,
	sequenceNumber: number,
	messageJson: string,
): Promise<void> {
	const key = RedisKeys.messageCache(conversationId);

	const pipeline = redis.pipeline();
	// Remove and Update the old message with the same sequence number
	pipeline.zremrangebyscore(key, sequenceNumber, sequenceNumber);
	pipeline.zadd(key, sequenceNumber, messageJson);

	await pipeline.exec();
}

/**
 * @description
 * Adds multiple messages to the Redis cache for a specific conversation in bulk. This function is useful when multiple messages are created at once (e.g., during a batch import or when syncing messages) to efficiently update the cache with minimal round trips to Redis.
 *
 * @param conversationId - The ID of the conversation to which the messages belong.
 * @param messages - An array of objects containing the sequence number and JSON string representation of each message to be added to the cache.
 * @param limit - The maximum number of messages to keep in the cache after adding the new messages. Older messages will be removed if the total exceeds this limit.
 *
 * @returns A promise that resolves when all messages have been added to the cache and the cache has been trimmed to maintain the specified limit.
 */
export async function cacheBulkAddMessages(
	conversationId: string,
	messages: { sequenceNumber: number; messageJson: string }[],
	limit: number,
): Promise<void> {
	const key = RedisKeys.messageCache(conversationId);

	const pipeline = redis.pipeline();

	messages.forEach(({ sequenceNumber, messageJson }) => {
		pipeline.zremrangebyscore(key, sequenceNumber, sequenceNumber);
		pipeline.zadd(key, sequenceNumber, messageJson);
	});

	pipeline.zremrangebyrank(key, 0, -(limit + 1));
	pipeline.expire(key, RedisTTL.messageCache);

	await pipeline.exec();
}

/**
 * @description
 * Sets a user's presence status to "online" in Redis. This function is called when a user connects to the application (e.g., logs in or opens the app) to indicate that they are currently active. The presence information includes the user's status and the last seen timestamp, which can be used by other users to see who is online and when they were last active.
 *
 * @param userId - The ID of the user whose presence status is being set to online.
 *
 * @returns A promise that resolves when the user's presence status has been updated in Redis. The presence information is stored as a hash with an expiration time to automatically remove stale presence data after a certain period of inactivity.
 */
export async function presenceSetOnline(userId: string): Promise<void> {
	const key = RedisKeys.presence(userId);
	await redis.hset(key, { status: 'online', last_seen: Date.now().toString() });
	await redis.expire(key, RedisTTL.presence);
}

/**
 * @description
 * Refreshes a user's presence status in Redis by updating the expiration time. This function is called periodically (e.g., via a heartbeat mechanism) while the user is active to ensure that their presence status remains "online" and does not expire due to inactivity. By refreshing the expiration time, we can maintain an accurate representation of which users are currently online.
 *
 * @param userId - The ID of the user whose presence status is being refreshed.
 *
 * @returns A promise that resolves when the user's presence status has been refreshed in Redis. If the user's presence key does not exist (e.g., if they have been offline for too long), this function will have no effect, and their presence status will be considered offline until they set it online again.
 */
export async function presenceRefresh(userId: string): Promise<void> {
	const key = RedisKeys.presence(userId);
	await redis.expire(key, RedisTTL.presence);
}

/**
 * @description
 * Sets a user's presence status to "offline" in Redis. This function is called when a user disconnects from the application (e.g., logs out or closes the app) to indicate that they are no longer active. By removing the user's presence key from Redis, we can ensure that other users see them as offline and that their presence information does not persist indefinitely.
 *
 * @param userId - The ID of the user whose presence status is being set to offline.
 *
 * @returns A promise that resolves when the user's presence status has been removed from Redis. This effectively marks the user as offline, and their presence information will no longer be available until they set it online again.
 */
export async function presenceSetOffline(userId: string): Promise<void> {
	const key = RedisKeys.presence(userId);
	await redis.del(key);
}

/**
 * @description
 * Retrieves the presence status of multiple users in bulk from Redis. This function is used to efficiently check the online/offline status of a list of users without making individual calls for each user. It returns a mapping of user IDs to their presence status (true for online, false for offline), allowing the application to quickly determine which users are currently active.
 *
 * @param userIds - An array of user IDs for which to retrieve presence status. The function will process up to 50 user IDs at a time to avoid excessive load on Redis.
 *
 * @returns A promise that resolves to an object mapping each user ID to a boolean indicating their presence status (true for online, false for offline). If the input array is empty, it returns an empty object.
 */
export async function presenceGetBulk(userIds: string[]): Promise<Record<string, boolean>> {
	if (userIds.length === 0) return {};

	// Limit to 50 user IDs to prevent excessive load on Redis
	const ids = userIds.slice(0, 50);

	const pipeline = redis.pipeline();

	// Check the existence of each user's presence key in Redis
	ids.forEach((id) => {
		pipeline.exists(RedisKeys.presence(id));
	});
	const results = await pipeline.exec();

	// Map the results to a user ID -> presence status (true for online, false for offline)
	const map: Record<string, boolean> = {};
	ids.forEach((id, i) => {
		map[id] = (results?.[i]?.[1] as number) === 1;
	});

	return map;
}

/**
 * @description
 * Sets a user's typing status in Redis for a specific conversation. This function is called when a user starts typing a message in a conversation to indicate to other participants that they are actively composing a message. The typing status is stored with an expiration time, so it will automatically be removed after a certain period of inactivity (e.g., if the user stops typing or leaves the conversation).
 *
 * @param conversationId - The ID of the conversation for which to set typing status.
 * @param userId - The ID of the user whose typing status is being set.
 *
 * @returns A promise that resolves when the user's typing status has been set in Redis. The typing status is stored as a simple key with an expiration time, allowing other users to check if someone is currently typing in the conversation.
 */
export async function typingSet(conversationId: string, userId: string): Promise<void> {
	await redis.set(RedisKeys.typing(conversationId, userId), '1', 'EX', RedisTTL.typing);
}

/**
 * @description
 * Clears a user's typing status in Redis for a specific conversation. This function is called when a user stops typing a message in a conversation (e.g., after sending the message or if they navigate away) to indicate to other participants that they are no longer actively composing a message. By removing the typing status from Redis, we can ensure that other users see an accurate representation of who is currently typing in the conversation.
 *
 * @param conversationId - The ID of the conversation for which to clear typing status.
 * @param userId - The ID of the user whose typing status is being cleared.
 *
 * @returns A promise that resolves when the user's typing status has been removed from Redis. This effectively marks the user as not typing, and their typing status will no longer be available until they set it again by starting to type.
 */
export async function typingClear(conversationId: string, userId: string): Promise<void> {
	await redis.del(RedisKeys.typing(conversationId, userId));
}

/**
 * @description
 * Retrieves the list of user IDs who are currently typing in a specific conversation from Redis. This function is used to show real-time typing indicators to participants in a conversation, allowing them to see who is actively composing a message. It uses a pattern matching approach to find all keys related to typing status for the given conversation and extracts the user IDs from those keys.
 *
 * @param conversationId - The ID of the conversation for which to retrieve typing users.
 *
 * @returns A promise that resolves to an array of user IDs who are currently typing in the specified conversation. If no users are typing, it returns an empty array.
 */

// TODO: Avoid SCAN for Typing Indicators Later (becomes inefficient because Redis still scans globally.)
/**
* A more scalable architecture:
    SET typing:convId:userId 1 EX 5
    SADD typing_users:convId userId
* Then:
    SMEMBERS typing_users:convId
    periodically cleanup expired users
* OR:
    Use a Redis sorted set with timestamps.
 */
export async function typingGetUsers(conversationId: string): Promise<string[]> {
	const keys = await scanKeys(RedisKeys.typingPattern(conversationId));
	// "typing:conv123:userA" → split on ":" → index 2 = userId
	return keys.flatMap((key) => {
		const [, , userId] = key.split(':');
		return userId ? [userId] : [];
	});
}

// SCAN instead of KEYS to avoid blocking on large datasets
async function scanKeys(pattern: string): Promise<string[]> {
	const keys: string[] = [];
	let cursor = '0';
	do {
		const [next, found] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
		cursor = next;
		keys.push(...found);
	} while (cursor !== '0');
	return keys;
}
