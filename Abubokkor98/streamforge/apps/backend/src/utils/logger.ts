import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const ALLOWED_LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;
const DEFAULT_LOG_LEVEL: (typeof ALLOWED_LOG_LEVELS)[number] = 'info';

const resolvedLogLevel = ALLOWED_LOG_LEVELS.includes(
  process.env.LOG_LEVEL as (typeof ALLOWED_LOG_LEVELS)[number],
)
  ? (process.env.LOG_LEVEL as (typeof ALLOWED_LOG_LEVELS)[number])
  : DEFAULT_LOG_LEVEL;

export const logger = pino({
  level: resolvedLogLevel,
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
});
