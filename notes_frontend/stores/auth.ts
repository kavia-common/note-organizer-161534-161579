/**
 * Authentication store using Pinia.
 */

import { defineStore } from 'pinia';
import type { AuthCredentials, User } from '~/types';
import { getCurrentUser, signIn, signOut, signUp } from '~/utils/api';

// PUBLIC_INTERFACE
export const useAuthStore = defineStore('auth', {
  state: (): { user: User | null; loading: boolean; error: string | null } => ({
    user: null,
    loading: false,
    error: null,
  }),
  actions: {
    // PUBLIC_INTERFACE
    init() {
      try {
        this.user = getCurrentUser();
      } catch {
        this.user = null;
      }
    },
    // PUBLIC_INTERFACE
    async login(creds: AuthCredentials) {
      this.loading = true;
      this.error = null;
      try {
        const user = signIn(creds);
        this.user = user;
      } catch (e: any) {
        this.error = e?.message || 'Login failed';
        throw e;
      } finally {
        this.loading = false;
      }
    },
    // PUBLIC_INTERFACE
    async register(creds: AuthCredentials & { name?: string }) {
      this.loading = true;
      this.error = null;
      try {
        const user = signUp({ email: creds.email, password: creds.password }, creds.name);
        this.user = user;
      } catch (e: any) {
        this.error = e?.message || 'Signup failed';
        throw e;
      } finally {
        this.loading = false;
      }
    },
    // PUBLIC_INTERFACE
    async logout() {
      signOut();
      this.user = null;
    },
  },
});
