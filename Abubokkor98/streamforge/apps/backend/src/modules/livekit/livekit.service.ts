import { nanoid } from 'nanoid';
import { AccessToken } from 'livekit-server-sdk';
import { env } from '@/config/env';
import { prisma } from '@/config/prisma';
import { ApiError } from '@/utils/api-error';
import type { LiveKitTokenInput, LiveKitTokenResponse } from '@/modules/livekit/livekit.types';

const TOKEN_TTL = '6h';
const GUEST_ID_LENGTH = 10;
const GUEST_IDENTITY_PREFIX = 'guest_';

export async function generateToken(
  input: LiveKitTokenInput,
  authenticatedUserId: number | undefined,
): Promise<LiveKitTokenResponse> {
  const room = await prisma.room.findUnique({
    where: { room_key: input.roomKey },
    include: { host: { select: { id: true, name: true } } },
  });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (input.isHost) {
    if (!authenticatedUserId) {
      throw ApiError.unauthorized('Authentication required to broadcast');
    }

    if (room.host_id !== authenticatedUserId) {
      throw ApiError.forbidden('You do not own this room');
    }

    return createToken({
      roomKey: input.roomKey,
      identity: `host_${authenticatedUserId}`,
      name: room.host.name,
      canPublish: true,
      canSubscribe: true,
    });
  }

  // Viewer token — authenticated user or guest
  if (authenticatedUserId) {
    const user = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
      select: { name: true },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid or inactive user');
    }

    return createToken({
      roomKey: input.roomKey,
      identity: `user_${authenticatedUserId}`,
      name: user.name,
      canPublish: false,
      canSubscribe: true,
    });
  }

  // Guest viewer
  if (!input.guestName) {
    throw ApiError.badRequest('Guest name is required for unauthenticated viewers');
  }

  const guestIdentity = `${GUEST_IDENTITY_PREFIX}${nanoid(GUEST_ID_LENGTH)}`;

  return createToken({
    roomKey: input.roomKey,
    identity: guestIdentity,
    name: input.guestName,
    canPublish: false,
    canSubscribe: true,
  });
}

interface CreateTokenParams {
  roomKey: string;
  identity: string;
  name: string;
  canPublish: boolean;
  canSubscribe: boolean;
}

async function createToken(params: CreateTokenParams): Promise<LiveKitTokenResponse> {
  const accessToken = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: params.identity,
    name: params.name,
    ttl: TOKEN_TTL,
  });

  accessToken.addGrant({
    roomJoin: true,
    room: params.roomKey,
    canPublish: params.canPublish,
    canSubscribe: params.canSubscribe,
    canPublishData: true,
  });

  const token = await accessToken.toJwt();

  return {
    token,
    identity: params.identity,
    roomKey: params.roomKey,
  };
}
