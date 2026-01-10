# Prompt Library

A modern, local-first web application for managing, organizing, and syncing prompt engineering templates. It solves the problem of scattered prompt storage by providing a unified, searchable, and offline-capable interface with cloud synchronization capabilities.

## Tech Stack

*   **Core**: React 18, TypeScript, Vite
*   **Styling**: Vanilla CSS (CSS Variables for theming), Glassmorphism UI
*   **State/Data**: React Hooks, IndexedDB (Local), Supabase (Cloud Sync)
*   **Routing**: React Router DOM
*   **Testing**: Vitest, React Testing Library
*   **Linting**: ESLint, Prettier

## Project Structure

```
├── .agent/                 # Agent workflows and rules
├── public/                 # Static assets (images, icons)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── dashboard/      # Navigation and Sidebar
│   │   ├── settings/       # Settings page sections
│   │   └── ...             # Core components (PromptCard, Editor)
│   ├── hooks/              # Custom React hooks (useAuth, useSync)
│   ├── pages/              # Page views (Home, Profile, Settings)
│   ├── services/           # Business logic & APIs
│   │   ├── authService.ts  # Supabase Auth wrapper
│   │   ├── indexedDb.ts    # Local database operations
│   │   └── syncService.ts  # Offline-first sync logic
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Main router and layout
│   └── main.tsx            # Entry point
├── supabase/               # SQL migrations and config
└── vite.config.ts          # Build configuration
```

## Core Features

*   **Prompt Management**: Create, edit, delete, and tag prompts.
*   **Offline-First**: All data is stored locally in IndexedDB, serving content instantly even without internet.
*   **Cloud Sync**: Automatic background synchronization with Supabase when online.
*   **Search & Filtering**: Real-time filtering by tags and text search.
*   **Collections**: Organize prompts into logical folders (in progress).
*   **User Profiles**: Avatar upload and account management.
*   **Theming**: Day/Night mode with premium glass aesthetics.

## Data & Logic Flow

1.  **Local Read**: The UI reads data primarily from `IndexedDB` via `indexedDbService` for instant performance.
2.  **Write Path**: User actions (create/update) write immediately to `IndexedDB`.
3.  **Sync**: The `syncService` listens for changes and pushes them to Supabase in the background. It also pulls remote changes to update the local store.
4.  **Auth**: `authService` manages the user session, gating access to cloud storage but allowing offline guest usage.

## Installation & Setup

1.  **Prerequisites**: Node.js v18+, npm.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file with Supabase credentials:
    ```
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```
4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:5173`.
5.  **Run Tests**:
    ```bash
    npm test
    ```

## Key File Summaries

| File | Responsibility |
| :--- | :--- |
| `src/services/indexedDb.ts` | Handles all local CRUD operations and persistence. |
| `src/services/syncService.ts` | Manages the bidirectional data sync between Local DB and Cloud. |
| `src/services/authService.ts` | Wrapper around Supabase Auth for session management. |
| `src/App.tsx` | Main application router and global context providers. |
| `src/components/PromptEditor.tsx` | The core interface for creating and modifying prompts. |
| `src/pages/SettingsPage.tsx` | User preferences and account management hub. |

## Future Roadmap

*   **Performance**: Optimize React rendering for large prompt lists (virtualization).
*   **Collections**: Finalize the Collections/Folders feature.
*   **Security**: Implement stricter RLS policies for shared workspaces.
*   **Stability**: **Critical Fix**: Investigate and resolve blank page rendering issue occasionally seen on strict routing.
*   **Testing**: Expand test coverage for `syncService` edge cases.



from now on follow instruction from agents and rules in rules folder for all the chats