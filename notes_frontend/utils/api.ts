/**
 * Minimal localStorage-backed API to simulate authentication and notes CRUD.
 * This avoids hard-coding URLs and respects the instruction not to assume other services.
 * Replace with real HTTP requests when a backend is available.
 */

import type { AuthCredentials, Note, User, UUID } from '~/types';

const STORAGE_KEYS = {
  users: 'notes_app_users',
  session: 'notes_app_session',
  notes: 'notes_app_notes',
};

type StoredUsers = Record<string, { id: UUID; email: string; password: string; name?: string }>;
type StoredNotes = Record<string, Note[]>; // key: userId -> notes[]

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function genId(): UUID {
  return crypto.getRandomValues(new Uint32Array(4)).join('-');
}

export function getCurrentUser(): User | null {
  const session = readJSON<User | null>(STORAGE_KEYS.session, null);
  return session;
}

export function signOut(): void {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function signUp(creds: AuthCredentials, name?: string): User {
  const users = readJSON<StoredUsers>(STORAGE_KEYS.users, {});
  const existing = Object.values(users).find((u) => u.email.toLowerCase() === creds.email.toLowerCase());
  if (existing) {
    throw { message: 'Email already registered', status: 400 } as Error;
  }
  const id = genId();
  users[id] = { id, email: creds.email, password: creds.password, name };
  writeJSON(STORAGE_KEYS.users, users);

  const user: User = { id, email: creds.email, name, token: genId() };
  writeJSON(STORAGE_KEYS.session, user);

  // initialize notes bucket
  const notes = readJSON<StoredNotes>(STORAGE_KEYS.notes, {});
  if (!notes[id]) notes[id] = [];
  writeJSON(STORAGE_KEYS.notes, notes);

  return user;
}

export function signIn(creds: AuthCredentials): User {
  const users = readJSON<StoredUsers>(STORAGE_KEYS.users, {});
  const match = Object.values(users).find(
    (u) => u.email.toLowerCase() === creds.email.toLowerCase() && u.password === creds.password,
  );
  if (!match) {
    throw { message: 'Invalid email or password', status: 401 } as Error;
  }
  const user: User = { id: match.id, email: match.email, name: match.name, token: genId() };
  writeJSON(STORAGE_KEYS.session, user);
  return user;
}

// Notes CRUD
export function listNotes(userId: UUID, search?: string): Note[] {
  const db = readJSON<StoredNotes>(STORAGE_KEYS.notes, {});
  let notes = db[userId] || [];
  if (search && search.trim()) {
    const q = search.toLowerCase();
    notes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  }
  // sort pinned first, then updated desc
  return [...notes].sort((a, b) => {
    if (Boolean(b.pinned) !== Boolean(a.pinned)) return Number(b.pinned) - Number(a.pinned);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function createNote(userId: UUID, note: Partial<Note>): Note {
  const db = readJSON<StoredNotes>(STORAGE_KEYS.notes, {});
  const now = new Date().toISOString();
  const newNote: Note = {
    id: genId(),
    title: note.title?.trim() || 'Untitled',
    content: note.content || '',
    tags: note.tags || [],
    pinned: Boolean(note.pinned),
    createdAt: now,
    updatedAt: now,
  };
  db[userId] = db[userId] || [];
  db[userId].push(newNote);
  writeJSON(STORAGE_KEYS.notes, db);
  return newNote;
}

export function updateNote(userId: UUID, id: UUID, patch: Partial<Note>): Note {
  const db = readJSON<StoredNotes>(STORAGE_KEYS.notes, {});
  const list = db[userId] || [];
  const idx = list.findIndex((n) => n.id === id);
  if (idx === -1) {
    throw { message: 'Note not found', status: 404 } as Error;
  }
  const now = new Date().toISOString();
  const updated: Note = { ...list[idx], ...patch, updatedAt: now };
  list[idx] = updated;
  db[userId] = list;
  writeJSON(STORAGE_KEYS.notes, db);
  return updated;
}

export function deleteNote(userId: UUID, id: UUID): void {
  const db = readJSON<StoredNotes>(STORAGE_KEYS.notes, {});
  const list = db[userId] || [];
  db[userId] = list.filter((n) => n.id !== id);
  writeJSON(STORAGE_KEYS.notes, db);
}

export function getNote(userId: UUID, id: UUID): Note | null {
  const db = readJSON<StoredNotes>(STORAGE_KEYS.notes, {});
  const list = db[userId] || [];
  return list.find((n) => n.id === id) || null;
}
