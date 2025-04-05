import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

import Post from "./community.model.js";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export interface IUser extends Document {
  id: string;
  pfp: string;
  email: string;
  password: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  phone: string;
  address: string;
  dob: Date;
  gender: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    id: { type: String, default: crypto.randomUUID() },
    pfp: {
      type: String,
      default:
        "https://api.dicebear.com/9.x/glass/svg?seed=quickaid&backgroundType=gradientLinear",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    googleId: {
      type: String,
      sparse: true,
    },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    await Post.deleteMany({ user: user._id });
    await Post.updateMany({ likes: user._id }, { $pull: { likes: user._id } });
  }
  next();
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
