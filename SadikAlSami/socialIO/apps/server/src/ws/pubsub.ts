import { pub, sub, RedisKeys } from '@socialIO/db/redis';
import type { OutboundEvent } from './types';
import { pushToRoom, pushToAllRooms } from './registry';

const subscribedChannels = new Set<string>();

sub.on('message', (channel: string, payload: string) => {
	if (channel === RedisKeys.globalChannel) {
		pushToAllRooms(payload);
		return;
	}
	const conversationId = channel.replace('conversation:', '');
	pushToRoom(conversationId, payload);
});

export async function publish(conversationId: string, event: OutboundEvent): Promise<void> {
	await pub.publish(RedisKeys.channel(conversationId), JSON.stringify(event));
}

export async function publishGlobal(event: OutboundEvent): Promise<void> {
	await pub.publish(RedisKeys.globalChannel, JSON.stringify(event));
}

export async function subscribeToConversation(conversationId: string): Promise<void> {
	const channel = RedisKeys.channel(conversationId);
	if (subscribedChannels.has(channel)) return;

	await sub.subscribe(channel, (err) => {
		if (err) console.error(`[pubsub] subscribe error on ${channel}:`, err);
	});

	subscribedChannels.add(channel);
}

export async function subscribeToGlobal(): Promise<void> {
	if (subscribedChannels.has(RedisKeys.globalChannel)) return;

	await sub.subscribe(RedisKeys.globalChannel, (err) => {
		if (err) console.error('[pubsub] global subscribe error:', err);
	});

	subscribedChannels.add(RedisKeys.globalChannel);
}
