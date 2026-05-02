/**
 * Pure functions for admin access rules.
 * No DB calls, just boolean logic.
 */

/**
 * Checks if the given role has admin privileges.
 */
export function isAdmin(role: "admin" | "member" | string): boolean {
  return role === "admin";
}
