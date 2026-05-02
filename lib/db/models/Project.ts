import mongoose, { Schema, Document } from "mongoose";
import { Project } from "../../zod/schemas";

export interface IProject extends Project, Document {}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    namespace: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
