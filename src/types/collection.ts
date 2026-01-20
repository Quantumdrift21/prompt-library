/**
 * Represents a user-defined collection (folder) for organizing prompts.
 */
export interface Collection {
    /** Unique identifier for the collection */
    id: string;

    /** Display name of the collection */
    name: string;

    /** Optional description */
    description?: string;

    /** ID of the parent collection (for nesting), or null/undefined if root */
    parent_id?: string;

    /** Optional custom icon identifier */
    icon?: string;

    /** Optional custom color hex code */
    color?: string;

    /** ISO 8601 timestamp of creation */
    created_at: string;

    /** User ID owner of the collection */
    user_id: string;
}

/**
 * Input for creating a new collection
 */
export type CreateCollectionInput = Omit<Collection, 'id' | 'created_at' | 'user_id'>;

/**
 * Input for updating a collection
 */
export type UpdateCollectionInput = Partial<Omit<Collection, 'id' | 'created_at' | 'user_id'>>;
