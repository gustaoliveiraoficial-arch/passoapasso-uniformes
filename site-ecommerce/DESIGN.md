# Design System Document: The Scholastic Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Academic"**
The design system moves away from the "industrial" feel of traditional e-commerce and adopts an "Editorial Trust" aesthetic. It treats school uniforms not as commodities, but as the foundation of a child's educational journey. By utilizing high-contrast typography, expansive whitespace, and sophisticated tonal layering, we create an environment that feels organized, premium, and authoritative yet deeply family-friendly.

The layout breaks the "template" look through **intentional asymmetry**. Product images should bleed off containers, and typography should overlap subtle color blocks to create a sense of depth and custom craftsmanship.

---

## 2. Colors & Surface Architecture

### The "No-Line" Rule
We do not use 1px solid borders to define sections. To maintain a premium, editorial feel, boundaries are defined exclusively through background shifts. A section might transition from `surface` to `surface-container-low` to signal a change in context without the visual "noise" of a line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
*   **Base Layer:** `surface` (#f9f9f9) for the overall page.
*   **Content Sections:** `surface-container-low` (#f3f3f3) for secondary content areas.
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide the highest contrast against the page.

### The "Glass & Gradient" Rule
To elevate the Navy blue beyond a flat corporate color:
*   **Signature Gradients:** Use a subtle linear gradient on primary CTAs and Hero backgrounds: `primary` (#000666) to `primary_container` (#1a237e). This adds "soul" and a sense of quality.
*   **Glassmorphism:** Floating elements (like the navigation bar or mobile WhatsApp button) should use `surface` at 80% opacity with a `backdrop-filter: blur(12px)`.

---

## 3. Typography
The typography system uses a pairing of **Manrope** for structure/impact and **Plus Jakarta Sans** for readability and warmth.

*   **Display (Manrope):** Large, bold headlines used for hero sections. The wide letterforms of Manrope convey the "Trustworthy" pillar.
*   **Headline (Manrope):** Used for category titles. High-contrast sizing creates an editorial hierarchy.
*   **Body (Plus Jakarta Sans):** A modern, friendly sans-serif that ensures long-form text (like sizing guides) remains legible and approachable for parents.
*   **Labels (Plus Jakarta Sans):** Used for technical specs (e.g., "60% Cotton").

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. Place a `surface-container-lowest` card on top of a `surface-container` background to create a soft, natural lift.

### Ambient Shadows
Avoid harsh, dark shadows. If a component must float:
*   **Color:** Use a tinted shadow: `rgba(26, 28, 28, 0.06)`.
*   **Spread:** High blur (20px to 40px) with low opacity. This mimics natural ambient light in a bright room.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input fields), use the `outline_variant` (#c6c5d4) at **20% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Navigation (The Clean Header)
*   **Style:** `surface_container_lowest` with a 20% opacity `outline_variant` bottom-stroke.
*   **Interaction:** Links use `primary` color; active states use a 4px `tertiary_fixed` (#ffdbcb) underline offset by 8px to maintain "breathing room."

### Product Cards (The Canvas)
*   **Style:** No borders. Use `surface_container_low` as the card background to make the white school uniforms "pop."
*   **Image Treatment:** Use `rounded-xl` (1.5rem) for product images to soften the aesthetic.
*   **Spacing:** Enforce a strict "No-Divider" rule. Separate price, title, and "Add to Cart" using vertical whitespace (1.5rem).

### Primary Buttons (The Call to Action)
*   **Background:** `tertiary_container` (#542000) or a gradient of the orange accent.
*   **Text:** `on_tertiary_container` (#fa6d00) for high-contrast visibility.
*   **Shape:** `rounded-md` (0.75rem) for a modern, approachable feel.

### WhatsApp Integration (The Lifeline)
*   **Visual:** A floating action button (FAB) using a `glassmorphism` effect. 
*   **Position:** Bottom-right, utilizing a `surface_container_lowest` container with a vibrant green accent icon, surrounded by an ambient shadow to ensure it feels "raised" above the content.

### Input Fields
*   **Style:** Filled style using `surface_container_high`. 
*   **States:** On focus, the background shifts to `surface_container_lowest` with a 2px `primary` bottom-bar.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Allow product images to overlap the edge of their containers slightly.
*   **Embrace Whitespace:** If a section feels crowded, increase the padding; never add a divider line.
*   **Layer Tones:** Put white cards on light grey backgrounds to create soft hierarchy.

### Don't:
*   **Don't use 1px black/grey borders.** This makes the brand look "cheap" and "templated."
*   **Don't use pure black text.** Always use `on_surface` (#1a1c1c) for a softer, more premium reading experience.
*   **Don't crowd the WhatsApp button.** Ensure it has at least 24px of clearance from any other UI element to maintain its importance.