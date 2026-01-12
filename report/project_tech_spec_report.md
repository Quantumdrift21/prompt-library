# Project Technical Specification Report
**Project Name:** Prompt Library
**Date:** 2026-01-12

## 1. Executive Summary
Prompt Library is a modern, offline-first web application designed for managing, discovering, and learning about AI prompts. It features a "Premium Glass" aesthetic, robust local storage capabilities, and cloud synchronization. The application serves two main user types: Guests (Discover & local storage) and Authenticated Users (Cloud sync & cross-device access).

## 2. Technology Stack

### Core Framework
-   **Runtime:** React 18+ (Functional Components, Hooks)
-   **Build Tool:** Vite (Fast HMR, ES Modules)
-   **Language:** TypeScript (Strict typing)
-   **Routing:** React Router DOM v6+

### Persistence & Backend
-   **Local Storage:** Native IndexedDB API (Custom `IndexedDBStorageService` wrapper)
-   **Remote Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
-   **Synchronization:** Custom dual-write / background sync strategy.

### UI & Styling
-   **Styling Engine:** Raw CSS Variables (Theming) & Scoped CSS Modules.
-   **Design System:** "Premium Glass" (Translucent backgrounds, 3D icons, gradients).
-   **Iconography:** Lucide React (`icon-3d` custom styling).
-   **Components:** Custom-built accessible components (Modals, Tooltips, Cards).

### Testing
-   **Runner:** Vitest
-   **Library:** React Testing Library (`@testing-library/react`)
-   **Validation:** Component rendering, Service logic, Hook behavior.

## 3. Architecture & Data Flow

### Offline-First Philosophy
The application follows a strict offline-first architecture. 
1.  **Read:** UI always reads from `IndexedDB` first for instant load times.
2.  **Write:** Mutations are written to `IndexedDB` immediately, then queued for Supabase sync.
3.  **Sync:** `SyncService` handles background synchronization, conflict resolution (Last-Write-Wins), and merging public/private data.

### Service Layer Pattern
Business logic is decoupled from UI via specialized services:
-   `indexedDbService`: Wraps raw IDB transactions.
-   `supabaseClient`: Manages auth and remote queries.
-   `publicPromptsService`: Handles "Discover" feed (Mock data + Live Supabase queries).
-   `profileService`: User metadata and avatar management.
-   `studyPromptService`: Generates meta-prompts for the Learn module.

## 4. Feature Modules

### 4.1. Discovery Engine ("Discover")
-   **Purpose:** Explore community prompts.
-   **Key Features:**
    -   Global Search (Title/Content).
    -   Tag Filtering (Horizontal scrollable chips).
    -   Pagination ("Load More" for 900+ items).
    -   Responsive 3-column Grid.
    -   Guest access supported (Merges local guest prompts with public feed).

### 4.2. Personal Library ("My Collection")
-   **Purpose:** Manage private prompts.
-   **Key Features:**
    -   CRUD operations (Create, Edit, Soft Delete).
    -   Organization: Collections (Folders), Favorites, Tags.
    -   Views: All, Favorites, Archived.

### 4.3. Learn Module ("Method-First Learning")
-   **Purpose:** Educational tool for mastering prompting techniques.
-   **Architecture:**
    -   **MethodSidebar:** Explains techniques (Feynman, Leitner, etc.).
    -   **CognitiveBuilder:** Interactive form to construct study prompts.
    -   **ActiveNotes:** Synthesis area for user reflection.
-   **Logic:** Uses `studyPromptService` to dynamically generate prompts based on method/topic/goal.

### 4.4. Settings & Profile
-   **Purpose:** User configuration.
-   **Key Features:**
    -   Profile Management (Bio, Avatar upload to Supabase Storage).
    -   Data Management (Export/Import JSON).
    -   Appearance settings.

## 5. Database Schema

### Local (IndexedDB)
-   **Store: `prompts`**: `{ id, title, content, tags, type, folderId, created_at, updated_at, deleted_at }`
-   **Store: `collections`**: `{ id, name, description, color, icon }`
-   **Store: `user_settings`**: `{ theme, ... }`

### Remote (Supabase PostgreSQL)
-   **Table: `profiles`**: Extends Auth user with bio, avatar_url.
-   **Table: `prompts`**: Private user prompts (RLS protected).
-   **Table: `public_prompts`**: Community visible prompts (Read-only for most, Admin writable).
-   **Storage Bucket: `avatars`**: User profile images.

## 6. Implementation Status
-   **Completed:** Core CRUD, Auth, Discover Enhancements (Search/Filter/Page), Learn Page Refactor (Method-First), Unit Testing (core pages).
-   **In Progress:** Advanced Sync conflict resolution, Mobile-specific optimizations.

## 7. Future Roadmap
-   **AI Integration:** Direct LLM execution within the app (currently "Prompt Management" only).
-   **Social Features:** Sharing collections, public user profiles.
-   **Advanced Analytics:** Prompt usage stats (Copy count, Success rate).
