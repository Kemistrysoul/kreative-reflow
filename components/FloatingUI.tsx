'use client';

import { useMemo, useState, useEffect } from 'react';
import { Plus, X, MoonIcon, SunIcon, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';

const searchPages = [
  { title: 'Services', href: '/services', description: 'All offers and the service stack.' },
  { title: 'Web Design & Development', href: '/services/web-design', description: 'Custom websites built for leads, trust, and speed.' },
  { title: 'SaaS & Custom Web Applications', href: '/services/saas-development', description: 'Portals, dashboards, booking systems, and custom tools.' },
  { title: 'Local & AI SEO', href: '/services/seo', description: 'Search visibility, maps, structured content, and AI readiness.' },
  { title: 'AI & Business Automation', href: '/services/automation', description: 'Workflow automation for repetitive business tasks.' },
  { title: 'Business & Tech Consulting', href: '/services/consulting', description: 'Systems audits, roadmaps, and build clarity.' },
  { title: 'Maintenance & Support', href: '/services/maintenance', description: 'Ongoing care, updates, fixes, and improvements.' },
  { title: 'Work', href: '/work', description: 'Project directions and selected work categories.' },
  { title: 'Tools', href: '/tools', description: 'Interactive scorecards and lead magnets.' },
  { title: 'Website Lead Leak Scorecard', href: '/tools/website-lead-leak-scorecard', description: 'Find where a website is losing leads before rebuilding.' },
  { title: 'Local Visibility Scorecard', href: '/tools/local-visibility-scorecard', description: 'Check Google Maps, reviews, directories, and local SEO visibility.' },
  { title: 'Lead Response Leak Calculator', href: '/tools/lead-response-leak-calculator', description: 'Calculate monthly revenue lost to slow lead response.' },
  { title: 'Website Rebuild vs Refresh Quiz', href: '/tools/website-rebuild-vs-refresh-quiz', description: 'Decide whether to rebuild, refresh, or optimize a website.' },
  { title: 'Insights', href: '/insights', description: 'Notes on websites, visibility, automation, and digital infrastructure.' },
  { title: 'About', href: '/about', description: 'The founder-led studio story and principles.' },
  { title: 'FAQ', href: '/faq', description: 'Answers about process, ownership, support, and timelines.' },
  { title: 'Privacy Policy', href: '/privacy', description: 'How website, tool, and enquiry data is handled.' },
  { title: 'Terms of Service', href: '/terms', description: 'The terms for website use, tools, enquiries, and services.' },
  { title: 'Contact', href: '/contact', description: 'Start a project conversation.' },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/kreativereflow' },
  { label: 'Instagram', href: 'https://www.instagram.com/kreativereflow' },
  { label: 'Facebook', href: 'https://www.facebook.com/KreativeReflow' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@kreativereflow' },
];

function ThemeToggleThumb({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <span
      className="absolute left-[2px] h-[16px] w-[16px] rounded-full shadow-md transition-all duration-300"
      style={{
        top: isDarkMode ? '22px' : '2px',
        backgroundColor: isDarkMode ? '#FBFBFB' : '#FC6E20',
      }}
    />
  );
}

export default function FloatingUI() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return searchPages.slice(0, 6);

    return searchPages.filter((page) => {
      const haystack = `${page.title} ${page.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery]);

  useEffect(() => {
    const syncThemeState = () => {
      const nextIsDark =
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark';

      setIsDarkMode((current) => (current === nextIsDark ? current : nextIsDark));
    };

    const frame = window.requestAnimationFrame(syncThemeState);
    const observer = new MutationObserver(syncThemeState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    window.addEventListener('storage', syncThemeState);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('storage', syncThemeState);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <>
      {/* Logo image — separate fixed element, no blend, stays orange */}
      <div className="fixed left-8 top-8 z-50 pointer-events-auto">
        <Link href="/" className="block">
          <img src="/images/kr_logo_orange.png" alt="Kreative Reflow" className="h-16 w-auto" />
        </Link>
      </div>

      {/* Wordmark — separate fixed element so mix-blend-difference blends against the page */}
      <div className="fixed left-8 z-50 mix-blend-difference text-white pointer-events-auto" style={{ top: '101.5px' }}>
        <Link href="/" className="flex gap-0">
          <span
            className="text-[0.8rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-playfair)', writingMode: 'vertical-rl', textOrientation: 'sideways', transform: 'rotate(180deg)' }}
          >
            Kreative
          </span>
          <span
            className="text-[0.8rem] font-bold uppercase whitespace-nowrap"
            style={{ fontFamily: 'var(--font-playfair)', writingMode: 'vertical-rl', textOrientation: 'sideways', transform: 'rotate(180deg)', letterSpacing: '0.4em', lineHeight: '0.9' }}
          >
            Reflow
          </span>
        </Link>
      </div>

      {/* Fixed UI Elements */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-difference text-white">
        {/* Top Right — Contact + Menu */}
        <div className="absolute top-8 right-8 flex items-center gap-4 pointer-events-auto">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold uppercase tracking-tight font-montserrat text-black bg-white rounded-full hover:bg-gray-200 transition-colors duration-300"
          >
            Contact
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="w-14 h-14 rounded-full flex flex-col items-center justify-center transition-colors hover:bg-white/10"
          >
            <MenuToggleIcon open={isMenuOpen} className="w-8 h-8" duration={500} />
          </button>
        </div>

        {/* Left Center — Theme Toggle */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto max-[800px]:bottom-8 max-[800px]:left-auto max-[800px]:right-5 max-[800px]:top-auto max-[800px]:translate-y-0">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setIsDarkMode(false)}
              className="transition-opacity duration-300"
              style={{ opacity: isDarkMode ? 0.3 : 1 }}
              aria-label="Light mode"
            >
              <SunIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative w-5 h-10 rounded-full transition-colors duration-300 mix-blend-normal"
              style={{ backgroundColor: isDarkMode ? '#FC6E20' : '#666' }}
              aria-label="Toggle theme"
            >
              <ThemeToggleThumb isDarkMode={isDarkMode} />
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className="transition-opacity duration-300"
              style={{ opacity: isDarkMode ? 1 : 0.3 }}
              aria-label="Dark mode"
            >
              <MoonIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Left — Search */}
        <div className="absolute bottom-8 left-8 pointer-events-auto">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className="w-11 h-11 rounded-full flex items-center justify-center border border-white/30 hover:bg-white/10 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Right Center — Social Links (lg+) */}
        <nav
          aria-label="Social links"
          className="absolute right-10 top-1/2 hidden h-64 w-8 -translate-y-1/2 items-center justify-center pointer-events-auto lg:flex"
        >
          <div className="flex rotate-90 items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-widest">
            <span>Follow Us -</span>
            {socialLinks.map((link, index) => (
              <span key={link.label} className="inline-flex items-center gap-2">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-[#FC6E20]"
                >
                  {link.label}
                </a>
                {index < socialLinks.length - 1 ? <span aria-hidden="true">/</span> : null}
              </span>
            ))}
          </div>
        </nav>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#111111] text-white flex flex-col justify-between p-8 md:p-16 overflow-hidden"
          >
            <div className="h-24" />

            {/* Main Navigation */}
            <div className="flex-grow flex flex-col justify-center w-full relative z-10 pl-8 md:pl-24">
              <div className="flex flex-col w-full max-w-xl group/navlist">
                {[
                  { num: '01', label: 'Services', href: '/services', expandable: true },
                  { num: '02', label: 'Work', href: '/work' },
                  { num: '03', label: 'Tools', href: '/tools' },
                  { num: '04', label: 'Insights', href: '/insights' },
                  { num: '05', label: 'About', href: '/about' },
                  { num: '06', label: "Let's Talk", href: '/contact' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group"
                  >
                    <div className="flex flex-col">
                      {item.expandable ? (
                        <div className="flex items-start justify-between w-full py-2 relative">
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-baseline gap-6 md:gap-8 group/item shrink-0"
                          >
                            <span className="text-xs md:text-sm font-mono text-white/40 group-hover/item:text-white font-medium transition-colors">
                              {item.num}
                            </span>
                            <span className="font-montserrat text-4xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-white group-hover/navlist:text-white/30 group-hover/item:!text-white transition-colors duration-300 uppercase">
                              {item.label}
                            </span>
                          </Link>
                          <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0 p-2 outline-none">
                            <Plus className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 m-auto text-white/40 transition-all duration-500 ease-[0.16,1,0.3,1] opacity-100 rotate-0 scale-100 group-hover:opacity-0 group-hover:rotate-90 group-hover:scale-50" />
                            <X className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 m-auto text-white transition-all duration-500 ease-[0.16,1,0.3,1] opacity-0 -rotate-90 scale-50 group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100" />
                          </div>
                          <div className="absolute left-[calc(100%+1rem)] top-0 flex flex-col items-start">
                            <Link
                              href="/services/web-design"
                              onClick={() => setIsMenuOpen(false)}
                              className="font-montserrat text-4xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-white/60 hover:text-white transition-all whitespace-nowrap opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 uppercase"
                              style={{ transitionDelay: '80ms', transitionDuration: '500ms', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                            >
                              Web Design &amp; Dev
                            </Link>
                            {[
                              { title: 'SaaS & Web Apps', href: '/services/saas-development' },
                              { title: 'Local & AI SEO', href: '/services/seo' },
                              { title: 'Business Automation', href: '/services/automation' },
                              { title: 'Consulting', href: '/services/consulting' },
                              { title: 'Maintenance', href: '/services/maintenance' },
                            ].map((sub, si) => (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="font-montserrat text-4xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-white/60 hover:text-white transition-all whitespace-nowrap opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 uppercase"
                                style={{ transitionDelay: `${80 + (si + 1) * 120}ms`, transitionDuration: '500ms', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full py-2">
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-baseline gap-6 md:gap-8 group/item w-full"
                          >
                            <span className="text-xs md:text-sm font-mono text-white/40 group-hover/item:text-white font-medium transition-colors">
                              {item.num}
                            </span>
                            <span className="font-montserrat text-4xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-white group-hover/navlist:text-white/30 group-hover/item:!text-white transition-colors duration-300 uppercase">
                              {item.label}
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-3xl pt-12 relative z-10 pl-8 md:pl-24"
            >
              <div>
                <h4 className="text-sm font-bold text-white mb-4">Get In Touch</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  Dobsonville, Soweto, South Africa<br />
                  <a href="mailto:hello@kreativereflow.com" className="hover:text-white transition-colors">hello@kreativereflow.com</a><br />
                  <a href="tel:+27655750713" className="hover:text-white transition-colors">+27 65 575 0713</a>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-4">Work Inquiries</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  <a href="mailto:projects@kreativereflow.com" className="hover:text-white transition-colors">projects@kreativereflow.com</a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="w-full max-w-2xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent border-b-2 border-white/50 text-white text-4xl md:text-6xl font-display py-4 focus:outline-none focus:border-white placeholder:text-white/30"
                autoFocus
              />
              <div className="mt-8 max-h-[45vh] overflow-y-auto border-t border-white/10">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="block border-b border-white/10 py-5 text-white/70 hover:text-white transition-colors"
                    >
                      <span className="block font-montserrat text-sm uppercase tracking-[0.2em] text-[#FC6E20]">
                        {page.title}
                      </span>
                      <span className="mt-2 block font-montserrat text-sm">
                        {page.description}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="py-5 font-montserrat text-sm text-white/50">
                    No matches yet. Try services, automation, contact, or SEO.
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                aria-label="Close search"
                className="absolute right-0 top-4 text-white/50 hover:text-white p-4"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
