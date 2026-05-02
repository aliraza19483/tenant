import mongoose, { Schema, Document } from "mongoose";
import { DashboardConfig } from "../../zod/schemas";

export interface IDashboardConfig extends Omit<DashboardConfig, "projectId">, Document {
  projectId: mongoose.Types.ObjectId;
}

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    widgets: [{ type: String, required: true }],
  },
  { _id: false }
);

const DashboardConfigSchema = new Schema<IDashboardConfig>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, unique: true },
    sections: [SectionSchema],
    widgetOrder: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.models.DashboardConfig || mongoose.model<IDashboardConfig>("DashboardConfig", DashboardConfigSchema);
