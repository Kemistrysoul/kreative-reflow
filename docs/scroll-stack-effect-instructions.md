# Scroll Stack Effect Instructions

Use this document when you need to recreate the scroll-stacked card effect used in the homepage featured builds section. The goal is to make cards feel intentionally pinned, layered, and animated during scroll instead of simply sticking on top of each other.

## What The Effect Should Do

- A section contains a sticky intro column and a vertical stack of cards.
- On desktop, each card gets one viewport of scroll space.
- As the user scrolls, the active card pins in the viewport.
- The next card rises into place over the previous card.
- Older cards remain visible underneath, slightly shifted upward, scaled down, and rotated so the stacking feels deliberate.
- The incoming card must not land perfectly flush over the previous card. It should finish slightly lower and slightly inset, leaving a visible edge of the card below.
- On mobile, avoid the sticky stack. Render the cards as normal vertical content for readability.

## Required Tools

- React or Next.js component architecture.
- `motion/react` for `motion`, `useScroll`, `useTransform`, and `MotionValue`.
- A scroll container ref that tracks scroll progress for the card stack.

## DOM Structure

Use this structure:

```tsx
<section>
  <div className="grid lg:grid-cols-[intro_card-column]">
    <aside className="lg:sticky lg:top-0 lg:h-screen">
      Intro copy, metrics, CTA
    </aside>

    <div ref={stackRef} className="card-stack">
      {items.map((item, index) => (
        <StackedCard
          key={item.id}
          item={item}
          index={index}
          total={items.length}
          scrollYProgress={scrollYProgress}
          isDesktop={isDesktop}
        />
      ))}
    </div>
  </div>
</section>
```

Important details:

- Put the `ref` on the card column, not the whole page.
- Each card wrapper should be `sticky top-0` on desktop.
- Each card wrapper should have `min-height: 100vh` on desktop.
- Animate the inner card surface, not the sticky wrapper. The wrapper creates scroll space; the card surface handles scale, rotation, entry movement, and desktop inset.

## Scroll Progress Setup

Create one shared scroll progress value for the entire card stack:

```tsx
const stackRef = useRef<HTMLDivElement>(null);

const { scrollYProgress } = useScroll({
  target: stackRef,
  offset: ['start start', 'end end'],
});
```

This maps the start of the stack reaching the viewport top to `0`, and the end of the stack reaching the viewport end to `1`.

## Desktop Detection

The sticky animation should run only on desktop. Use a media query hook:

```tsx
function useIsDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 1024px)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDesktop;
}
```

On mobile, pass `undefined` for animated transforms and let the normal document flow handle the cards.

## Keyframe Formula

Use one keyframe point per card. If there are `N` cards, the normalized scroll points are:

```tsx
const lastIndex = Math.max(total - 1, 1);
const input = Array.from({ length: total }, (_, itemIndex) => itemIndex / lastIndex);
```

For card `index`, compute how much it should be pushed back as later cards arrive:

```tsx
const scale = input.map((_, itemIndex) => 1 - Math.max(0, itemIndex - index) * 0.045);
const rotate = input.map((_, itemIndex) => -Math.max(0, itemIndex - index) * 1.15);
```

Entry movement and layer visibility:

```tsx
const entryStart = index === 0 ? 0 : (index - 1) / lastIndex;
const entryEnd = index / lastIndex;

const yInput = index === 0 ? [0, 1] : [entryStart, entryEnd];
const yOutput =
  index === 0
    ? ['0px', `${-28 * Math.max(total - 1, 0)}px`]
    : ['18vh', `${index * 34}px`];

const desktopInset = index * 28;
```

Meaning:

- The first card starts already in place.
- The first card shifts up slightly as later cards arrive, creating a visible lower layer.
- Every later card begins slightly lower.
- As its scroll segment starts, it moves up into its pinned position.
- Later cards finish slightly lower than earlier cards and inset to the right.
- Cards underneath remain visible through scale, rotation, upward offset, and the incoming card's inset.

## Card Implementation

```tsx
import { motion, useTransform, type MotionValue } from 'motion/react';

type StackedCardProps = {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isDesktop: boolean;
};

function buildCardKeyframes(index: number, total: number) {
  const lastIndex = Math.max(total - 1, 1);
  const input = Array.from({ length: total }, (_, itemIndex) => itemIndex / lastIndex);
  const scale = input.map((_, itemIndex) => 1 - Math.max(0, itemIndex - index) * 0.045);
  const rotate = input.map((_, itemIndex) => -Math.max(0, itemIndex - index) * 1.15);
  const entryStart = index === 0 ? 0 : (index - 1) / lastIndex;
  const entryEnd = index / lastIndex;

  return {
    input,
    scale,
    rotate,
    yInput: index === 0 ? [0, 1] : [entryStart, entryEnd],
    yOutput:
      index === 0
        ? ['0px', `${-28 * Math.max(total - 1, 0)}px`]
        : ['18vh', `${index * 34}px`],
  };
}

function StackedCard({ index, total, scrollYProgress, isDesktop }: StackedCardProps) {
  const keyframes = buildCardKeyframes(index, total);
  const y = useTransform(scrollYProgress, keyframes.yInput, keyframes.yOutput);
  const scale = useTransform(scrollYProgress, keyframes.input, keyframes.scale);
  const rotate = useTransform(scrollYProgress, keyframes.input, keyframes.rotate);
  const desktopInset = index * 28;

  return (
    <motion.div
      className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-10"
      style={{ zIndex: 20 + index }}
    >
      <motion.article
        className="relative w-full overflow-hidden border bg-white shadow-xl"
        style={
          isDesktop
            ? {
                y,
                scale,
                rotate,
                width: `calc(100% - ${desktopInset}px)`,
                marginLeft: `${desktopInset}px`,
                transformOrigin: 'top center',
              }
            : undefined
        }
      >
        Card content
      </motion.article>
    </motion.div>
  );
}
```

## CSS And Layout Rules

Use these rules for reliable behavior:

- The stack column must not have `overflow: hidden` on an ancestor that would clip sticky behavior.
- The page may use `overflow-x: clip`, but avoid `overflow-y: hidden` on parents.
- The sticky wrapper should have `min-height: 100vh` so every card has scroll runway.
- Keep `top: 0` on the sticky wrapper unless there is a fixed header that must be avoided.
- Use `zIndex: base + index` so later cards sit above earlier cards.
- Keep the animated card inside the sticky wrapper. Do not apply scale and rotate to the wrapper itself if the layout starts jumping.
- Add a small desktop inset to later cards, for example `width: calc(100% - ${index * 28}px)` and `marginLeft: ${index * 28}px`, so earlier cards remain visible.
- Give later cards a positive final `y` offset, for example `${index * 34}px`, so they do not fully cover the layer beneath.
- Shift the first card upward as later cards arrive, for example `-28px` per later card, to create a clear visible stack rim.
- Add bottom padding to the stack column, usually `lg:pb-[18vh]` to `lg:pb-[30vh]`, so the last card has room to release.

## Tailwind Pattern

The section can use this shape:

```tsx
<section className="relative w-full overflow-x-clip py-20 md:py-28 lg:py-36">
  <div className="content-gutter relative z-10">
    <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:self-start lg:py-24">
        Intro content
      </div>

      <div ref={stackRef} className="space-y-8 lg:space-y-0 lg:pb-[18vh]">
        Cards
      </div>
    </div>
  </div>
</section>
```

## Common Bugs

### Cards stick on top of each other with no animation

Cause: Each card is sticky, but there is no shared scroll progress driving the stack.

Fix: Add a `stackRef`, call `useScroll`, and use `useTransform` for `y`, `scale`, and `rotate`.

### Sticky cards do not stick

Cause: A parent has `overflow: hidden`, `overflow-y: hidden`, or a transform that creates a containing block.

Fix: Remove vertical overflow clipping from ancestors. Use `overflow-x: clip` only if horizontal clipping is needed.

### Cards jump or resize while scrolling

Cause: Transform is applied to the sticky wrapper instead of the card surface, or card content has unstable dimensions.

Fix: Keep the sticky wrapper stable and animate only the inner `article`. Give media areas fixed heights or aspect ratios.

### Top card completely hides the card underneath

Cause: The incoming card finishes at the same `y`, width, and horizontal position as the previous card.

Fix: Give incoming cards a small final y offset and desktop inset. Also shift older cards upward while scaling them down. This creates a visible layer edge instead of a perfect cover.

### Last card disappears too quickly

Cause: The stack has no bottom runway.

Fix: Add desktop bottom padding to the stack column, for example `lg:pb-[24vh]`.

### Mobile feels cramped

Cause: Sticky animation is running on small screens.

Fix: Disable transform styles below `1024px` and let cards render in normal document flow.

## Verification Checklist

- Desktop: the intro column remains pinned while the cards scroll.
- Desktop: each card gets about one viewport of attention.
- Desktop: later cards layer over earlier cards.
- Desktop: earlier cards remain partially visible through scale, rotation, upward offset, and the incoming card inset.
- Desktop: the top card does not fully hide the bottom card when the stack settles.
- Mobile: cards appear as ordinary stacked content with no sticky overlap.
- The section can be entered and exited naturally; the last card does not trap the user.
- No parent container clips the sticky cards vertically.
- Lint passes after implementation.
