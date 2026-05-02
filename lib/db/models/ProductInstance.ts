import mongoose, { Schema, Document } from "mongoose";
import { ProductInstance } from "../../zod/schemas";

export interface IProductInstance extends Omit<ProductInstance, "projectId">, Document {
  projectId: mongoose.Types.ObjectId;
}

const ProductInstanceSchema = new Schema<IProductInstance>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    productType: { type: String, enum: ["ai_sales_assistant", "ai_support_assistant"], required: true },
    namespace: { type: String, required: true },
    integrations: {
      shopify: {
        enabled: { type: Boolean, required: true },
        shopName: { type: String },
      },
      crm: {
        enabled: { type: Boolean, required: true },
        crmName: { type: String },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.ProductInstance || mongoose.model<IProductInstance>("ProductInstance", ProductInstanceSchema);
