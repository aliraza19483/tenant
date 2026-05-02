import mongoose from "mongoose";
import Project from "../lib/db/models/Project";
import User from "../lib/db/models/User";
import ProductInstance from "../lib/db/models/ProductInstance";
import DashboardConfig from "../lib/db/models/DashboardConfig";
import connectToDatabase from "../lib/db/connect";
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(process.cwd());

async function seed() {
  console.log("Connecting to database...");
  await connectToDatabase();
  console.log("Connected.");

  console.log("Clearing existing data...");
  await Project.deleteMany({});
  await User.deleteMany({});
  await ProductInstance.deleteMany({});
  await DashboardConfig.deleteMany({});
  // We won't delete conversations so we don't accidentally wipe real logs if run on wrong db,
  // but for a clean seed, we could. Let's just clear the core config.

  console.log("Creating projects...");
  const acmeProject = await Project.create({
    name: "Acme Corp",
    slug: "acme",
    namespace: "acme-ns",
  });

  const betaProject = await Project.create({
    name: "Beta Inc",
    slug: "beta",
    namespace: "beta-ns",
  });

  console.log("Creating users...");
  await User.create([
    { name: "Alice Admin", email: "alice@acme.com", role: "admin", projectId: acmeProject._id },
    { name: "Bob Member", email: "bob@acme.com", role: "member", projectId: acmeProject._id },
    { name: "Carol Admin", email: "carol@beta.com", role: "admin", projectId: betaProject._id },
  ]);

  console.log("Creating product instances...");
  await ProductInstance.create([
    {
      projectId: acmeProject._id,
      productType: "ai_sales_assistant",
      namespace: "acme-ns",
      integrations: {
        shopify: { enabled: true, shopName: "Acme Store" },
        crm: { enabled: true, crmName: "Acme CRM" },
      },
    },
    {
      projectId: betaProject._id,
      productType: "ai_support_assistant",
      namespace: "beta-ns",
      integrations: {
        shopify: { enabled: false, shopName: "" },
        crm: { enabled: true, crmName: "Beta CRM" },
      },
    },
  ]);

  console.log("Creating dashboard configs...");
  await DashboardConfig.create([
    {
      projectId: acmeProject._id,
      sections: [
        { id: "overview", label: "Overview", widgets: ["stat_total_conversations", "stat_active_users"] },
        { id: "integrations", label: "Integrations", widgets: ["integration_shopify", "integration_crm"] },
        { id: "activity", label: "Activity", widgets: ["recent_activity", "conversation_chart"] },
      ],
      widgetOrder: [
        "stat_total_conversations",
        "stat_active_users",
        "integration_shopify",
        "integration_crm",
        "recent_activity",
        "conversation_chart",
      ],
    },
    {
      projectId: betaProject._id,
      sections: [
        { id: "overview", label: "Overview", widgets: ["stat_total_conversations"] },
        { id: "integrations", label: "Integrations", widgets: ["integration_crm"] },
      ],
      widgetOrder: ["stat_total_conversations", "integration_crm"],
    },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
