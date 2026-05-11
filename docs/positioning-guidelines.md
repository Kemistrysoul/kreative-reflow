# Positioning & Gutter Guidelines

This document outlines the standard horizontal positioning for text content across the Kreative Reflow website to ensure a consistent brutalist aesthetic and safe clearance from fixed UI elements (Social Links, Contact Button, and Gutters).

## 1. The Gutter System
The layout uses a global `content-gutter` utility (defined in `globals.css`) which protects the outer edges of the screen where fixed UI elements live.

- **Desktop (Large Screens):**
  - Left Gutter: `88px` (Protected zone for Theme Toggle & Search)
  - Right Gutter: `64px` (Protected zone for Vertical Social Links)
- **Safe Clearance:** To maintain a premium, airy feel and avoid "cluttering" the UI elements, content should not touch the gutter edges.

## 2. Right-Aligned Text (The "Perfect" Offset)
For sections where text is pushed to the right side (like the `ScrollRevealStatement`), use the following offset logic to achieve the **116px** edge distance:

- **Logic:** `ml-auto` + `text-right` + `Right Margin Offset`.
- **Tailwind Classes:** `ml-auto mr-5 lg:mr-[3.25rem] text-right`
- **Breakdown (Large Screens):**
  - `64px` (Right Gutter) + `52px` (3.25rem Margin) = **116px from screen edge**.
- **Usage Example:**
  ```tsx
  <div className="content-gutter">
    <div className="max-w-2xl ml-auto mr-5 lg:mr-[3.25rem] text-right">
      {/* Content goes here */}
    </div>
  </div>
  ```

## 3. Left-Aligned Text
For sections where text is on the left side, we mirror the offset to maintain balance.

- **Logic:** `mr-auto` + `text-left` + `Left Margin Offset`.
- **Tailwind Classes:** `mr-auto ml-5 lg:ml-[3.25rem] text-left`
- **Breakdown (Large Screens):**
  - `88px` (Left Gutter) + `52px` (3.25rem Margin) = **140px from screen edge**.
- **Usage Example:**
  ```tsx
  <div className="content-gutter">
    <div className="max-w-2xl mr-auto ml-5 lg:ml-[3.25rem] text-left">
      {/* Content goes here */}
    </div>
  </div>
  ```

## 4. No Offset Alignment
For sections that align directly at the gutter edge (no extra margin):

- **Tailwind Classes:** `ml-0 lg:ml-0` (left) or `mr-0 lg:mr-0` (right)
- **Usage:** Use when content should sit flush against the gutter edge
- **Example:**
  ```tsx
  <div className="content-gutter">
    <div className="max-w-2xl mr-auto ml-0 lg:ml-0">
      {/* Content goes here */}
    </div>
  </div>
  ```

## 5. Summary Table

| Alignment | Offset Type | Gutter | Additional Margin | Total Edge Offset (LG) |
| :--- | :--- | :--- | :--- | :--- |
| **Right** | Perfect | 64px | 52px (`mr-[3.25rem]`) | **116px** |
| **Left** | Perfect | 88px | 52px (`ml-[3.25rem]`) | **140px** |
| **Right** | No Offset | 64px | 0px | **64px** |
| **Left** | No Offset | 88px | 0px | **88px** |

---

## AI Prompt for Positioning
Use the following prompt when asking an LLM to position text content in this project:

> "Position this text block on the [RIGHT/LEFT] side. Choose the appropriate offset from the guidelines: [PERFECT OFFSET/NO OFFSET]. Wrap the content in a container with `content-gutter`. For RIGHT perfect offset, use `ml-auto text-right mr-5 lg:mr-[3.25rem]`. For left perfect offset, use `mr-auto text-left ml-5 lg:ml-[3.25rem]`. For right no offset, use `ml-auto text-right mr-0 lg:mr-0`. For left no offset, use `mr-auto text-left ml-0 lg:ml-0`. Ensure the text does not feel cramped against the social media links or the gutter."
