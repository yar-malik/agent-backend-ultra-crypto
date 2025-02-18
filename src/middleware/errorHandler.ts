import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      code: err.statusCode,
    });
  }

  console.error("Error:", err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    code: 500,
  });
};
