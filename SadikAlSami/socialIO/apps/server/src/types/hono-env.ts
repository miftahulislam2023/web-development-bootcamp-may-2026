import type { Context } from "hono";
import type { z } from "zod";
import type { AppEnv } from "./app-env";

export type JsonHandler<T> = Context<AppEnv, string, { in: { json: T }; out: { json: T } }>;
export type FormHandler<T> = Context<AppEnv, string, { in: { form: T }; out: { form: T } }>;
export type QueryHandler<T> = Context<AppEnv, string, { in: { query: T }; out: { query: T } }>;

export type JsonHandlerFromSchema<TSchema extends z.ZodTypeAny> = Context<
  AppEnv,
  string,
  { in: { json: z.input<TSchema> }; out: { json: z.output<TSchema> } }
>;
export type FormHandlerFromSchema<TSchema extends z.ZodTypeAny> = Context<
  AppEnv,
  string,
  { in: { form: z.input<TSchema> }; out: { form: z.output<TSchema> } }
>;
export type QueryHandlerFromSchema<TSchema extends z.ZodTypeAny> = Context<
  AppEnv,
  string,
  { in: { query: z.input<TSchema> }; out: { query: z.output<TSchema> } }
>;
