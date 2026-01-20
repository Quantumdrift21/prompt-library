# Settings Page Specification & Guide

## 1. Information Architecture
### Categories
*   **Account**: Profile (Avatar, Name), Authentication.
*   **Preferences**: Display (Theme), Language.
*   **Privacy**: Data collection settings.
*   **Security**: Password, 2FA.
*   **Notifications**: Alert types.
*   **Advanced**: Developer options, Export.

## 2. Navigation
*   **Desktop**: Sidebar + Content Area.
*   **Mobile**: Accordion or reduced sidebar.

## 3. Interaction Patterns
*   **Auto-save**: Debounced saving for preferences (1000ms).
*   **Manual Save**: For critical info (Account/Password).
*   **Validation**: Inline regex validation.
*   **Feedback**: Toast notifications on save.

## 4. Visuals
*   **Theme**: Dark Glass / Light Glass (match `index.css`).
*   **Hierarchy**: H1 for Page, H2 for Section, H3 for grouping.

## 5. Technical Implementation
*   **State**: Local cache + API sync (Supabase).
*   **Accessibility**: WCAG 2.1 AA (Aria labels, focus states).
