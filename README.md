<div align="center">

# PROMPT LIBRARY

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Privacy](https://img.shields.io/badge/Privacy-First-green?style=flat-square&logo=privacy&logoColor=white)](https://github.com/Quantumdrift21/prompt-library)

[Features](#features) | [Tech Stack](#tech-stack) | [Getting Started](#getting-started) | [MCP Integration](#mcp-integration)

</div>

<br>

> [!IMPORTANT]
> **Your data stays with you.**
> "Prompt Library" is designed as a **Local-First** application. Your prompts are stored in your browser's IndexedDB by default. Syncing to the cloud (Supabase) is completely optional and fully encrypted during transit. We prioritize user privacy and data sovereignty above all else.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [MCP Integration](#mcp-integration)
- [License](#license)

## Features

*   **🔒 Privacy-First Architecture**: Built to work completely offline. reliable local storage ensures you never lose a prompt.
*   **🔄 Seamless Sync**: Optional multi-device synchronization using Supabase.
*   **📊 Analytics Dashboard**: Beautiful visualizations for your usage and engagement habits.
*   **🎨 Premium UI**: "Dark Glass" aesthetic with a fully accessible Day/Night toggle.
*   **📱 Progressive Web App**: Installable on desktop and mobile for a native experience.
*   **⚡ Lightning Fast**: Powered by Vite and React 19 for instant interactions.

## Tech Stack

This project is built with a modern, performance-oriented stack:

-   **Frontend**: [React 19](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: Vanilla CSS (Variables, Grid, Flexbox)
-   **Database**: IndexedDB (Local) + Supabase (Cloud)

## Getting Started

Follow these steps to set up your own instance.

### 1. Clone the repository

```bash
git clone https://github.com/Quantumdrift21/prompt-library.git
cd prompt-library
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and add your Supabase credentials (if using sync):

```bash
cp .env.example .env.local
```

### 4. Run the development server

```bash
npm run dev
```

## MCP Integration

This project is ready for the **Model Context Protocol (MCP)**.

*   **Server**: `@modelcontextprotocol/server-github`
*   **Purpose**: Allows AI agents to read, write, and manage this repository efficiently.
*   **Setup**: Ensure your `.env` contains a valid `GITHUB_PERSONAL_ACCESS_TOKEN`.

---

<div align="center">

**[Quantumdrift21](https://github.com/Quantumdrift21)**

</div>
