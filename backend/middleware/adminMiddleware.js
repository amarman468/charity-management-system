// Middleware to enforce admin-only access
// This composes existing authentication and role check utilities.
import { authenticate, authorize } from './auth.js';

// Export a single middleware that requires authentication and admin role
export const adminOnly = [authenticate, authorize('admin')];

export default adminOnly;
