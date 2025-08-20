<template>
  <NuxtLink class="item" :to="`/notes/${note.id}`">
    <div class="left">
      <div class="title">
        <span v-if="note.pinned" class="pin">📌</span>
        {{ note.title || 'Untitled' }}
      </div>
      <div class="snippet">{{ snippet }}</div>
      <div class="meta">
        <span>{{ formattedUpdated }}</span>
        <span v-if="note.tags?.length">• {{ note.tags.join(', ') }}</span>
      </div>
    </div>
    <div class="right" @click.stop>
      <button class="btn small" @click="onTogglePin">{{ note.pinned ? 'Unpin' : 'Pin' }}</button>
      <button class="btn small danger" @click="onDelete">Delete</button>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Note } from '~/types';
import { useNotesStore } from '~/stores/notes';

const props = defineProps<{ note: Note }>();
const notes = useNotesStore();

const snippet = computed(() => {
  const text = props.note.content.replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim();
  return text.length > 80 ? text.slice(0, 80) + '…' : text || 'No content';
});

const formattedUpdated = computed(() => {
  const d = new Date(props.note.updatedAt);
  return `Updated ${d.toLocaleString()}`;
});

function onDelete() {
  if (confirm('Delete this note?')) {
    notes.remove(props.note.id);
  }
}

function onTogglePin() {
  notes.togglePin(props.note.id);
}
</script>

<style scoped>
.item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  background: var(--card);
}
.item:hover {
  background: var(--hover);
}
.title {
  font-weight: 600;
  color: var(--text-strong);
  display: flex;
  align-items: center;
  gap: 6px;
}
.pin {
  font-size: 14px;
}
.snippet {
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
}
.meta {
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
}
.right {
  display: flex;
  align-items: start;
  gap: 8px;
}
.btn.small {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 8px;
}
.btn.small.danger {
  background: #ef5350;
  border-color: #ef5350;
  color: white;
}
</style>
