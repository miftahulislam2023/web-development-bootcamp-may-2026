import type { auth } from '@socialIO/auth';
import type { participantRoleEnum } from '@socialIO/db/schema/enums';

export type AppVariables = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
	participantRole?: (typeof participantRoleEnum.enumValues)[number];
};

export type AppEnv = {
	Variables: AppVariables;
};
