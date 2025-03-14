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
