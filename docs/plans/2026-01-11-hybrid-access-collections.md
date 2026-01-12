# Hybrid Access Collections Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a "Hybrid Access" model where guests clicking Collections see a "Curiosity Page" prompting signup, while logged-in users access their private collection workspace.

**Architecture:** 
- Remove ProtectedRoute wrapper from /collections route
- Create a new CollectionsGateway component that checks auth status
- Show CuriosityPage for guests, Collections for authenticated users

**Tech Stack:** React, React Router, TypeScript, existing useAuth hook

---

## Task 1: Create Curiosity Page Component

**Files:**
- Create: `src/pages/CollectionsCuriosityPage.tsx`
- Create: `src/pages/CollectionsCuriosityPage.css`

**Step 1: Create the curiosity page TSX**

```tsx
// src/pages/CollectionsCuriosityPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthModal } from '../components/AuthModal';
import './CollectionsCuriosityPage.css';

/**
 * CollectionsCuriosityPage - shown to guests when they click Collections.
 * Creates FOMO by showing what they're missing, prompts signup.
 */
export const CollectionsCuriosityPage = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="curiosity-page">
            {/* Navigation */}
            <nav className="curiosity-nav">
                <Link to="/" className="nav-logo">Prompt Library</Link>
                <div className="nav-actions">
                    <button className="nav-link-login" onClick={() => setShowAuthModal(true)}>
                        Log In
                    </button>
                    <button className="btn-signup" onClick={() => setShowAuthModal(true)}>
                        Sign Up Free
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="curiosity-main">
                <div className="curiosity-content">
                    <span className="curiosity-badge">🔒 Members Only</span>
                    <h1 className="curiosity-title">
                        Your Personal <span className="gradient-text">Prompt Vault</span>
                    </h1>
                    <p className="curiosity-subtitle">
                        Save your favorite prompts, organize them into collections, 
                        and access them from anywhere. Your prompts stay private and 
                        sync across all your devices.
                    </p>

                    {/* Feature Grid */}
                    <div className="curiosity-features">
                        <div className="curiosity-feature">
                            <span className="feature-icon">📁</span>
                            <h3>Organize</h3>
                            <p>Create unlimited collections to group your prompts.</p>
                        </div>
                        <div className="curiosity-feature">
                            <span className="feature-icon">⭐</span>
                            <h3>Favorites</h3>
                            <p>Star your best prompts for quick access anytime.</p>
                        </div>
                        <div className="curiosity-feature">
                            <span className="feature-icon">🔄</span>
                            <h3>Sync</h3>
                            <p>Offline-first storage with secure cloud sync.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="curiosity-cta">
                        <button className="btn-signup btn-signup--large" onClick={() => setShowAuthModal(true)}>
                            Create Free Account
                        </button>
                        <p className="curiosity-hint">
                            Already have an account? <button onClick={() => setShowAuthModal(true)}>Log in</button>
                        </p>
                    </div>
                </div>

                {/* Preview Mockup */}
                <div className="curiosity-preview">
                    <div className="preview-card">
                        <div className="preview-header">
                            <span>📚 My Collections</span>
                            <span className="preview-badge">3 collections</span>
                        </div>
                        <div className="preview-items">
                            <div className="preview-item preview-item--blur">📝 Coding Prompts</div>
                            <div className="preview-item preview-item--blur">✍️ Writing Templates</div>
                            <div className="preview-item preview-item--blur">💼 Business...</div>
                        </div>
                        <div className="preview-overlay">
                            <span>🔐</span>
                            <p>Sign up to unlock</p>
                        </div>
                    </div>
                </div>
            </main>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
};
```

**Step 2: Create CSS file** (see full CSS in implementation)

**Step 3: Commit**
```bash
git add src/pages/CollectionsCuriosityPage.tsx src/pages/CollectionsCuriosityPage.css
git commit -m "feat: add CollectionsCuriosityPage for guest users"
```

---

## Task 2: Create Collections Gateway Component

**Files:**
- Create: `src/pages/CollectionsGateway.tsx`

**Step 1: Create gateway**

```tsx
import { useAuth } from '../hooks';
import { Collections } from './Collections';
import { CollectionsCuriosityPage } from './CollectionsCuriosityPage';

export const CollectionsGateway = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="app-loading">
                <div className="app-loading__spinner"></div>
                <span>Loading...</span>
            </div>
        );
    }

    return user ? <Collections /> : <CollectionsCuriosityPage />;
};
```

---

## Task 3: Update App.tsx Routing

**Files:**
- Modify: `src/App.tsx`

**Changes:**
1. Add import: `import { CollectionsGateway } from './pages/CollectionsGateway';`
2. Change route from `<ProtectedRoute><Collections /></ProtectedRoute>` to `<CollectionsGateway />`

---

## Task 4: Browser Verification

- Guest → /collections → Sees Curiosity Page
- Logged-in → /collections → Sees Collections
