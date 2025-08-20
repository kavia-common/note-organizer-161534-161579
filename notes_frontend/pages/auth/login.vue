<template>
  <div class="auth-card">
    <h2>Welcome back</h2>
    <p class="muted">Sign in to your account to continue</p>

    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>Email</span>
        <input v-model="email" type="email" placeholder="you@example.com" required />
      </label>
      <label>
        <span>Password</span>
        <input v-model="password" type="password" placeholder="••••••••" required />
      </label>
      <button class="btn primary" :disabled="auth.loading" type="submit">
        {{ auth.loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="muted small">
      Don't have an account?
      <NuxtLink to="/auth/signup">Create one</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
const email = ref('');
const password = ref('');
const error = computed(() => auth.error);

async function onSubmit() {
  try {
    await auth.login({ email: email.value, password: password.value });
    return navigateTo('/');
  } catch {
    // no-op, error shown implicitly
    alert(error.value || 'Failed to sign in');
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin: 32px auto;
}
.form {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}
label {
  display: grid;
  gap: 6px;
}
input {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
  outline: none;
}
.muted {
  color: var(--muted);
}
.small {
  font-size: 13px;
}
</style>
