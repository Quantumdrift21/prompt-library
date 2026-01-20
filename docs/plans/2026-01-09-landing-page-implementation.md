# Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a high-conversion, inspiration-first landing page focused on text-generation AI prompts, including a dynamic hero with "Live Terminal" animation and a detailed discovery grid.

**Architecture:** 
- **Framework:** React + Vite (existing stack).
- **Styling:** Vanilla CSS variables (Glassmorphism theme).
- **Components:** New specialized components (`LandingNav`, `TerminalHero`, `DiscoveryGrid`) composed in a `LandingPage` view.
- **Routing:** Accessible via `/landing` initially for testing, then replacing `/` for unauthenticated users.

**Tech Stack:** React, CSS Modules (or scoped CSS), Lucide React (Icons).

---

### Task 1: Scaffolding and Routing

**Files:**
- Create: `src/pages/LandingPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/types/routes.ts` (if applicable)

**Step 1: Write the failing test for routing**

```typescript
// src/pages/__tests__/LandingPage.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

test('renders landing page on /landing route', () => {
    window.history.pushState({}, 'Landing Page', '/landing');
    render(<App />);
    expect(screen.getByText(/Master the Art of Context/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/pages/__tests__/LandingPage.test.tsx`
Expected: FAIL "Master the Art of Context" not found

**Step 3: Write minimal implementation**

```typescript
// src/pages/LandingPage.tsx
export const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Master the Art of Context</h1>
    </div>
  );
};

// src/App.tsx (Update routing)
// Add <Route path="/landing" element={<LandingPage />} />
```

**Step 4: Run test to verify it passes**

Run: `npm test src/pages/__tests__/LandingPage.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/LandingPage.tsx src/App.tsx src/pages/__tests__/LandingPage.test.tsx
git commit -m "feat: scaffold landing page and routing"
```

---

### Task 2: Global Navigation (Glassmorphism)

**Files:**
- Create: `src/components/landing/LandingNav.tsx`
- Create: `src/components/landing/LandingNav.css`
- Modify: `src/pages/LandingPage.tsx`

**Step 1: Write the failing test**

```typescript
// src/components/landing/__tests__/LandingNav.test.tsx
import { render, screen } from '@testing-library/react';
import { LandingNav } from '../LandingNav';
import { BrowserRouter } from 'react-router-dom';

test('renders navigation links and auth buttons', () => {
  render(
    <BrowserRouter>
      <LandingNav />
    </BrowserRouter>
  );
  expect(screen.getByText('Prompt Library')).toBeInTheDocument();
  expect(screen.getByText('Discover')).toBeInTheDocument();
  expect(screen.getByText('Log In')).toBeInTheDocument();
  expect(screen.getByText('Sign Up Free')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/landing/__tests__/LandingNav.test.tsx`

**Step 3: Write minimal implementation**

```typescript
// src/components/landing/LandingNav.tsx
import './LandingNav.css';

export const LandingNav = () => {
  return (
    <nav className="landing-nav">
      <div className="nav-logo">Prompt Library</div>
      <div className="nav-links">
        <a href="#discover">Discover</a>
        <a href="#features">Features</a>
      </div>
      <div className="nav-actions">
        <a href="/login">Log In</a>
        <button>Sign Up Free</button>
      </div>
    </nav>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/landing/__tests__/LandingNav.test.tsx`

**Step 5: Commit**

```bash
git add src/components/landing/LandingNav.tsx src/components/landing/LandingNav.css src/components/landing/__tests__/LandingNav.test.tsx
git commit -m "feat: implement glassmorphism navigation bar"
```

---

### Task 3: Terminal Hero Component (Typewriter Effect)

**Files:**
- Create: `src/components/landing/TerminalHero.tsx`
- Create: `src/components/landing/TerminalHero.css`

**Step 1: Write the failing test**

```typescript
// src/components/landing/__tests__/TerminalHero.test.tsx
import { render, screen } from '@testing-library/react';
import { TerminalHero } from '../TerminalHero';

test('renders dynamic terminal text', () => {
  render(<TerminalHero />);
  // Check for static elements first
  expect(screen.getByText(/Refactor this React component/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/landing/__tests__/TerminalHero.test.tsx`

**Step 3: Write minimal implementation**

```typescript
// src/components/landing/TerminalHero.tsx
import './TerminalHero.css';

export const TerminalHero = () => {
  return (
    <div className="terminal-hero">
      <div className="terminal-window">
         <code>Refactor this React component...</code>
      </div>
    </div>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/landing/__tests__/TerminalHero.test.tsx`

**Step 5: Commit**

```bash
git add src/components/landing/TerminalHero.* src/components/landing/__tests__/TerminalHero.test.tsx
git commit -m "feat: implement terminal hero with basic text"
```

---

### Task 4: Detailed Prompt Cards Grid

**Files:**
- Create: `src/components/landing/PromptDiscoveryGrid.tsx`
- Create: `src/components/landing/PromptCardDetail.tsx`

**Step 1: Write the failing test**

```typescript
// src/components/landing/__tests__/DiscoveryGrid.test.tsx
import { render, screen } from '@testing-library/react';
import { PromptDiscoveryGrid } from '../PromptDiscoveryGrid';

test('renders technical prompt details', () => {
  render(<PromptDiscoveryGrid />);
  expect(screen.getByText('Socratic Python Tutor')).toBeInTheDocument();
  expect(screen.getByText('System Prompt')).toBeInTheDocument(); // Badge
  expect(screen.getByText('GPT-4')).toBeInTheDocument(); // Model info
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/landing/__tests__/DiscoveryGrid.test.tsx`

**Step 3: Write minimal implementation**

```typescript
// src/components/landing/PromptDiscoveryGrid.tsx
export const PromptDiscoveryGrid = () => {
  return (
    <div className="discovery-grid">
      <div className="card">
        <h3>Socratic Python Tutor</h3>
        <span className="badge">System Prompt</span>
        <span className="model">GPT-4</span>
      </div>
    </div>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/landing/__tests__/DiscoveryGrid.test.tsx`

**Step 5: Commit**

```bash
git add src/components/landing/PromptDiscoveryGrid.tsx src/components/landing/__tests__/DiscoveryGrid.test.tsx
git commit -m "feat: implement discovery grid key components"
```
