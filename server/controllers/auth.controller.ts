import { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { IUser, User } from "../db/models/user.model";

export async function updateUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = req.user as IUser;

    // Validate request body
    const updateSchema = z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      dob: z.string().datetime().optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
    });

    const validatedData = updateSchema.parse(req.body);

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          name: validatedData.name,
          phone: validatedData.phone,
          address: validatedData.address,
          dob: validatedData.dob ? new Date(validatedData.dob) : undefined,
          gender: validatedData.gender,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        status: "error",
        error: {
          code: 404,
          message: "User not found",
        },
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser.id,
          pfp: updatedUser.pfp,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          dob: updatedUser.dob,
          gender: updatedUser.gender,
          createdAt: updatedUser.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: "Invalid input data",
          details: error.errors,
        },
      });
      return;
    }

    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Failed to update profile",
      },
    });
  }
}

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
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
        createdAt: user.createdAt,
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
