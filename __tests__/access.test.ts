import test from "node:test";
import assert from "node:assert";
import { isAdmin } from "../lib/access/admin";
import { LoginPayloadSchema, UpdateDashboardConfigPayloadSchema } from "../lib/zod/schemas";

test("Admin Access Rule: should return true for admin role", () => {
  assert.strictEqual(isAdmin("admin"), true);
});

test("Admin Access Rule: should return false for member role", () => {
  assert.strictEqual(isAdmin("member"), false);
});

test("Admin Access Rule: should return false for undefined or empty role", () => {
  assert.strictEqual(isAdmin(""), false);
  assert.strictEqual(isAdmin(undefined), false);
});

test("Zod Schema: LoginPayload should accept valid email", () => {
  const result = LoginPayloadSchema.safeParse({ email: "admin@acme.com" });
  assert.strictEqual(result.success, true);
});

test("Zod Schema: LoginPayload should reject invalid email", () => {
  const result = LoginPayloadSchema.safeParse({ email: "invalid-format" });
  assert.strictEqual(result.success, false);
});

test("Zod Schema: UpdateDashboardConfigPayload should reject invalid sections", () => {
  const payload = { sections: "not-an-array", widgetOrder: [] };
  const result = UpdateDashboardConfigPayloadSchema.safeParse(payload);
  assert.strictEqual(result.success, false);
});
