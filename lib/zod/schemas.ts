import { z } from "zod";

// Base schemas for DB ids
const ObjectIdString = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// --- DB Schemas ---

export const ProjectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  namespace: z.string().min(1),
  createdAt: z.date().optional(),
});

export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  projectId: ObjectIdString,
  role: z.enum(["admin", "member"]),
});

export const ProductInstanceSchema = z.object({
  projectId: ObjectIdString,
  productType: z.enum(["ai_sales_assistant", "ai_support_assistant"]),
  namespace: z.string().min(1),
  integrations: z.object({
    shopify: z.object({
      enabled: z.boolean(),
      shopName: z.string(),
    }),
    crm: z.object({
      enabled: z.boolean(),
      crmName: z.string(),
    }),
  }),
});

export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  steps: z.array(z.string()).default([]),
  createdAt: z.date().optional(),
});

export const ConversationSchema = z.object({
  projectId: ObjectIdString,
  productInstanceId: ObjectIdString,
  userId: ObjectIdString,
  title: z.string().min(1),
  messages: z.array(MessageSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const DashboardConfigSchema = z.object({
  projectId: ObjectIdString,
  sections: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      widgets: z.array(
        z.enum([
          "stat_total_conversations",
          "stat_active_users",
          "integration_shopify",
          "integration_crm",
          "recent_activity",
          "conversation_chart",
        ])
      ),
    })
  ),
  widgetOrder: z.array(z.string()),
  updatedAt: z.date().optional(),
});

// --- Request/Payload Schemas ---

export const LoginPayloadSchema = z.object({
  email: z.string().email(),
});

export const CreateConversationPayloadSchema = z.object({
  title: z.string().min(1).optional(),
});

export const ChatMessagePayloadSchema = z.object({
  content: z.string().min(1),
});

export const UpdateDashboardConfigPayloadSchema = z.object({
  sections: DashboardConfigSchema.shape.sections,
  widgetOrder: DashboardConfigSchema.shape.widgetOrder,
});

// Types inferred from Zod schemas
export type Project = z.infer<typeof ProjectSchema>;
export type User = z.infer<typeof UserSchema>;
export type ProductInstance = z.infer<typeof ProductInstanceSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;
