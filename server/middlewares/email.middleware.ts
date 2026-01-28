import { Request, Response, NextFunction } from "express";
import { IUser } from "../db/models/user.model";

export function requireEmailVerification(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = req.user as IUser;

  if (!user) {
    res.status(401).json({
      status: "error",
      error: {
        code: 401,
        message: "Unauthorized",
      },
    });
    return;
  }

  if (user.googleId) {
    next();
    return;
  }

  if (!user.isEmailVerified) {
    res.status(403).json({
      status: "error",
      error: {
        code: 403,
        message: "Email verification required",
        action: "verify_email",
      },
    });
    return;
  }

  next();
}
