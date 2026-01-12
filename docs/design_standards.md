# Premium Glass Design Standards

This document defines the strict UI standards for the "Premium Glass" theme. All new components, especially cards, MUST adhere to these specifications.

## Card Component Standard

Any container element representing a "Card" (e.g., Prompt Card, Cognitive Builder, Active Notes) must use the following CSS properties.

### 1. Base Structure
```css
.glass-card {
    /* Background: Deep dark blue with high opacity */
    background: rgba(30, 30, 50, 0.95);
    
    /* Border: Subtle white outline */
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    /* Radius: Consistent 16px */
    border-radius: 16px;
    
    /* Shadow: Deep, soft shadow for depth */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    /* Layout */
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}
```

### 2. Interaction State (Hover)
On hover, the card should "lift" and glow with the primary accent color (Orange #FF6B35 or Teal #4ECDC4).

```css
.glass-card:hover {
    /* Accent Border */
    border-color: rgba(255, 107, 53, 0.3);
    
    /* Lift & Glow */
    transform: translateY(-2px); /* Optional */
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.4), 
        0 0 20px rgba(255, 107, 53, 0.1);
}
```

### 3. The "Reflective" Shimmer
Every card must obtain the reflective shimmer animation using the `::before` pseudo-element.

```css
.glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%; /* Start off-screen */
    width: 100%;
    height: 100%;
    
    /* The Shine: Transparent -> White Tint -> Transparent */
    background: linear-gradient(
        90deg, 
        transparent, 
        rgba(255, 255, 255, 0.03), 
        transparent
    );
    
    transition: left 0.6s ease;
    pointer-events: none;
}

.glass-card:hover::before {
    left: 100%; /* Slide across on hover */
}
```

## Usage Rule
**"Save all of this in memory."** 
When creating **ANY** new card-like UI component:
1.  Copy the CSS properties exactly as above.
2.  Ensure `position: relative` and `overflow: hidden` are set on the parent to contain the reflection.
3.  Do not remove the border or shadow; they are critical for the "Glass" depth.
