import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Add user to Request type
    }
  }
}

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return next(new AppError("API key is required", 401));
    }

    // Find user by API key
    const user = await User.findOne({ apiKey });

    if (!user) {
      return next(new AppError("Invalid API key", 401));
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      domain: user.domain,
    };

    next();
  } catch (error) {
    next(error);
  }
};
