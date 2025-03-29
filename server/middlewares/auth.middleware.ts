import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../db/models/user.model";

export default async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req?.cookies?.jwt;

  if (!token) {
    res.status(401).json({
      status: "error",
      error: {
        code: 401,
        message: "Unauthorized",
      },
    });
    return;
  }

  let decodedToken: string | jwt.JwtPayload;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decodedToken !== "object") {
      res.status(401).json({
        status: "error",
        error: {
          code: 401,
          message: "Unauthorized",
        },
      });
      return;
    }
  } catch (error) {
    res.status(401).json({
      status: "error",
      error: {
        code: 401,
        message: "Unauthorized",
      },
    });
    return;
  }

  try {
    const user = (await User.findOne({ id: decodedToken.id })) as IUser;
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

    const newToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "12h",
      }
    );

    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 3600 * 12, // 12 hour
    });

    next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
}
