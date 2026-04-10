import mongoose, { Schema } from "mongoose";

export interface UserDocumentInterface {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocumentInterface>(
  {
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
    },
  },
  {
    timestamps: true,
  },
);

const User =
  (mongoose.models.User as mongoose.Model<UserDocumentInterface>) ||
  mongoose.model<UserDocumentInterface>("User", UserSchema);

export default User;
