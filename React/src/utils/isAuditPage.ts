/**
 * Checks if the current page is an audit-related page
 * @param isPathActive - Function to check if a path is active
 * @returns true if on audits, actions, answers, dashboard, or tracker-items page
 */
const isAuditPage = (isPathActive: (path: string) => boolean): boolean =>
  isPathActive('/audits') ||
  isPathActive('/actions') ||
  isPathActive('/answers') ||
  isPathActive('/dashboard') ||
  isPathActive('/tracker-items');

export default isAuditPage;
