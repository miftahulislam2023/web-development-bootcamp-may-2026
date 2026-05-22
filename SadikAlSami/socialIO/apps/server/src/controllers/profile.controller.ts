import { Hono } from 'hono';
import { type AppEnv } from '@/types/app-env';
import { HTTPException } from 'hono/http-exception';
import { createProfileBodySchema, updateProfileAvatarBodySchema, updateProfileBodySchema } from '@/validators';
import {
	createProfile,
	getProfile,
	getProfileExists,
	searchProfiles,
	updateProfile,
	updateProfileImage,
} from '@/services';
import { isAuthenticated, validate } from '@/middlewares';
import z from 'zod';

export const profileController = new Hono<AppEnv>();

const searchQuerySchema = z.object({
	q: z.string().min(2, 'Search query must be at least 2 characters').max(50),
});

/**
 * @route GET /profile
 * @desc Get the authenticated user's profile
 * @access Private
 */
profileController.get('/', isAuthenticated, async (c) => {
	const user = c.get('user');
	const userId = user?.id;

	if (!userId) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const profile = await getProfile(userId);

	return c.json({ success: true, profile });
});

/**
 * @route GET /profile/me
 * @desc Check if the authenticated user has a profile
 * @access Private
 */
profileController.get('/me', isAuthenticated, async (c) => {
	const user = c.get('user');
	const userId = user?.id;

	if (!userId) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const profile = await getProfileExists(userId);

	return c.json({
		success: true,
		exists: Boolean(profile),
		profile: profile ?? null,
	});
});

/**
 * @route GET /profile/search
 * @desc Search for profiles based on a query
 * @access Private
 */
profileController.get('/search', isAuthenticated, validate('query', searchQuerySchema), async (c) => {
	const user = c.get('user');
	const userId = user?.id;

	if (!userId) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const { q } = c.req.valid('query');
	const results = await searchProfiles(q, userId);

	return c.json({ success: true, results });
});

/**
 * @route POST /profile
 * @desc Create a profile for the authenticated user
 * @access Private
 */
profileController.post('/', isAuthenticated, validate('json', createProfileBodySchema), async (c) => {
	const user = c.get('user');
	const userId = user?.id;

	if (!userId) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const profileData = c.req.valid('json');

	const profile = await createProfile(userId, profileData);
	return c.json({ success: true, profile });
});

/**
 * @route PATCH /profile
 * @desc Update the authenticated user's profile
 * @access Private
 */
profileController.patch('/', isAuthenticated, validate('json', updateProfileBodySchema), async (c) => {
	const user = c.get('user');
	const userId = user?.id;

	if (!userId) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const profileData = c.req.valid('json');

	const profile = await updateProfile(userId, profileData);
	return c.json({ success: true, profile });
});

/**
 * @route PATCH /profile/avatar
 * @desc Update the authenticated user's profile avatar
 * @access Private
 */
profileController.patch('/avatar', isAuthenticated, validate('json', updateProfileAvatarBodySchema), async (c) => {
	const user = c.get('user');
	const userId = user?.id;

	if (!userId) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const profileData = c.req.valid('json');

	const profile = await updateProfileImage(userId, profileData);
	return c.json({ success: true, profile });
});
