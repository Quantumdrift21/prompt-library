/**
 * Core Prompt interface - the primary data model for the application.
 * Matches the spec exactly with no additional metadata.
 */
export interface Prompt {
  /** Unique identifier for the prompt */
  id: string;

  /** Brief title describing the prompt */
  title: string;

  /** The actual prompt content to be copied */
  content: string;

  /** Tags for categorization and filtering */
  tags: string[];

  /** Whether this prompt is marked as a favorite */
  favorite: boolean;

  /** ISO 8601 timestamp of creation */
  created_at: string;

  /** ISO 8601 timestamp of last update */
  updated_at: string;

  /** User ID owner of the prompt (guest or uuid) */
  user_id: string;

  /** Timestamp when the prompt was soft-deleted, or null if active */
  deleted_at: string | null;
}

/**
 * Input type for creating a new prompt.
 * Excludes auto-generated fields.
 */
export type CreatePromptInput = Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'deleted_at'>;

/**
 * Input type for updating an existing prompt.
 * All fields optional except id is passed separately.
 */
export type UpdatePromptInput = Partial<Omit<Prompt, 'id' | 'created_at' | 'updated_at'>>;
