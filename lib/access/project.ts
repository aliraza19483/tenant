/**
 * Pure functions for project access rules.
 * No DB calls, just boolean logic.
 */

/**
 * Checks if a user belongs to the target project.
 */
export function canAccessProject(userProjectId: string, targetProjectId: string): boolean {
  return userProjectId === targetProjectId;
}
