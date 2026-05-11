# Responsive Changelog
Date: 2026-04-13

## File: app/page.tsx
- Change: Adjusted heading 1 sizes and leading to `text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] sm:leading-[0.95]`.
- Reason: Ensure "Your business deserves" fits without unintended wrapping/overflow on very small screens, while maintaining appropriate size on 375px.
- Breakpoint: 320px / 375px
- Before: `text-5xl` for all sizes beneath `md:`, leading to overflow on 320px.
- After: `text-4xl` for mobile < 640px, scaling up to `text-5xl` on `sm:` breakpoints properly resolving line length problems.

## File: app/page.tsx
- Change: Prevented horizontal overflow on main container by adding `overflow-x-hidden` and `w-full overflow-hidden`.
- Reason: Prevent horizontal scrollbar on mobile caused by some offset elements.
- Breakpoint: All mobile devices.
- Before: Missing strict overflow clipping on main and layout wrappers.
- After: Added `overflow-x-hidden` to outer layout elements.

## File: app/page.tsx
- Change: Modified padding and button sizes in Hero section to `px-4 sm:px-6` and added `w-full sm:w-auto` to the "View Selected Work" button.
- Reason: Buttons needed to fill the screen width on mobile and guarantee a minimum 44px tap target height for accessibility.
- Breakpoint: 320px / 375px
- Before: Secondary button was not full width on mobile, lacking explicit tap target height validation.
- After: Added `w-full sm:w-auto` and `min-h-[44px]` for both buttons.

## File: components/ui/accordion-05.tsx
- Change: Added padding container classes `px-4 sm:px-0`, aligned numbers, adjusted `text-center` to `text-left`, text-sizes from `text-3xl` to `text-2xl sm:text-3xl`. Fixed `id` property from `"1"` to `"01"`. Added responsive padding for accordion content `pl-[2.25rem] sm:pl-14 md:pl-24`.
- Reason: Fix improper text wrapping and center-alignment conflicts. Make sure numbers 01-05 correctly align with the content structure and ensure proper padding of answers. Ensure proper interaction target sizes.
- Breakpoint: 320px / 375px
- Before: `text-3xl` with `text-center` on questions causing overlap with numbers. IDs were 1, 2, not padded.
- After: `text-left` with `text-2xl sm:text-3xl`, properly indented answers to match number alignment. `id` formatted as `01`. `min-h-[44px]` layout enforced on trigger.
