# Comprehensive Web App Audit Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Perform a complete quality audit of the Prompt Library web application, testing all links, UI/UX, content, structure, functionality, and code quality from every angle.

**Architecture:** This audit systematically covers 8 core areas: (1) Navigation & Routing, (2) UI/UX Consistency, (3) Responsive Design, (4) Functionality Testing, (5) Data Persistence, (6) Authentication Flows, (7) Accessibility, and (8) Performance & Code Quality. Each area has specific test tasks with pass/fail criteria.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, IndexedDB (Dexie), Supabase, CSS Variables

---

## Project Structure Overview

### Routes (from `src/App.tsx`)
| Route | Component | Protection | Layout |
|-------|-----------|------------|--------|
| `/` | `AuthRedirect` → Landing/Home | Public | - |
| `/onboarding` | `Onboarding` | Protected | - |
| `/home` | `DashboardHome` | Protected | `DarkLayout` |
| `/library` | `PromptLibrary` | Protected | `ErrorBoundary` |
| `/collections` | `Collections` | Protected | - |
| `/learn` | `LearnPage` | Protected | `DarkLayout` |
| `/settings` | `SettingsPage` | Protected | - |
| `/*` (fallback) | `Navigate` → `/` | - | - |

### Key Components (68 files in `src/components/`)
- **Auth:** `AuthModal.tsx`
- **Layout:** `DarkLayout`, `HeroSection`, `UserMenu`, `FilterBar`
- **Core:** `PromptCard`, `PromptEditor`, `PromptList`, `SearchBar`
- **Dashboard:** 19 components in `components/dashboard/`
- **Settings:** 8 components in `components/settings/`
- **Landing:** 6 components in `components/landing/`

### Services (13 files in `src/services/`)
- `authService.ts` - Authentication (Supabase)
- `indexedDb.ts` - Local storage (IndexedDB/Dexie)
- `syncService.ts` - Cloud sync
- `dashboardService.ts` - Dashboard data
- `learningService.ts` - Learn page logic
- `analyticsService.ts` - Usage analytics
- `profileService.ts` - User profiles

### Existing Tests
```
src/services/profileService.test.ts
src/pages/__tests__/LearnPage.test.tsx
src/pages/__tests__/LandingPage.test.tsx
src/pages/SettingsPage.test.tsx
src/components/ProfileImage.test.tsx
src/components/settings/AccountSection.test.tsx
src/components/common/__tests__/LogoAnimation.test.tsx
src/components/landing/__tests__/TerminalHero.test.tsx
src/components/landing/__tests__/PromptDiscoveryGrid.test.tsx
```

---

## Task 1: Navigation & Link Testing

**Files:**
- Test: `src/App.tsx` (routes)
- Test: All navbar/sidebar link components
- Reference: Browser testing

**Step 1: List all navigation links**

Identify all clickable navigation elements:
```
Main Navigation:
- Logo → /home
- Home → /home  
- Library → /library
- Collections → /collections
- Learn → /learn
- Settings → /settings
- User Profile dropdown → /settings
- Logout → / (landing)

Sidebar (DashboardHome):
- Create New → opens modal
- Library → /library
- Collections → /collections

Footer links (if any)
```

**Step 2: Test each route manually in browser**

```bash
# Start dev server
npm run dev
```

Open browser and test each URL:
| URL | Expected Result | Notes |
|-----|-----------------|-------|
| `http://localhost:5173/` | Landing page (logged out) OR redirect to /home (logged in) | |
| `http://localhost:5173/home` | Dashboard with insights cards | Requires auth |
| `http://localhost:5173/library` | Prompt list with search/filter | Requires auth |
| `http://localhost:5173/collections` | Collections page | Requires auth |
| `http://localhost:5173/learn` | Interactive learning page | Requires auth |
| `http://localhost:5173/settings` | Settings with sidebar nav | Requires auth |
| `http://localhost:5173/onboarding` | Onboarding flow | Requires auth |
| `http://localhost:5173/nonexistent` | Redirect to `/` | Fallback test |

**Step 3: Test protected route redirects**

1. Open incognito/private window
2. Navigate to `http://localhost:5173/home`
3. Expected: Redirect to landing page `/`
4. Navigate to `http://localhost:5173/settings`
5. Expected: Redirect to landing page `/`

**Step 4: Document findings**

Create checklist:
- [ ] All main nav links work
- [ ] All sidebar links work
- [ ] Protected routes redirect when logged out
- [ ] Fallback route works
- [ ] No 404 pages on valid routes
- [ ] Back/forward browser buttons work correctly

---

## Task 2: UI/UX Consistency Audit

**Files:**
- Review: `src/index.css` (CSS variables)
- Review: All `.css` files in `src/pages/` and `src/components/`
- Reference: Browser visual inspection

**Step 1: Document the design system**

Extract CSS variables from `src/index.css`:
```css
/* Expected variables to document */
--color-primary: #ff6b35
--color-secondary: #4ecdc4
--color-bg: #0f0f1a
--color-surface: rgba(...)
--color-text: #fff
--color-text-muted: #8898aa
--color-border: rgba(255, 255, 255, 0.08)
--color-danger: #ef4444
--color-success: #10b981
--color-warning: #f59e0b
```

**Step 2: Visual consistency checklist**

For each page, verify:

| Page | Background | Cards | Buttons | Text Colors | Spacing |
|------|------------|-------|---------|-------------|---------|
| Landing | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Home | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Library | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Collections | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Learn | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Settings | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |

**Step 3: Check hover/active states**

Test all interactive elements:
- [ ] Buttons have hover effect (color change, glow)
- [ ] Cards have hover effect (shimmer, elevation)
- [ ] Links have hover effect (underline or color)
- [ ] Inputs have focus state (border glow)
- [ ] Nav items have active state (highlight)

**Step 4: Check animations**

- [ ] Page transitions are smooth
- [ ] Loading states have spinners/skeletons
- [ ] Modals fade in/out
- [ ] Shimmer effects on cards work
- [ ] No janky/stuttering animations

---

## Task 3: Responsive Design Testing

**Files:**
- Review: All CSS files for media queries
- Reference: Browser DevTools responsive mode

**Step 1: Test breakpoints**

Test each page at these widths:
| Breakpoint | Width | Device Type |
|------------|-------|-------------|
| Mobile S | 320px | Small phones |
| Mobile M | 375px | iPhone SE |
| Mobile L | 425px | Large phones |
| Tablet | 768px | iPad |
| Laptop | 1024px | Small laptops |
| Desktop | 1440px | Standard desktop |

**Step 2: Mobile-specific tests**

For widths < 768px:
- [ ] Navigation collapses to hamburger menu
- [ ] Sidebar becomes overlay or hidden
- [ ] Cards stack vertically
- [ ] Text is readable (min 14px)
- [ ] Touch targets are ≥44px
- [ ] No horizontal scrolling
- [ ] Forms are usable

**Step 3: Document layout issues**

| Page | Issue | Breakpoint | Severity |
|------|-------|------------|----------|
| | | | |

---

## Task 4: Functionality Testing

**Files:**
- Test: `src/components/PromptCard.tsx`
- Test: `src/components/PromptEditor.tsx`
- Test: `src/components/AuthModal.tsx`
- Test: `src/services/indexedDb.ts`

**Step 1: Run existing unit tests**

```bash
npm run test
```

Expected: All tests pass
```
✓ src/services/profileService.test.ts
✓ src/pages/__tests__/LearnPage.test.tsx
✓ src/pages/__tests__/LandingPage.test.tsx
✓ src/pages/SettingsPage.test.tsx
✓ src/components/ProfileImage.test.tsx
✓ src/components/settings/AccountSection.test.tsx
```

**Step 2: Manual prompt CRUD testing**

| Action | Steps | Expected Result |
|--------|-------|-----------------|
| Create | Click "Create New" → Fill form → Save | Prompt appears in library |
| Read | Navigate to /library | See all prompts listed |
| Update | Click Edit on prompt → Modify → Save | Changes persist |
| Delete | Click Delete on prompt → Confirm | Prompt removed |
| Duplicate | Click Duplicate on prompt | Copy created with "(Copy)" |
| Copy | Click Copy button | Content copied to clipboard |

**Step 3: Search and filter testing**

| Test | Steps | Expected |
|------|-------|----------|
| Search | Type in search bar | Prompts filter in real-time |
| Category filter | Select category | Only matching prompts show |
| Tag filter | Select tag(s) | Only tagged prompts show |
| Sort by date | Select "Newest" | Most recent first |
| Sort by name | Select "A-Z" | Alphabetical order |
| Clear filters | Click clear | All prompts visible |

**Step 4: Settings page testing**

| Section | Test | Expected |
|---------|------|----------|
| Account | Change display name | Saves successfully |
| Account | Upload profile picture | Image updates |
| Account | Remove profile picture | Default shows |
| Preferences | Toggle settings | Persist on refresh |
| Security | Change email | Confirmation sent |
| Privacy | Data export | JSON file downloads |

---

## Task 5: Data Persistence Testing

**Files:**
- Test: `src/services/indexedDb.ts`
- Test: `src/services/syncService.ts`
- Reference: Browser DevTools → Application → IndexedDB

**Step 1: Test offline functionality**

1. Open app and create a prompt
2. Open DevTools → Network → Set "Offline"
3. Try to:
   - [ ] View existing prompts (should work)
   - [ ] Create new prompt (should work locally)
   - [ ] Edit prompt (should work locally)
   - [ ] Search prompts (should work)
   - [ ] Copy prompt (should work)
4. Set Network back to "Online"
5. Expected: Data syncs to cloud

**Step 2: Test data persistence across refresh**

1. Create a prompt
2. Refresh page (F5)
3. Expected: Prompt still exists
4. Close browser completely
5. Reopen and navigate to /library
6. Expected: Prompt still exists

**Step 3: Test IndexedDB directly**

```javascript
// In browser console
const db = await indexedDB.open('PromptLibraryDB');
// Check stores exist and have data
```

**Step 4: Test sync status**

- [ ] Sync indicator shows when syncing
- [ ] "Last synced" timestamp updates
- [ ] Errors display when sync fails

---

## Task 6: Authentication Flow Testing

**Files:**
- Test: `src/services/authService.ts`
- Test: `src/components/AuthModal.tsx`
- Reference: Supabase dashboard

**Step 1: Test login flow**

| Step | Action | Expected |
|------|--------|----------|
| 1 | Click "Log In" on landing | Modal opens |
| 2 | Enter valid email | Accepted |
| 3 | Enter valid password | Accepted |
| 4 | Click Submit | Loading state shows |
| 5 | Success | Redirect to /home |

**Step 2: Test signup flow**

| Step | Action | Expected |
|------|--------|----------|
| 1 | Click "Sign Up" on landing | Modal opens |
| 2 | Enter email | Accepted |
| 3 | Enter password (min 6 chars) | Accepted |
| 4 | Click Submit | Loading state shows |
| 5 | Success | Redirect to /onboarding |

**Step 3: Test error states**

| Scenario | Input | Expected Error |
|----------|-------|----------------|
| Invalid email | "notanemail" | "Invalid email format" |
| Wrong password | wrong password | "Invalid login credentials" |
| User not found | unregistered email | "User not found" |
| Weak password | "123" | "Password too weak" |

**Step 4: Test logout flow**

1. Click user menu → Logout
2. Expected: Redirect to landing page
3. Try to access /home directly
4. Expected: Redirect to landing

**Step 5: Test session persistence**

1. Log in
2. Close browser tab (not whole browser)
3. Open new tab to localhost:5173
4. Expected: Still logged in

---

## Task 7: Accessibility Audit

**Files:**
- All component files
- Reference: Browser accessibility tools

**Step 1: Run automated accessibility check**

Use browser extension (axe DevTools or WAVE) on each page:
- [ ] Landing page
- [ ] Dashboard home
- [ ] Library
- [ ] Collections
- [ ] Learn
- [ ] Settings

**Step 2: Keyboard navigation testing**

| Test | Action | Expected |
|------|--------|----------|
| Tab navigation | Press Tab repeatedly | Focus moves logically |
| Focus visibility | Tab through page | Focus ring visible |
| Skip to content | Press Tab on page load | Skip link appears |
| Modal focus trap | Open modal, Tab | Focus stays in modal |
| Escape closes modal | Press Esc | Modal closes |
| Enter activates | Focus button, press Enter | Button activates |

**Step 3: Screen reader basics**

- [ ] All images have alt text
- [ ] All buttons have accessible names
- [ ] All form inputs have labels
- [ ] Landmarks (main, nav, etc.) are present
- [ ] Heading hierarchy is logical (h1 → h2 → h3)

**Step 4: Color contrast**

Check text contrast ratios (min 4.5:1):
- [ ] Body text on backgrounds
- [ ] Muted text on backgrounds
- [ ] Button text on button backgrounds
- [ ] Link text

---

## Task 8: Performance & Code Quality

**Files:**
- All TypeScript files
- `package.json` for dependencies
- `vite.config.ts` for build config

**Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors

Check bundle size:
```bash
npm run build -- --report
# OR
npx vite-bundle-analyzer
```

**Step 2: Check for console errors**

1. Open DevTools Console
2. Navigate through all pages
3. Document any errors or warnings:

| Page | Error/Warning | Severity |
|------|---------------|----------|
| | | |

**Step 3: Check TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: No type errors

**Step 4: Check for memory leaks**

1. Open DevTools → Memory
2. Take heap snapshot
3. Navigate around app for 2 minutes
4. Take another snapshot
5. Compare: Memory growth should be minimal

**Step 5: Run linter**

```bash
npm run lint
```

Expected: No critical errors

---

## Task 9: Content Review

**Files:**
- All `.tsx` files with user-facing text
- `src/data/` for any content files

**Step 1: Check for placeholder content**

Search for common placeholders:
```bash
grep -r "TODO" src/
grep -r "Lorem" src/
grep -r "placeholder" src/
grep -r "example.com" src/
```

**Step 2: Check for spelling/grammar**

Review all user-facing text:
- [ ] Page titles
- [ ] Button labels
- [ ] Form labels
- [ ] Error messages
- [ ] Help text
- [ ] Empty states

**Step 3: Check for consistency**

| Term | Used Consistently? |
|------|-------------------|
| "Prompt" vs "Template" | |
| "Collection" vs "Folder" | |
| "Save" vs "Create" | |
| Button capitalization | |

---

## Task 10: Security Review

**Files:**
- `src/services/authService.ts`
- `src/services/supabase.ts`
- `.env` and `.env.example`

**Step 1: Check for exposed secrets**

```bash
grep -r "SUPABASE" src/
grep -r "API_KEY" src/
grep -r "SECRET" src/
```

Expected: Only environment variable references, no hardcoded values

**Step 2: Check environment variables**

Verify `.env.example` exists with:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Step 3: Check for XSS vulnerabilities**

Search for dangerous patterns:
```bash
grep -r "dangerouslySetInnerHTML" src/
grep -r "innerHTML" src/
```

If found, verify content is sanitized.

**Step 4: Check RLS policies**

Run security advisor in Supabase:
```
mcp_supabase-mcp-server_get_advisors(project_id, type="security")
```

---

## Audit Summary Template

After completing all tasks, fill in this summary:

### Overall Health Score

| Category | Score (1-10) | Notes |
|----------|--------------|-------|
| Navigation | /10 | |
| UI/UX Consistency | /10 | |
| Responsive Design | /10 | |
| Functionality | /10 | |
| Data Persistence | /10 | |
| Authentication | /10 | |
| Accessibility | /10 | |
| Performance | /10 | |
| Content Quality | /10 | |
| Security | /10 | |
| **TOTAL** | **/100** | |

### Critical Issues (Must Fix)

1. 
2. 
3. 

### High Priority Issues

1. 
2. 
3. 

### Medium Priority Issues

1. 
2. 
3. 

### Low Priority / Nice to Have

1. 
2. 
3. 

---

## Execution Commands Reference

```bash
# Start dev server
npm run dev

# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```
