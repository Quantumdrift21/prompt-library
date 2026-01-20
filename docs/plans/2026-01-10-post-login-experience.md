# Post-Login Experience Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an onboarding flow for new users (Option B) and a dashboard home for returning users (Option A), using the dark glassmorphism landing page theme consistently.

**Architecture:** 
- New users see a 3-step onboarding flow after first login
- Returning users land on a personalized dashboard home
- All UI uses the dark glassmorphism theme from LandingPage.css
- Supabase handles authentication with user metadata for onboarding status
- Delete old ProfileDashboard-related files and consolidate to new design

**Tech Stack:** React, TypeScript, Supabase Auth, CSS (dark glassmorphism theme)

---

## Task 1: Clean Up Old Files

**Files:**
- Delete: `src/pages/ProfileDashboard.tsx`
- Delete: `src/pages/ProfileDashboard.css`
- Delete: `src/pages/Analytics.tsx`
- Delete: `src/pages/Analytics.css`
- Delete: `src/components/AuthButton.tsx`
- Delete: `src/components/AuthButton.css`
- Delete: `src/components/dashboard/DashboardNav.tsx`
- Delete: `src/components/dashboard/DashboardNav.css`
- Delete: `src/components/dashboard/IconSidebar.tsx`
- Delete: `src/components/dashboard/IconSidebar.css`

**Step 1:** Delete the old files
```bash
cd c:\Users\Vignesh\Documents\Work TILL DONE\Prompt Library
del src\pages\ProfileDashboard.tsx
del src\pages\ProfileDashboard.css
del src\pages\Analytics.tsx
del src\pages\Analytics.css
del src\components\AuthButton.tsx
del src\components\AuthButton.css
del src\components\dashboard\DashboardNav.tsx
del src\components\dashboard\DashboardNav.css
del src\components\dashboard\IconSidebar.tsx
del src\components\dashboard\IconSidebar.css
```

**Step 2:** Update component exports in `src/components/index.ts` - remove AuthButton export

**Step 3:** Update dashboard exports in `src/components/dashboard/index.ts` - remove DashboardNav, IconSidebar

**Step 4:** Update `src/App.tsx` - remove ProfileDashboard and Analytics routes and imports

**Step 5:** Verify app still compiles
```bash
npm run build
```

---

## Task 2: Create Onboarding Page Component

**Files:**
- Create: `src/pages/Onboarding.tsx`
- Create: `src/pages/Onboarding.css`

**Step 1:** Create `src/pages/Onboarding.css` with dark glassmorphism theme

**Step 2:** Create `src/pages/Onboarding.tsx` with 3-step flow:
- Step 1: Welcome + Name input
- Step 2: Use case selection (Developer, Writer, Marketer, Researcher)
- Step 3: First prompt creation or skip

**Step 3:** Verify component renders
```bash
npm run dev
```

---

## Task 3: Create Dashboard Home Page

**Files:**
- Create: `src/pages/DashboardHome.tsx`
- Create: `src/pages/DashboardHome.css`

**Step 1:** Create `src/pages/DashboardHome.css` matching landing page theme

**Step 2:** Create `src/pages/DashboardHome.tsx` with:
- Personalized welcome header
- Quick stats cards (prompts, collections, recent activity)
- Recent prompts widget
- Quick actions (create prompt, search, view collections)
- Same dark glassmorphism as landing page

**Step 3:** Verify component renders

---

## Task 4: Update Auth Service for Onboarding Status

**Files:**
- Modify: `src/services/authService.ts`

**Step 1:** Add method to check if user has completed onboarding:
```typescript
async hasCompletedOnboarding(): Promise<boolean> {
    const user = this.currentState.user;
    return user?.user_metadata?.onboarding_completed === true;
}
```

**Step 2:** Add method to mark onboarding as complete:
```typescript
async completeOnboarding(preferences: { display_name: string; use_case: string }): Promise<{ error: AuthError | null }> {
    if (!supabase) return { error: { message: 'Supabase not configured' } as AuthError };
    const { error } = await supabase.auth.updateUser({
        data: { ...preferences, onboarding_completed: true }
    });
    return { error };
}
```

---

## Task 5: Update AuthModal to Navigate After Login

**Files:**
- Modify: `src/components/AuthModal.tsx`

**Step 1:** Import useNavigate from react-router-dom

**Step 2:** After successful login, check onboarding status and navigate:
- New users → `/onboarding`
- Returning users → `/home`

**Step 3:** Update handleSubmit to use navigation

---

## Task 6: Update App Routes

**Files:**
- Modify: `src/App.tsx`

**Step 1:** Add imports for new pages (Onboarding, DashboardHome)

**Step 2:** Update Routes:
- `/` → LandingPage (public)
- `/onboarding` → Onboarding (protected, new users)
- `/home` → DashboardHome (protected, returning users)
- `/library` → PromptLibrary (protected)
- `/collections` → Collections (protected)
- `/settings` → SettingsPage (protected)

**Step 3:** Create ProtectedRoute wrapper component

---

## Task 7: Create Unified PromptCard Theme

**Files:**
- Modify: `src/components/PromptCard.css`

**Step 1:** Update PromptCard styles to match landing page dark glassmorphism:
- Dark background: `rgba(30, 30, 50, 0.95)`
- Subtle border: `rgba(255, 255, 255, 0.1)`
- Orange/teal gradient accents
- Hover glow effects

---

## Task 8: Final Integration & Testing

**Step 1:** Run the app and test flows:
```bash
npm run dev
```

**Step 2:** Test new user flow:
- Sign up → Onboarding → Dashboard Home

**Step 3:** Test returning user flow:
- Sign in → Dashboard Home

**Step 4:** Verify all pages use consistent dark theme

**Step 5:** Build and verify no errors:
```bash
npm run build
```

---

## Files Summary

**Delete:**
- `src/pages/ProfileDashboard.tsx`
- `src/pages/ProfileDashboard.css`
- `src/pages/Analytics.tsx`
- `src/pages/Analytics.css`
- `src/components/AuthButton.tsx`
- `src/components/AuthButton.css`
- `src/components/dashboard/DashboardNav.tsx`
- `src/components/dashboard/DashboardNav.css`
- `src/components/dashboard/IconSidebar.tsx`
- `src/components/dashboard/IconSidebar.css`

**Create:**
- `src/pages/Onboarding.tsx`
- `src/pages/Onboarding.css`
- `src/pages/DashboardHome.tsx`
- `src/pages/DashboardHome.css`

**Modify:**
- `src/services/authService.ts`
- `src/components/AuthModal.tsx`
- `src/App.tsx`
- `src/components/index.ts`
- `src/components/dashboard/index.ts`
- `src/components/PromptCard.css`
