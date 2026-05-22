import type { WSContext } from 'hono/ws';

const roomSockets = new Map<string, Set<WSContext>>();
const userRooms = new Map<string, Set<string>>();

export function joinRoom(conversationId: string, userId: string, ws: WSContext): void {
	if (!roomSockets.has(conversationId)) {
		roomSockets.set(conversationId, new Set());
	}
	roomSockets.get(conversationId)!.add(ws);

	if (!userRooms.has(userId)) {
		userRooms.set(userId, new Set());
	}
	userRooms.get(userId)!.add(conversationId);
}

export function leaveRoom(conversationId: string, userId: string, ws: WSContext): void {
	roomSockets.get(conversationId)?.delete(ws);
	if (roomSockets.get(conversationId)?.size === 0) {
		roomSockets.delete(conversationId);
	}
	userRooms.get(userId)?.delete(conversationId);
}

export function leaveAllRooms(userId: string, ws: WSContext): string[] {
	const rooms = [...(userRooms.get(userId) ?? [])];

	for (const convId of rooms) {
		roomSockets.get(convId)?.delete(ws);
		if (roomSockets.get(convId)?.size === 0) {
			roomSockets.delete(convId);
		}
	}

	userRooms.delete(userId);
	return rooms;
}

export function pushToRoom(conversationId: string, payload: string): void {
	const sockets = roomSockets.get(conversationId);
	if (!sockets) return;

	for (const ws of sockets) {
		if (ws.readyState === 1) {
			ws.send(payload);
		}
	}
}

export function pushToAllRooms(payload: string): void {
	for (const [, sockets] of roomSockets) {
		for (const ws of sockets) {
			if (ws.readyState === 1) {
				ws.send(payload);
			}
		}
	}
}

export function getUserJoinedRooms(userId: string): string[] {
	return [...(userRooms.get(userId) ?? [])];
}
