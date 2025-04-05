import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { IUser, User } from "../db/models/user.model";

export async function userWhoami(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser;

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        pfp: user.pfp,
        name: user.name,
        email: user.email,
      },
    },
  });
}

export async function userSignout(req: Request, res: Response): Promise<void> {
  if (!req?.user) {
    res.status(401).json({
      status: "error",
      error: {
        code: 401,
        message: "Unauthorized",
      },
    });
    return;
  }
  res.clearCookie("jwt");
  res.json({
    status: "success",
    message: "Sign out successful",
  });
}

export async function userSignup(req: Request, res: Response): Promise<void> {
  const schema = z.object({
    email: z.string().email().trim(),
    password: z.string().trim(),
  });

  const { email, password }: z.infer<typeof schema> = req.body;

  try {
    schema.parse({ email, password });
  } catch (err) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Invalid Email / Password",
      },
    });
    return;
  }

  const existingUser = await User.findOne({ email })
    .exec()
    .catch((err) => {
      res.status(500).json({
        status: "error",
        error: {
          code: 500,
          message: "Internal Server Error: Error checking for existing user",
          details: err,
        },
      });
    });

  if (existingUser) {
    res.status(409).json({
      status: "error",
      error: {
        code: 409,
        message: "Account already exists",
      },
    });
    return;
  }

  try {
    const user = new User({ email, password });
    await user.save();
    await userSignin(req, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error: Error creating user",
        details: err,
      },
    });
  }
}

export async function userSignin(req: Request, res: Response): Promise<void> {
  const schema = z.object({
    email: z.string().email().trim(),
    password: z.string().trim(),
  });

  const { email, password }: z.infer<typeof schema> = req.body;

  try {
    schema.parse({ email, password });
  } catch (err) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Invalid Email / Password",
      },
    });
    return;
  }

  const existingUser = await User.findOne({ email }).exec();
  if (!existingUser) {
    res.status(404).json({
      status: "error",
      error: {
        code: 404,
        message: "Account not found",
      },
    });
    return;
  }

  passport.authenticate(
    "local",
    { session: false },
    (err, user: IUser, info) => {
      if (err || !user) {
        return res.status(400).json({
          status: "error",
          error: {
            code: 400,
            message: "Invalid credentials",
          },
        });
      }

      if (process.env.JWT_SECRET === undefined) {
        throw new Error("JWT_SECRET is not defined in .env file");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 3600 * 12, // 12 hour
      });

      res.json({
        status: "success",
        message: "Sign in successful",
      });
    }
  )(req, res);
}

export async function userGoogle(req: Request, res: Response): Promise<void> {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
}

export function userGoogleCallback(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("Google callback endpoint hit");
  console.log("Query params:", req.query);

  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/user/signin",
  })(req, res, function (err) {
    if (err) {
      return next(err);
    }

    console.log("Passport authentication successful");
    console.log("User:", (req.user as IUser).email);

    const token = jwt.sign(
      { id: (req.user as IUser).id },
      process.env.JWT_SECRET as string,
      { expiresIn: "12h" }
    );

    console.log("Generated JWT token");

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.CORS_ORIGIN,
      maxAge: 1000 * 3600 * 12, // 12 hours
    });

    console.log("Set JWT cookie");

    const baseUrl = process.env.GOOGLE_CALLBACK_ORIGIN;

    if (!(req.user as IUser).phone) {
      return res.redirect(`${baseUrl}/onboard/user`);
    }

    res.redirect(`${baseUrl}/user/dashboard`);
  });
}
