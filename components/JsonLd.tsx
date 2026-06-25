type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  // The JSON-LD is wrapped in a hidden container rendered via innerHTML rather
  // than a React-managed <script> element. React 19 warns ("scripts inside
  // React components are never executed when rendering on the client") whenever
  // it mounts a raw <script> during a client-side navigation. JSON-LD is data,
  // not executable code, so rendering it as inert markup keeps it in the DOM
  // for crawlers without tripping that warning on every SPA transition.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <div
      hidden
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `<script type="application/ld+json">${json}</script>`,
      }}
    />
  );
}
