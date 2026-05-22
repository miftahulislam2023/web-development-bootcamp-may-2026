import { z } from "zod";

import type { BuilderElement, PageDocument } from "@/types/builder";

/** Inline CSS object — camelCase keys, string values. */
const stylesSchema = z.record(z.string(), z.string());

export const textElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("text"),
  props: z.object({ content: z.string() }),
  styles: stylesSchema,
});

export const imageElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("image"),
  props: z.object({ src: z.string(), alt: z.string() }),
  styles: stylesSchema,
});

export const buttonElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("button"),
  props: z.object({ label: z.string(), href: z.string() }),
  styles: stylesSchema,
});

export const containerElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("container"),
  props: z.object({}),
  styles: stylesSchema,
  // Recursive edge: containers nest other elements. z.lazy defers the
  // reference to builderElementSchema (declared below).
  children: z.array(
    z.lazy((): z.ZodType<BuilderElement> => builderElementSchema),
  ),
});

export const builderElementSchema: z.ZodType<BuilderElement> =
  z.discriminatedUnion("type", [
    textElementSchema,
    imageElementSchema,
    buttonElementSchema,
    containerElementSchema,
  ]);

export const pageDocumentSchema: z.ZodType<PageDocument> = z.object({
  version: z.literal(1),
  root: containerElementSchema,
});
