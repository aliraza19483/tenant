import mongoose, { Schema, Document } from "mongoose";
import { User } from "../../zod/schemas";

export interface IUser extends Omit<User, "projectId">, Document {
  projectId: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    role: { type: String, enum: ["admin", "member"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
