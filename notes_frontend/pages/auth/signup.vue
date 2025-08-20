<template>
  <div class="auth-card">
    <h2>Create your account</h2>
    <p class="muted">Sign up to start taking notes</p>

    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>Name</span>
        <input v-model="name" type="text" placeholder="Your name" />
      </label>
      <label>
        <span>Email</span>
        <input v-model="email" type="email" placeholder="you@example.com" required />
      </label>
      <label>
        <span>Password</span>
        <input v-model="password" type="password" placeholder="Create a password" required />
      </label>
      <button class="btn primary" :disabled="auth.loading" type="submit">
        {{ auth.loading ? 'Creating...' : 'Sign Up' }}
      </button>
    </form>

    <p class="muted small">
      Already have an account?
      <NuxtLink to="/auth/login">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');

async function onSubmit() {
  try {
    await auth.register({ name: name.value || undefined, email: email.value, password: password.value });
    return navigateTo('/');
  } catch (e: any) {
    alert(e?.message || 'Failed to sign up');
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
