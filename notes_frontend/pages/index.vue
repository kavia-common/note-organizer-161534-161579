<template>
  <div class="grid">
    <div class="list">
      <div class="list-header">
        <h2>Notes</h2>
        <button class="btn accent" @click="create">New</button>
      </div>
      <div class="items" v-if="notes.filtered.length">
        <NoteListItem v-for="n in notes.filtered" :key="n.id" :note="n" />
      </div>
      <div v-else class="empty">
        <p>No notes yet.</p>
        <NuxtLink to="/notes/new" class="btn primary">Create your first note</NuxtLink>
      </div>
    </div>

    <div class="detail">
      <NoteEditor v-if="selectedId" :id="selectedId" />
      <div v-else class="placeholder">
        <p>Select a note to view and edit it.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useNotesStore } from '~/stores/notes';
import NoteListItem from '~/components/NoteListItem.vue';
import NoteEditor from '~/components/NoteEditor.vue';

const auth = useAuthStore();
const notes = useNotesStore();

onMounted(() => {
  if (!auth.user) {
    return navigateTo('/auth/login');
  }
  notes.refresh();
});

const selectedId = computed(() => notes.selectedId);

function create() {
  notes.createEmpty();
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 16px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.detail .placeholder, .empty {
  display: grid;
  gap: 12px;
  place-items: start;
  padding: 24px;
  border: 1px dashed var(--border);
  border-radius: 12px;
  color: var(--muted);
}
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
