# Errors and Solutions Log

## Error 1: Hero title overflow and messy wrapping
- File: app/page.tsx
- Symptom: "Your business deserves" line breaking unexpectedly on small screens like 320px because the font size was too large.
- Root cause: `text-5xl` sets `font-size` to 48px, which forces words to wrap excessively or overflow horizontal limits.
- Solution applied: Set responsive classes `text-4xl sm:text-5xl` to provide a smaller base font for <640px, paired with optimized line-height `leading-[1.1]`.
- Tested on: 320px, 375px, 414px, 768px

## Error 2: Missing Full-Width Buttons for Mobile
- File: app/page.tsx
- Symptom: "View Selected Work" button did not span full width on small screens and tap target wasn't explicitly guaranteed to be 44px.
- Root cause: Missing `w-full` class and `min-h-[44px]`.
- Solution applied: Appended `w-full sm:w-auto` and `min-h-[44px]` to the buttons, ensuring full mobile width and a minimum touch target.
- Tested on: 320px, 375px

## Error 3: Accordion Title Alignment and ID Formatting
- File: components/ui/accordion-05.tsx
- Symptom: Accordion titles were center-aligned but positioned next to a left-aligned number text, creating inconsistent wrapping and visual overlaps. Numbers were simple digits ("1" instead of "01"). Padding of content was misaligned on 320px.
- Root cause: Arbitrary usage of `text-center` and hardcoded padding `pl-6` which did not account for number widths.
- Solution applied: Shift title to `text-left`, scale title down slightly for mobile `text-2xl sm:text-3xl`, update IDs to numeric strings `01`, `02`, and accurately align the AccordionContent using `pl-[2.25rem] sm:pl-14 md:pl-24`.
- Tested on: 320px, 375px, 414px

## Error 4: Potential Horizontal Scroll Issue
- File: app/page.tsx
- Symptom: Animations and absolute elements could occasionally trigger a horizontal scrollbar.
- Root cause: Missing root wrapper constraints for overflow.
- Solution applied: Appended `overflow-x-hidden` on main div to strictly prevent sideways scrolling on all viewports.
- Tested on: 320px, 768px, 1024px
