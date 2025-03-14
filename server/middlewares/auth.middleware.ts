import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../db/models/user.model";

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface AuthResponse extends Response {
  user?: IUser;
}

export default async function checkAuth(
  req: AuthRequest,
  res: AuthResponse,
  next: NextFunction
): Promise<void> {
  const token = req?.cookies?.jwt;

  if (!token) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "No token provided",
      },
    });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  if (typeof decoded !== "object") {
    res.status(401).json({
      status: "error",
      error: {
        code: 401,
        message: "Invalid token",
      },
    });
    return;
  }

  try {
    console.log(decoded);
    const user = (await User.findOne({ id: decoded.id })) as IUser;
    console.log(user);
    if (!user) {
      res.status(404).json({
        status: "error",
        error: {
          code: 404,
          message: "User not found",
        },
      });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
}
