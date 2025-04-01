import { Request, Response } from "express";
import { z } from "zod";
import { IUser, User } from "../db/models/user.model";

export async function viewUserAccount(
  req: Request,
  res: Response
): Promise<void> {
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
        updatedAt: user.updatedAt,
      },
    },
  });
}

export async function updateUserAccount(
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

export async function deleteUserAccount(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = req.user as IUser;

    res.clearCookie("jwt");

    const deletedUser = await User.findByIdAndDelete(user._id);

    if (!deletedUser) {
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
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);

    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Failed to delete account",
      },
    });
  }
}
