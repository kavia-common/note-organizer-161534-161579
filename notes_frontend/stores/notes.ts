/**
 * Notes store using Pinia.
 */

import { defineStore } from 'pinia';
import type { Note, UUID } from '~/types';
import { createNote, deleteNote, getNote, listNotes, updateNote } from '~/utils/api';
import { useAuthStore } from '~/stores/auth';

// PUBLIC_INTERFACE
export const useNotesStore = defineStore('notes', {
  state: (): {
    items: Note[];
    loading: boolean;
    error: string | null;
    query: string;
    selectedId: UUID | null;
  } => ({
    items: [],
    loading: false,
    error: null,
    query: '',
    selectedId: null,
  }),
  getters: {
    // PUBLIC_INTERFACE
    filtered(state): Note[] {
      if (!state.query) return state.items;
      const q = state.query.toLowerCase();
      return state.items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q)),
      );
    },
    // PUBLIC_INTERFACE
    selected(state): Note | undefined {
      return state.items.find((n) => n.id === state.selectedId);
    },
  },
  actions: {
    // PUBLIC_INTERFACE
    async refresh() {
      const auth = useAuthStore();
      if (!auth.user) return;
      this.loading = true;
      this.error = null;
      try {
        this.items = listNotes(auth.user.id, this.query);
      } catch (e: any) {
        this.error = e?.message || 'Failed to load notes';
      } finally {
        this.loading = false;
      }
    },
    // PUBLIC_INTERFACE
    setQuery(q: string) {
      this.query = q;
      this.refresh();
    },
    // PUBLIC_INTERFACE
    select(id: UUID | null) {
      this.selectedId = id;
    },
    // PUBLIC_INTERFACE
    createEmpty() {
      const auth = useAuthStore();
      if (!auth.user) return;
      const note = createNote(auth.user.id, { title: 'New Note', content: '' });
      this.items.unshift(note);
      this.selectedId = note.id;
    },
    // PUBLIC_INTERFACE
    async savePatch(id: UUID, patch: Partial<Note>) {
      const auth = useAuthStore();
      if (!auth.user) return;
      const updated = updateNote(auth.user.id, id, patch);
      const idx = this.items.findIndex((n) => n.id === id);
      if (idx !== -1) this.items[idx] = updated;
      await this.refresh();
    },
    // PUBLIC_INTERFACE
    async remove(id: UUID) {
      const auth = useAuthStore();
      if (!auth.user) return;
      deleteNote(auth.user.id, id);
      if (this.selectedId === id) this.selectedId = null;
      await this.refresh();
    },
    // PUBLIC_INTERFACE
    getById(id: UUID): Note | null {
      const auth = useAuthStore();
      if (!auth.user) return null;
      return getNote(auth.user.id, id);
    },
    // PUBLIC_INTERFACE
    togglePin(id: UUID) {
      const note = this.items.find((n) => n.id === id);
      if (!note) return;
      this.savePatch(id, { pinned: !note.pinned });
    },
  },
});
