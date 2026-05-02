import Conversation from "../db/models/Conversation";
import ProductInstance, { IProductInstance } from "../db/models/ProductInstance";
import connectToDatabase from "../db/connect";
import { getShopifyContext, getCRMContext } from "./integration.service";
import mongoose from "mongoose";

interface RateLimit {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimit>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20;

function checkRateLimit(projectId: string): boolean {
  const now = Date.now();
  let limit = rateLimits.get(projectId);

  if (!limit || now > limit.resetAt) {
    limit = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimits.set(projectId, limit);
  }

  if (limit.count >= MAX_REQUESTS) {
    return false;
  }

  limit.count += 1;
  return true;
}

function buildSystemPrompt(instance: IProductInstance): { prompt: string; steps: string[] } {
  const steps: string[] = ["Analyzing context"];
  let prompt = `You are a helpful ${
    instance.productType === "ai_sales_assistant" ? "sales" : "support"
  } assistant.\n`;

  if (instance.integrations.shopify?.enabled) {
    steps.push("Checking Shopify data");
    const shopifyData = getShopifyContext(instance.integrations.shopify.shopName || "Store");
    prompt += `\nShopify Context:\n${JSON.stringify(shopifyData, null, 2)}\n`;
  }

  if (instance.integrations.crm?.enabled) {
    steps.push("Checking CRM data");
    const crmData = getCRMContext(instance.integrations.crm.crmName || "CRM");
    prompt += `\nCRM Context:\n${JSON.stringify(crmData, null, 2)}\n`;
  }

  return { prompt, steps };
}

export async function sendMessage(
  projectId: string,
  userId: string,
  conversationId: string | null,
  content: string
) {
  await connectToDatabase();

  if (!checkRateLimit(projectId)) {
    return {
      error: "Rate limit reached. Please try again later.",
      status: 429,
    };
  }

  const instance = await ProductInstance.findOne({ projectId: new mongoose.Types.ObjectId(projectId) });
  if (!instance) {
    throw new Error("Product instance not found for project");
  }

  let conversation;
  let formattedMessages: any[] = [];

  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    conversation.messages.push({ role: "user", content });
    await conversation.save();

    formattedMessages = conversation.messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));
  } else {
    conversation = await Conversation.create({
      projectId: new mongoose.Types.ObjectId(projectId),
      productInstanceId: instance._id,
      userId: new mongoose.Types.ObjectId(userId),
      title: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
      messages: [{ role: "user", content }],
    });

    formattedMessages = [{ role: "user", content }];
  }

  const { prompt: systemPrompt, steps } = buildSystemPrompt(instance);
  steps.push("Calling AI Model");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Multi-Tenant AI Assistant",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        max_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          ...formattedMessages.map((m) => ({ role: m.role, content: m.content }))
        ],
      }),
    });

    if (!response.ok) {
      const errTxt = await response.text();
      console.error("OpenRouter API Error:", errTxt);
      throw new Error(`OpenRouter API returned ${response.status}: ${errTxt}`);
    }

    const data = await response.json();
    
    // Some free reasoning models (like Nemotron) return content: null if they spend all tokens thinking.
    // We will fallback to the reasoning text if content is empty.
    const assistantContent = 
      data.choices?.[0]?.message?.content || 
      data.choices?.[0]?.message?.reasoning || 
      "I'm sorry, I couldn't generate a response.";

    conversation.messages.push({
      role: "assistant",
      content: assistantContent,
      steps,
    });
    await conversation.save();

    return {
      conversationId: conversation._id.toString(),
      message: { role: "assistant", content: assistantContent, steps },
    };
  } catch (error: any) {
    console.error("Chat service error:", error);
    const fallbackMessage = {
      role: "assistant",
      content: `I'm sorry, I'm currently experiencing technical difficulties and cannot process your request right now.\n\nError Details: ${error.message || String(error)}`,
      steps: [...steps, "Fallback triggered due to error"],
    };

    conversation.messages.push(fallbackMessage);
    await conversation.save();

    return {
      conversationId: conversation._id.toString(),
      message: fallbackMessage,
    };
  }
}
