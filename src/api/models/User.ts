import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verified_at?: Date;
  email_verification_token?: string;
  email_verification_expires_at?: Date;
  otp?: string;
  last_login?: Date;
  role: "user" | "admin";
  status: "active" | "inactive" | "suspended";
    articles?: Types.ObjectId[];
  interests: string[];
  bookmarks: Schema.Types.ObjectId[]; // for saved articles
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],

    verified_at: {
      type: Date,
      default: null,
    },
    email_verification_token: {
      type: String,
      default: null,
    },
    email_verification_expires_at: {
      type: Date,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    last_login: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive", // inactive until email verified
    },
    interests: {
      type: [String],
      default: [],
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", UserSchema);

export default User;
