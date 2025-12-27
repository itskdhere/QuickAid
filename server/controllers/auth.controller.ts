import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { IUser, User } from "../db/models/user.model";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service";
import {
  generateVerificationToken,
  generateEmailVerificationExpiry,
  generatePasswordResetExpiry,
  isTokenExpired,
} from "../utils/auth.utils";

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

    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = generateEmailVerificationExpiry();

    await user.save();
    // await userSignin(req, res);

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    res.status(201).json({
      status: "success",
      message:
        "Account created successfully. Please check your email to verify your account.",
      data: {
        emailSent: true,
        email: user.email,
      },
    });
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
    (err: any, user: IUser, info: any) => {
      if (err || !user) {
        return res.status(400).json({
          status: "error",
          error: {
            code: 400,
            message: "Invalid credentials",
          },
        });
      }

      if (!user.googleId && !user.isEmailVerified) {
        return res.status(403).json({
          status: "error",
          error: {
            code: 403,
            message: "Please verify your email before signing in",
            action: "verify_email",
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
        sameSite: "lax",
        path: "/",
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
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/user/signin",
  })(req, res, function (err: any) {
    if (err) {
      return next(err);
    }

    const token = jwt.sign(
      { id: (req.user as IUser).id },
      process.env.JWT_SECRET as string,
      { expiresIn: "12h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 3600 * 12, // 12 hours
    });

    const baseUrl = process.env.GOOGLE_CALLBACK_ORIGIN;

    if (!(req.user as IUser).phone) {
      return res.redirect(`${baseUrl}/onboard/user`);
    }

    res.redirect(`${baseUrl}/user/dashboard`);
  });
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Verification token is required",
      },
    });
    return;
  }

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: "Invalid or expired verification token",
        },
      });
      return;
    }

    if (
      !user.emailVerificationExpires ||
      isTokenExpired(user.emailVerificationExpires)
    ) {
      res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: "Verification token has expired",
        },
      });
      return;
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      status: "success",
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
}

export async function resendVerificationEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Email is required",
      },
    });
    return;
  }

  try {
    const user = await User.findOne({ email });

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

    if (user.isEmailVerified) {
      res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: "Email is already verified",
        },
      });
      return;
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = generateEmailVerificationExpiry();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      res.status(500).json({
        status: "error",
        error: {
          code: 500,
          message: "Failed to send verification email",
        },
      });
      return;
    }

    res.json({
      status: "success",
      message: "Verification email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
}

export async function forgotPassword(
  req: Request,
  res: Response
): Promise<void> {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Email is required",
      },
    });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({
        status: "success",
        message:
          "If an account with the provided email exists, a password reset link has been sent.",
      });
      return;
    }

    const resetToken = generateVerificationToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = generatePasswordResetExpiry();
    await user.save();

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError: any) {
      console.error("Failed to send password reset email:", emailError);
      throw new Error(emailError?.message);
    }

    res.json({
      status: "success",
      message:
        "If an account with the provided email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
}

export async function resetPassword(
  req: Request,
  res: Response
): Promise<void> {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Token and password are required",
      },
    });
    return;
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
    });

    if (!user) {
      res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: "Invalid or expired reset token",
        },
      });
      return;
    }

    if (
      !user.passwordResetExpires ||
      isTokenExpired(user.passwordResetExpires)
    ) {
      res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: "Reset token has expired",
        },
      });
      return;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      status: "success",
      message:
        "Password reset successful. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
}
