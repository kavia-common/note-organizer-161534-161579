<template>
  <div class="wrap">
    <NoteEditor />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useNotesStore } from '~/stores/notes';
import NoteEditor from '~/components/NoteEditor.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const auth = useAuthStore();
const notes = useNotesStore();

onMounted(async () => {
  if (!auth.user) {
    return navigateTo('/auth/login');
  }
  await notes.refresh();
  const id = route.params.id as string;
  notes.select(id);
});
</script>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
}
</style>
