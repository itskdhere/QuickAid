import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../db/models/user.model";

export async function userOnboard(req: Request, res: Response): Promise<void> {
  const schema = z.object({
    name: z.string().trim(),
    phone: z.string().trim(),
    address: z.string().trim(),
    dob: z.string().trim(),
    gender: z.enum(["male", "female", "other"]),
  });

  const { name, phone, address, dob, gender }: z.infer<typeof schema> =
    req.body;

  try {
    schema.parse({ name, phone, address, dob, gender });
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
    user.address = address;
    user.dob = new Date(dob);
    user.gender = gender;
    if (!user.pfp) {
      user.pfp = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        name
      )}&backgroundType=gradientLinear`;
    }

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
