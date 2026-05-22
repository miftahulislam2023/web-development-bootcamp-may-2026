import { text, timestamp, pgTable, index } from 'drizzle-orm/pg-core';

import { user } from './auth';

export const userProfile = pgTable(
	'user_profile',
	{
		id: text('id')
			.primaryKey()
			.references(() => user.id, { onDelete: 'cascade' }),
		displayName: text('display_name').notNull().unique(),
		avatarUrl: text('avatar_url'),
		bio: text('bio'),
		lastSeenAt: timestamp('last_seen_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index('user_profile_display_name_idx').on(table.displayName)],
	// The GIN trigram index lives in the custom migration file
	// ==> packages/db/src/migrations/0002_enable_pg_trgm.sql
);

// export type UserProfile = typeof userProfile.$inferSelect;
// export type NewUserProfile = typeof userProfile.$inferInsert;
