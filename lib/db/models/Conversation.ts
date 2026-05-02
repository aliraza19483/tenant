import mongoose, { Schema, Document } from "mongoose";
import { Conversation } from "../../zod/schemas";

export interface IConversation extends Omit<Conversation, "projectId" | "productInstanceId" | "userId">, Document {
  projectId: mongoose.Types.ObjectId;
  productInstanceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const MessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    steps: { type: [String], default: [] },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const ConversationSchema = new Schema<IConversation>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    productInstanceId: { type: Schema.Types.ObjectId, ref: "ProductInstance", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
