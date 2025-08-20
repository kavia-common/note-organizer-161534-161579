<template>
  <div class="card" v-if="auth.user">
    <h2>Account</h2>
    <div class="row">
      <span class="label">Name</span>
      <span>{{ auth.user.name || '—' }}</span>
    </div>
    <div class="row">
      <span class="label">Email</span>
      <span>{{ auth.user.email }}</span>
    </div>
    <div class="row">
      <span class="label">User ID</span>
      <span class="mono">{{ auth.user.id }}</span>
    </div>
    <div class="actions">
      <button class="btn danger" @click="onSignOut">Sign Out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();

onMounted(() => {
  if (!auth.user) {
    return navigateTo('/auth/login');
  }
});

async function onSignOut() {
  await auth.logout();
  return navigateTo('/auth/login');
}
</script>

<style scoped>
.card {
  max-width: 640px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}
.row {
  display: grid;
  grid-template-columns: 160px 1fr;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border);
}
.row:last-child {
  border-bottom: none;
}
.label {
  color: var(--muted);
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.actions {
  margin-top: 16px;
}
</style>
