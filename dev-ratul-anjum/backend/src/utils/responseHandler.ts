import { Response } from "express";

const responseHandler = <T extends unknown>(
  response: Response,
  statusCode: number,
  payload: TPayload<T>,
) => {
  return response.status(statusCode).json(payload);
};

export default responseHandler;

interface TPayload<T> {
  success: boolean;
  message: string;
  data?: T;
  [x: string]: unknown;
}
