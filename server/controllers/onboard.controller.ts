import { Request, Response } from "express";
import { z } from "zod";
import { IUser, User } from "../db/models/user.model";
import { AuthRequest, AuthResponse } from "../middlewares/auth.middleware";

export async function userOnboard(
  req: AuthRequest,
  res: AuthResponse
): Promise<void> {
  const schema = z.object({
    name: z.string().trim(),
    phone: z.string().trim(),
    dob: z.string().trim(),
    address: z.string().trim(),
  });

  const { name, phone, dob, address }: z.infer<typeof schema> = req.body;

  try {
    schema.parse({ name, phone, dob, address });
  } catch (err) {
    res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Invalid input data",
      },
    });
    return;
  }

  try {
    if (!req.user) {
      return;
    }

    const user = await User.findOne({ id: req.user?.id });
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

    user.name = name;
    user.phone = phone;
    user.dob = new Date(dob);
    user.address = address;
    await user.save();

    res.json({
      status: "success",
      message: "User onboarded successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Internal Server Error",
        details: err,
      },
    });
  }
}
