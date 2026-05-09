import { Request } from "express";

// TBody, TQuery, and TParams default to 'any' so it doesn't break existing untyped routes
export interface ValidatedRequest<
  TBody = any,
  TQuery = any,
  TParams = any,
> extends Request {
  validatedBody: TBody;
  validatedQuery: TQuery;
  validatedParams: TParams;
}
