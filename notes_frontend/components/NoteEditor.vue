<template>
  <div v-if="model" class="editor">
    <div class="editor-header">
      <input
        class="title"
        v-model="draft.title"
        placeholder="Note title"
        aria-label="Note title"
      />
      <div class="row-actions">
        <button class="btn" @click="togglePin">{{ draft.pinned ? 'Unpin' : 'Pin' }}</button>
        <button class="btn danger" @click="remove">Delete</button>
        <button class="btn primary" @click="save">Save</button>
      </div>
    </div>
    <textarea
      class="content"
      v-model="draft.content"
      placeholder="Start typing..."
      aria-label="Note content"
      rows="14"
    />
  </div>
  <div v-else class="empty">
    <p>No note selected.</p>
    <NuxtLink to="/notes/new" class="btn accent">Create one</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Note, UUID } from '~/types';
import { useNotesStore } from '~/stores/notes';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{ id?: UUID }>();
const route = useRoute();
const router = useRouter();
const notes = useNotesStore();

const noteId = computed<UUID | null>(() => (props.id as UUID) || (route.params.id as string) || null);
const model = computed<Note | undefined | null>(() => (noteId.value ? notes.getById(noteId.value) : null) || notes.selected);
const draft = reactive<Partial<Note>>({
  title: '',
  content: '',
  pinned: false,
});

watch(
  () => model.value?.id,
  () => {
    if (model.value) {
      draft.title = model.value.title;
      draft.content = model.value.content;
      draft.pinned = !!model.value.pinned;
    }
  },
  { immediate: true },
);

async function save() {
  if (!model.value) return;
  await notes.savePatch(model.value.id, {
    title: (draft.title || '').trim() || 'Untitled',
    content: draft.content || '',
    pinned: !!draft.pinned,
  });
}

async function remove() {
  if (!model.value) return;
  if (confirm('Delete this note?')) {
    await notes.remove(model.value.id);
    router.push('/');
  }
}

function togglePin() {
  draft.pinned = !draft.pinned;
}
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
}
.editor-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.title {
  font-size: 20px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
  width: 100%;
}
.content {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
  resize: vertical;
}
.empty {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 48px;
  border: 1px dashed var(--border);
  border-radius: 12px;
  color: var(--muted);
}
</style>
