# Logo Animation Replacement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the problematic MP4 video animation with a Lottie-based animation that eliminates the black flash glitch and can be reused across the web app.

**Architecture:** The current MP4 video has inherent issues with black intro frames. We will convert the animation to Lottie (JSON-based vector animation) which offers:
- No black frame issues (vector-based, instant render)
- Smaller file size than MP4
- Resolution-independent (scales perfectly)
- Interactivity support (pause, play, loop, respond to events)
- Reusable as a React component across the app

**Tech Stack:**
- `lottie-react` - React wrapper for Lottie animations
- After Effects + Bodymovin plugin (for creating Lottie from the original animation source)
- OR: Online Lottie editor/converter if source files unavailable

---

## Current State Analysis

**Existing Video Files:**
- `/public/Logo.mp4` - 1.0 MB (original)
- `/public/Logo_final.mp4` - 400 KB (currently used)
- `/public/Logo_optimized.mp4` - 154 KB (smallest)
- `/public/Logo_trimmed.mp4` - 431 KB

**The Problem:**
The MP4 video has black frames at the beginning (~0-0.5s). Even with JavaScript seeking past these frames, there's a race condition where the browser may render a black frame before the seek completes.

**The Solution:**
Replace MP4 with Lottie animation which renders instantly without any black frames.

---

## Task 1: Analyze Original Animation Content

**Files:**
- Inspect: `/public/Logo_final.mp4`

**Step 1: Document what the animation shows**

The animation displays:
- "PROMPT" text with an animated reveal/glow effect
- "LIBRARY" text below it
- The animation uses `mix-blend-mode: screen` to blend with the dark background

**Step 2: Determine animation specifications**

Run this in browser console to get video details:
```javascript
const v = document.querySelector('.hero-video');
console.log({
  duration: v.duration,
  width: v.videoWidth,
  height: v.videoHeight
});
```

Expected output: Duration ~7s, dimensions 1920x1080 or similar.

---

## Task 2: Create or Obtain Lottie Animation

**Option A: If you have After Effects source file (.aep)**

**Step 1: Export using Bodymovin plugin**
1. Install Bodymovin extension in After Effects
2. Open the original logo animation project
3. Window → Extensions → Bodymovin
4. Configure export settings:
   - Check "Standard" export
   - Enable "Include assets" if using images
5. Export to `/public/logo-animation.json`

**Option B: If no source file (use CSS animation instead)**

If the original After Effects project is unavailable, create a CSS/React recreation:

**Step 1: Create CSS animation component**

Create: `src/components/common/LogoAnimation.tsx`

```tsx
import { useState, useEffect } from 'react';
import './LogoAnimation.css';

interface LogoAnimationProps {
    size?: 'small' | 'medium' | 'large';
    onComplete?: () => void;
}

/**
 * LogoAnimation - Animated "PROMPT LIBRARY" logo using CSS animations.
 * Replaces the MP4 video to eliminate black frame glitches.
 */
export const LogoAnimation = ({ size = 'large', onComplete }: LogoAnimationProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        requestAnimationFrame(() => setIsVisible(true));
        
        // Call onComplete after animation finishes
        const timeout = setTimeout(() => {
            onComplete?.();
        }, 2500); // Animation duration
        
        return () => clearTimeout(timeout);
    }, [onComplete]);

    return (
        <div className={`logo-animation logo-animation--${size} ${isVisible ? 'logo-animation--visible' : ''}`}>
            <div className="logo-animation__text logo-animation__text--prompt">
                {'PROMPT'.split('').map((char, i) => (
                    <span 
                        key={i} 
                        className="logo-animation__char"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </div>
            <div className="logo-animation__text logo-animation__text--library">
                {'LIBRARY'.split('').map((char, i) => (
                    <span 
                        key={i} 
                        className="logo-animation__char"
                        style={{ animationDelay: `${0.6 + i * 0.08}s` }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
};
```

**Step 2: Create CSS styles**

Create: `src/components/common/LogoAnimation.css`

```css
/* ==================================
   Logo Animation Styles
   ================================== */

@keyframes charReveal {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.8);
        filter: blur(10px);
    }
    50% {
        opacity: 1;
        transform: translateY(-5px) scale(1.05);
        filter: blur(0);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

@keyframes glowPulse {
    0%, 100% {
        text-shadow: 
            0 0 10px rgba(255, 107, 53, 0.5),
            0 0 20px rgba(255, 107, 53, 0.3),
            0 0 30px rgba(255, 107, 53, 0.2);
    }
    50% {
        text-shadow: 
            0 0 20px rgba(255, 107, 53, 0.8),
            0 0 40px rgba(255, 107, 53, 0.5),
            0 0 60px rgba(255, 107, 53, 0.3);
    }
}

.logo-animation {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    font-family: var(--font-sans), -apple-system, sans-serif;
    font-weight: 800;
    letter-spacing: 0.05em;
}

/* Size variants */
.logo-animation--small {
    font-size: 1.5rem;
}

.logo-animation--medium {
    font-size: 2.5rem;
}

.logo-animation--large {
    font-size: 4rem;
}

.logo-animation__text {
    display: flex;
}

.logo-animation__text--prompt {
    background: linear-gradient(90deg, var(--color-accent-orange), #ff8f5a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.logo-animation__text--library {
    font-size: 0.6em;
    letter-spacing: 0.3em;
    color: var(--color-text-muted);
    margin-left: 0.1em;
}

.logo-animation__char {
    display: inline-block;
    opacity: 0;
}

.logo-animation--visible .logo-animation__char {
    animation: charReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.logo-animation--visible .logo-animation__text--prompt {
    animation: glowPulse 2s ease-in-out infinite;
    animation-delay: 1s;
}

/* Responsive */
@media (max-width: 768px) {
    .logo-animation--large {
        font-size: 2.5rem;
    }
}
```

**Step 3: Write test for LogoAnimation component**

Create: `src/components/common/__tests__/LogoAnimation.test.tsx`

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LogoAnimation } from '../LogoAnimation';

describe('LogoAnimation', () => {
    it('renders PROMPT and LIBRARY text', () => {
        render(<LogoAnimation />);
        expect(screen.getByText('P')).toBeInTheDocument();
        expect(screen.getByText('R')).toBeInTheDocument();
        expect(screen.getByText('O')).toBeInTheDocument();
        expect(screen.getByText('M')).toBeInTheDocument();
        // LIBRARY
        expect(screen.getAllByText('L').length).toBeGreaterThanOrEqual(1);
    });

    it('applies size variant class', () => {
        const { container } = render(<LogoAnimation size="small" />);
        expect(container.querySelector('.logo-animation--small')).toBeInTheDocument();
    });

    it('calls onComplete after animation', async () => {
        const onComplete = vi.fn();
        render(<LogoAnimation onComplete={onComplete} />);
        
        await waitFor(() => {
            expect(onComplete).toHaveBeenCalled();
        }, { timeout: 3000 });
    });
});
```

**Step 4: Run tests**

```bash
npm run test -- src/components/common/__tests__/LogoAnimation.test.tsx
```

Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/components/common/LogoAnimation.tsx src/components/common/LogoAnimation.css src/components/common/__tests__/LogoAnimation.test.tsx
git commit -m "feat: add LogoAnimation component with CSS animations"
```

---

## Task 3: Integrate LogoAnimation into LandingPage

**Files:**
- Modify: `src/pages/LandingPage.tsx`
- Modify: `src/pages/LandingPage.css`

**Step 1: Replace video element with LogoAnimation**

Modify: `src/pages/LandingPage.tsx`

```tsx
// Add import at top
import { LogoAnimation } from '../components/common/LogoAnimation';

// Remove video-related state and handlers:
// - Remove: const videoRef = useRef<HTMLVideoElement>(null);
// - Remove: const [isVideoLoaded, setIsVideoLoaded] = useState(false);
// - Remove: handleVideoCanPlayThrough and handleVideoSeeked functions

// Replace the video element in JSX:
<div className="hero-video-container">
    <LogoAnimation size="large" />
</div>
```

**Step 2: Update CSS for new component**

Modify: `src/pages/LandingPage.css`

Remove or comment out the `.hero-video` styles (lines 233-254) since we no longer use a video element.

Keep the `.hero-video-container` styles for layout purposes.

**Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 4: Verify in browser**

```bash
npm run dev
```

Navigate to http://localhost:5173/landing and verify:
- Logo animation plays smoothly
- No black flash
- Animation timing feels natural

**Step 5: Commit**

```bash
git add src/pages/LandingPage.tsx src/pages/LandingPage.css
git commit -m "feat: replace video with CSS LogoAnimation component"
```

---

## Task 4: Update LandingPage Tests

**Files:**
- Modify: `src/pages/__tests__/LandingPage.test.tsx`

**Step 1: Update test to expect LogoAnimation instead of video**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../LandingPage';

describe('LandingPage', () => {
    const renderWithRouter = (component: React.ReactNode) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    test('renders hero section with logo animation', () => {
        renderWithRouter(<LandingPage />);
        // Check for PROMPT text (split into chars)
        expect(screen.getByText('P')).toBeInTheDocument();
    });

    test('renders navigation links', () => {
        renderWithRouter(<LandingPage />);
        expect(screen.getByText('Discover')).toBeInTheDocument();
        expect(screen.getByText('Features')).toBeInTheDocument();
    });

    test('renders sign up button', () => {
        renderWithRouter(<LandingPage />);
        expect(screen.getByText('Sign Up Free')).toBeInTheDocument();
    });
});
```

**Step 2: Run tests**

```bash
npm run test -- src/pages/__tests__/LandingPage.test.tsx
```

Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/pages/__tests__/LandingPage.test.tsx
git commit -m "test: update LandingPage tests for LogoAnimation"
```

---

## Task 5: Create Reusable LogoAnimation Export

**Files:**
- Create: `src/components/common/index.ts`

**Step 1: Create barrel export**

```typescript
export { LogoAnimation } from './LogoAnimation';
```

**Step 2: Commit**

```bash
git add src/components/common/index.ts
git commit -m "feat: add barrel export for common components"
```

---

## Task 6: Clean Up Old Video Files (Optional)

**Files:**
- Delete: `public/Logo.mp4`
- Delete: `public/Logo_final.mp4`
- Delete: `public/Logo_optimized.mp4`
- Delete: `public/Logo_trimmed.mp4`

**Step 1: Verify no other references to video files**

```bash
grep -r "Logo.*mp4" src/
```

Expected: No results (all video references removed).

**Step 2: Delete video files**

```bash
rm public/Logo.mp4 public/Logo_final.mp4 public/Logo_optimized.mp4 public/Logo_trimmed.mp4
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused video files"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Logo animation plays without any black flash
- [ ] Animation is smooth and matches the original intent
- [ ] Animation works on mobile (responsive)
- [ ] No console errors
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Logo can be reused elsewhere: `<LogoAnimation size="small" />`

---

## Alternative: Lottie Implementation

If you have access to the original After Effects source or can create a Lottie file:

**Step 1: Install lottie-react**

```bash
npm install lottie-react
```

**Step 2: Place the Lottie JSON file**

Copy `logo-animation.json` to `public/animations/logo-animation.json`

**Step 3: Create LottieLogoAnimation component**

```tsx
import Lottie from 'lottie-react';
import logoAnimation from '../../assets/logo-animation.json';

export const LottieLogoAnimation = () => {
    return (
        <Lottie 
            animationData={logoAnimation}
            loop={false}
            style={{ width: 300, height: 'auto' }}
        />
    );
};
```

This approach offers better animation fidelity if the original source is available.
