import { authStorage } from './authStorage';

const ADMIN_ROLES = ['admin', 'archivist', 'chief editor'];

/**
 * Returns the destination route based on the current user's role.
 */
export function getRedirectPathByRole(): string {
  const user = authStorage.getCurrentUser();
  if (!user) {
    return '/';
  }

  const role = (user.role || '').toLowerCase();
  if (ADMIN_ROLES.includes(role)) {
    return '/admin/dashboard';
  }

  return '/';
}

/**
 * Checks if the current user has admin access.
 */
export function isAdminUser(): boolean {
  const user = authStorage.getCurrentUser();
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  return ADMIN_ROLES.includes(role);
}
