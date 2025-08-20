/**
 * Types and interfaces for the Notes frontend application.
 */

export type UUID = string;

export interface User {
  id: UUID;
  email: string;
  name?: string;
  token?: string;
}

export interface Note {
  id: UUID;
  title: string;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  tags?: string[];
  pinned?: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
}
