import Image from 'next/image';

// Shared author bio shown at the end of every insights article.
export function AuthorBio() {
  return (
    <section className="border-t border-[#151419]/12 py-12 dark:border-[#FBFBFB]/12">
      <h2 className="font-playfair text-[clamp(2.35rem,5vw,4.9rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
        About the author
      </h2>
      <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-9">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-[#151419]/10 bg-[#F0EFED] shadow-[0_16px_40px_rgba(21,20,25,0.12)] dark:border-[#FBFBFB]/12 sm:h-32 sm:w-32">
          <Image
            src="/images/disele-founder-casual.webp"
            alt="Disele, Founder of Kreative Reflow"
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
        <p className="font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
          Disele is the founder of Kreative Reflow, a Johannesburg-based technology studio specializing in web development, SaaS products, and business automation. With seven years of experience in medical sales and neurology, Disele works with medical practices, engineering firms, and service businesses across South Africa and internationally.{' '}
          <a
            href="https://www.linkedin.com/company/kreativereflow"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#FC6E20] underline-offset-4"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </section>
  );
}
