<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="logo">📝</span>
        <span class="title">Notes</span>
      </div>

      <div v-if="isAuthed" class="user-box">
        <div class="avatar">{{ userInitials }}</div>
        <div class="user-meta">
          <div class="name">{{ user?.name || user?.email }}</div>
          <div class="email">{{ user?.email }}</div>
        </div>
      </div>

      <div class="nav">
        <NuxtLink to="/" class="nav-item" exact-active-class="active">
          <span>All Notes</span>
        </NuxtLink>
        <NuxtLink to="/notes/new" class="nav-item" exact-active-class="active">
          <span>New Note</span>
        </NuxtLink>
      </div>

      <div class="spacer" />

      <div class="actions">
        <button v-if="!isAuthed" class="btn primary" @click="goLogin">Sign In</button>
        <div v-else class="auth-actions">
          <button class="btn text" @click="goAccount">Account</button>
          <button class="btn danger" @click="logout">Sign Out</button>
        </div>
      </div>
    </aside>

    <main class="main">
      <header class="main-header">
        <slot name="header">
          <div class="search">
            <IconSearch />
            <input
              v-model="notes.query"
              @input="onSearch"
              type="text"
              placeholder="Search notes..."
              aria-label="Search notes"
            />
          </div>
          <div class="header-actions">
            <NuxtLink to="/notes/new" class="btn accent">New</NuxtLink>
          </div>
        </slot>
      </header>

      <section class="content">
        <NuxtPage />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useNotesStore } from '~/stores/notes';
import IconSearch from '~/components/icons/IconSearch.vue';

const auth = useAuthStore();
auth.init();
const notes = useNotesStore();

const { user } = storeToRefs(auth);
const isAuthed = computed(() => !!user.value);
const router = useRouter();

onMounted(() => {
  if (isAuthed.value) {
    notes.refresh();
  }
});

watch(
  () => user.value?.id,
  () => {
    if (isAuthed.value) {
      notes.refresh();
    } else {
      notes.items = [];
    }
  },
);

const userInitials = computed(() => {
  const n = user.value?.name || user.value?.email || '';
  const parts = n.split('@')[0]?.split(/[.\s_-]+/).filter(Boolean) || [];
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return initials || 'U';
});

function goLogin() {
  router.push('/auth/login');
}
function goAccount() {
  router.push('/account');
}
async function logout() {
  await auth.logout();
  router.push('/auth/login');
}
function onSearch() {
  notes.setQuery(notes.query);
}
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.sidebar {
  border-right: 1px solid var(--border);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 20px;
  color: var(--primary);
}
.logo {
  font-size: 22px;
}
.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  font-weight: 700;
  display: grid;
  place-items: center;
}
.user-meta .name {
  font-weight: 600;
}
.user-meta .email {
  font-size: 12px;
  color: var(--muted);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nav-item {
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text);
  text-decoration: none;
  border: 1px solid transparent;
}
.nav-item:hover {
  background: var(--hover);
}
.nav-item.active {
  background: var(--primary-soft);
  color: var(--primary);
  border-color: var(--primary);
}

.spacer {
  flex: 1;
}

.actions {
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.auth-actions {
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.main {
  display: flex;
  flex-direction: column;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  position: sticky;
  top: 0;
  z-index: 5;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  background: white;
  padding: 8px 10px;
  border-radius: 10px;
  min-width: 260px;
}
.search input {
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
  width: 300px;
}
.content {
  padding: 18px;
  display: grid;
}
.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
}
.btn:hover { filter: brightness(0.98); }
.btn.primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
.btn.accent {
  background: var(--accent);
  color: #3b2d00;
  border-color: var(--accent);
}
.btn.text {
  background: transparent;
  border-color: transparent;
  color: var(--primary);
}
.btn.danger {
  background: #ef5350;
  color: white;
  border-color: #ef5350;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    grid-row: 2;
  }
  .main {
    grid-row: 1;
  }
}
</style>
