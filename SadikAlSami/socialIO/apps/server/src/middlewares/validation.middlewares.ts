import { zValidator } from '@hono/zod-validator';
import type { z } from 'zod';
import type { ValidationTargets } from 'hono';

export type ValidationErrorItem = {
	field: string;
	message: string;
};

export type ValidationErrorResponse = {
	success: false;
	message: string;
	errors: ValidationErrorItem[];
};

function formatFieldPath(path: readonly (string | number | symbol)[]): string {
	if (path.length === 0) return 'root';
	return path.map((segment) => String(segment)).join('.');
}

export function validate<TTarget extends keyof ValidationTargets, TSchema extends z.ZodTypeAny>(
	target: TTarget,
	schema: TSchema,
) {
	return zValidator(target, schema, (result, c) => {
		if (!result.success) {
			const errors: ValidationErrorItem[] = result.error.issues.map((err) => ({
				field: formatFieldPath(err.path),
				message: err.message,
			}));

			return c.json<ValidationErrorResponse>({ success: false, message: 'Validation failed', errors }, 422);
		}
	});
}
