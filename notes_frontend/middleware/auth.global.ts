/**
 * Global route middleware to redirect unauthenticated users to login,
 * except for auth routes.
 */

import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  auth.init();

  const isAuthRoute = to.path.startsWith('/auth');
  if (!auth.user && !isAuthRoute) {
    return navigateTo('/auth/login');
  }
  if (auth.user && isAuthRoute) {
    return navigateTo('/');
  }
});
