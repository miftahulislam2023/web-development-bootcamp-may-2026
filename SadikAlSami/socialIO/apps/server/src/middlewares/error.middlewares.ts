import { env } from '@socialIO/env/server';
import type { ErrorHandler, NotFoundHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

type HttpError = {
	status?: number;
	statusCode?: number;
};

function getStatusCode(error: HttpError): ContentfulStatusCode {
	const candidate = error.status ?? error.statusCode;

	if (typeof candidate === 'number' && candidate >= 400 && candidate < 599) {
		return candidate as ContentfulStatusCode;
	}

	return 500;
}

export const errorHandler: ErrorHandler = (err, c) => {
	const statusCode = getStatusCode(err as HttpError);
	const isDev = env.NODE_ENV === 'development';
	const message = statusCode >= 500 ? `Internal server error.` : err?.message || `Request failed.`;

	if (isDev) {
		console.error(err);
	}

	return c.json(
		{
			success: false,
			message: message,
			stack: isDev ? err?.stack : undefined,
		},
		statusCode,
	);
};

export const notFound: NotFoundHandler = (c) => {
	return c.json(
		{
			success: false,
			message: `Not found - [${c.req.method}] ${c.req.path}`,
		},
		404,
	);
};
