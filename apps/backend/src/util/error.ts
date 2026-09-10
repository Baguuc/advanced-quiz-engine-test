import { type NextFunction, type Request, type Response } from "express";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public message: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ code: err.code, message: err.message });
  }

  return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
}
