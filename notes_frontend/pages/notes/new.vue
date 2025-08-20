<template>
  <div class="wrap">
    <h2>Create a new note</h2>
    <NoteEditor :id="createdId || undefined" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useNotesStore } from '~/stores/notes';
import NoteEditor from '~/components/NoteEditor.vue';

const auth = useAuthStore();
const notes = useNotesStore();

const createdId = ref<string | null>(null);

onMounted(async () => {
  if (!auth.user) {
    return navigateTo('/auth/login');
  }
  const before = notes.items.length;
  await notes.refresh();
  notes.createEmpty();
  const after = notes.items.length;
  if (after > before) {
    createdId.value = notes.items[0].id;
  } else {
    // fallback to the most recent
    createdId.value = notes.items[0]?.id || null;
  }
});
</script>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
}
</style>
