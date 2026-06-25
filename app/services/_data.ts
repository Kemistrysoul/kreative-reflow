import type { ServiceDetailPageProps } from './_components/service-detail-page';

export const serviceDetails = {
  webDesign: {
    eyebrow: 'Trust and conversion',
    title: 'Web Design & Development',
    intro:
      'A custom website should explain the business, build trust quickly, and move the right visitor toward enquiry without making them work for it.',
    bestFor:
      'Service businesses, specialist practices, founders, and technical teams whose website needs to carry credibility before the first call.',
    problem:
      'The current site looks fine but does not explain the offer clearly, answer buyer doubt, or create a confident next step.',
    outcome:
      'A fast, responsive, conversion-ready website with a clear story, useful page structure, and room to grow after launch.',
    proof:
      'This is the layer behind builds like Coach Kagiso and Touch Teq: public websites designed around trust, service clarity, and qualified action.',
    heroPreview: 'web-design',
    proofPoints: [
      {
        label: 'Public fit',
        title: 'Two very different trust problems',
        description:
          'Coach Kagiso and Touch Teq show how the same website discipline can support a coaching brand and a technical engineering firm without using the same visual formula.',
      },
      {
        label: 'Conversion paths',
        title: 'The next step is designed in',
        description:
          'Booking, diagnostics, quote requests, lead magnets, and contact routes can be planned into the site instead of being bolted on after launch.',
      },
      {
        label: 'Show safely',
        title: 'Public pages carry the proof',
        description:
          'Case-study material can focus on public page structure, service clarity, and screenshots while private submissions, payment data, and client records stay out.',
      },
    ],
    symptoms: [
      {
        title: 'People still ask what you do',
        description:
          'The offer is not landing quickly enough, so visitors need extra explanation before they understand why they should enquire.',
      },
      {
        title: 'The site feels behind the business',
        description:
          'Your work has grown, but the website still feels generic, thin, or disconnected from how you actually sell and deliver.',
      },
      {
        title: 'Enquiries are too vague',
        description:
          'The contact form gets interest, but not enough context, intent, or confidence from the people reaching out.',
      },
    ],
    features: [
      {
        title: 'Positioning-led page structure',
        description:
          'Pages are planned around buyer questions, service clarity, proof, and the path from attention to action.',
      },
      {
        title: 'Custom visual direction',
        description:
          'The design system is shaped around the brand, not a template or a collection of borrowed sections.',
      },
      {
        title: 'Responsive development',
        description:
          'Layouts, forms, cards, and calls to action are built for desktop, tablet, and mobile without cramped breakpoints.',
      },
      {
        title: 'Conversion-ready copy flow',
        description:
          'The page sequence helps visitors understand the problem, the offer, the process, and the next step.',
      },
      {
        title: 'Search-ready foundations',
        description:
          'Technical structure, metadata, headings, and content hierarchy are prepared for search and future content work.',
      },
      {
        title: 'Launch handover',
        description:
          'You understand what was built, how to use it, and what should happen next after the site goes live.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Map',
        description:
          'We clarify the audience, offer, proof, conversion paths, and pages the website actually needs.',
      },
      {
        num: '02',
        title: 'Design',
        description:
          'The visual system and key screens are shaped around the brand, message, and device experience.',
      },
      {
        num: '03',
        title: 'Build',
        description:
          'The site is developed, tested, connected, and reviewed on real screen sizes before launch.',
      },
      {
        num: '04',
        title: 'Launch',
        description:
          'We deploy, hand over, and identify the next useful layer: SEO, content, support, or automation.',
      },
    ],
    related: [
      {
        title: 'Local & AI SEO',
        description: 'Add visibility structure once the website has a clear foundation.',
        href: '/services/seo',
      },
      {
        title: 'Maintenance & Support',
        description: 'Keep the site healthy, updated, and improving after launch.',
        href: '/services/maintenance',
      },
      {
        title: 'Business & Tech Consulting',
        description: 'Use a strategy pass when the offer, audience, or scope is still unclear.',
        href: '/services/consulting',
      },
    ],
    faqs: [
      {
        question: 'Do you use templates?',
        answer:
          'No. We may reuse proven thinking patterns, but the layout, content flow, and build are shaped around your business.',
      },
      {
        question: 'Can the site include booking or payment flows?',
        answer:
          'Yes. Booking, intake, payment, lead magnet, or diagnostic flows can be scoped into the website when they support the buyer journey.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'You can add maintenance, SEO, content, or automation support depending on what the business needs next.',
      },
    ],
    ctaTitle: 'Build the site your business keeps trying to explain manually.',
    ctaBody:
      'Tell us what the current site fails to explain. We will shape it into a website buyers understand and trust.',
  },
  saasDevelopment: {
    eyebrow: 'Systems and dashboards',
    title: 'SaaS & Custom Web Applications',
    intro:
      'When off-the-shelf tools almost fit, the business usually ends up with workarounds. We build portals, dashboards, and applications around the way the work actually moves.',
    bestFor:
      'Teams managing clients, files, quotes, bookings, tasks, reports, approvals, or operational data in too many places.',
    problem:
      'The process is scattered across spreadsheets, inboxes, forms, WhatsApp messages, and tools that do not speak to each other.',
    outcome:
      'A focused internal system, portal, or SaaS-style product that makes the important work visible, trackable, and easier to manage.',
    proof:
      'This is the private operations layer behind projects that need more than a marketing page: dashboards, submissions, asset libraries, quote flows, and project workspaces.',
    heroPreview: 'saas-dashboard',
    proofPoints: [
      {
        label: 'Operations',
        title: 'One workspace for scattered work',
        description:
          'Portals, dashboards, quote flows, asset libraries, and status boards can turn scattered admin into a calmer operating layer.',
      },
      {
        label: 'Workflow first',
        title: 'The app starts before the UI',
        description:
          'Users, records, permissions, statuses, and decisions are mapped before polish so the system supports the real work.',
      },
      {
        label: 'MVP discipline',
        title: 'Start with the highest-friction flow',
        description:
          'The first version should solve the workflow that hurts most instead of trying to rebuild the whole business at once.',
      },
    ],
    symptoms: [
      {
        title: 'Your team checks too many places',
        description:
          'Client status, files, approvals, and next actions live in different tools, so work depends on memory.',
      },
      {
        title: 'Clients need clearer visibility',
        description:
          'Updates, milestones, documents, or requests would be easier if clients had one calm place to go.',
      },
      {
        title: 'The business needs a system, not another app',
        description:
          'Generic tools are creating more admin because they do not match the actual workflow.',
      },
    ],
    features: [
      {
        title: 'Workflow mapping',
        description:
          'We map roles, data, handoffs, statuses, permissions, and the decisions the interface needs to support.',
      },
      {
        title: 'Dashboard interface',
        description:
          'The UI focuses on useful signals, not every possible number or table in the business.',
      },
      {
        title: 'Client or team portals',
        description:
          'Create a focused workspace for clients, staff, or partners to access what matters.',
      },
      {
        title: 'Forms and records',
        description:
          'Intake, quote, project, task, file, and activity records can be modeled around the business process.',
      },
      {
        title: 'Role-aware views',
        description:
          'Different users can see different parts of the system when the workflow requires it.',
      },
      {
        title: 'Future-ready foundations',
        description:
          'The first build is scoped to be usable now while leaving space for later integrations and automation.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Model',
        description:
          'We define the users, objects, statuses, actions, and data relationships before UI decisions start.',
      },
      {
        num: '02',
        title: 'Prototype',
        description:
          'The key screens are designed around real workflows so the system can be tested before the full build.',
      },
      {
        num: '03',
        title: 'Develop',
        description:
          'We build the core flows, views, and records, then test the application against realistic usage.',
      },
      {
        num: '04',
        title: 'Release',
        description:
          'The first version ships with handover, feedback loops, and a clear list of what should come next.',
      },
    ],
    related: [
      {
        title: 'AI & Business Automation',
        description: 'Connect repetitive actions once the workflow is clear.',
        href: '/services/automation',
      },
      {
        title: 'Business & Tech Consulting',
        description: 'Map the system before committing to custom software.',
        href: '/services/consulting',
      },
      {
        title: 'Maintenance & Support',
        description: 'Keep the application stable and improving after launch.',
        href: '/services/maintenance',
      },
    ],
    faqs: [
      {
        question: 'Do we need the full system at once?',
        answer:
          'No. The strongest version usually starts with a focused MVP that solves the highest-friction workflow first.',
      },
      {
        question: 'Can this connect to existing tools?',
        answer:
          'Often, yes. Integrations are scoped based on the tool, access, budget, and whether connecting it creates real value.',
      },
      {
        question: 'Is this the same as a website?',
        answer:
          'No. A website explains and converts. A custom application helps the business operate, track, manage, or deliver.',
      },
    ],
    ctaTitle: 'Turn scattered work into one useful operating layer.',
    ctaBody:
      'Tell us where the process currently breaks. We will help you decide what should become a dashboard, portal, or application.',
  },
  seo: {
    eyebrow: 'Visibility infrastructure',
    title: 'Local & AI SEO',
    intro:
      'Search is not only keywords anymore. Your site, listings, services, proof, FAQs, and structure need to be understandable to people, Google, maps, and AI answers.',
    bestFor:
      'Businesses that need qualified local enquiries, stronger service-page structure, and clearer visibility across search surfaces.',
    problem:
      'People are already searching, but your business is not showing up clearly enough, or search systems cannot understand what to recommend.',
    outcome:
      'A structured visibility foundation that makes the business easier to find, understand, and trust.',
    proof:
      'This service pairs naturally with websites for practices, service businesses, engineering firms, and local brands that need clarity plus discoverability.',
    heroPreview: 'seo',
    proofPoints: [
      {
        label: 'Structure',
        title: 'Services become easier to understand',
        description:
          'Separate service pages, FAQs, proof sections, and clear headings help buyers and search systems understand what the business offers.',
      },
      {
        label: 'Local trust',
        title: 'Discovery starts before the website',
        description:
          'Reviews, categories, locations, and Google Business Profile content support the search journey before someone clicks through.',
      },
      {
        label: 'AI readiness',
        title: 'Clear answers reduce guessing',
        description:
          'Structured pages and direct answers make it easier for AI systems to summarize the business without inventing the offer.',
      },
    ],
    symptoms: [
      {
        title: 'You are invisible for important searches',
        description:
          'The business exists, but service pages, listings, and local signals are not strong enough to earn visibility.',
      },
      {
        title: 'Your services are not structured',
        description:
          'Search systems struggle when every offer sits on one vague page or the wording is not specific enough.',
      },
      {
        title: 'Reviews and FAQs are underused',
        description:
          'Trust signals exist, but they are not organized into a search-friendly layer that supports buyer decisions.',
      },
    ],
    features: [
      {
        title: 'Search structure audit',
        description:
          'We review pages, headings, metadata, URLs, internal links, and the gaps limiting discoverability.',
      },
      {
        title: 'Service-page planning',
        description:
          'Your offers are organized into pages and sections that search systems and buyers can understand.',
      },
      {
        title: 'Local visibility setup',
        description:
          'We strengthen the location, category, service, and trust signals that matter for local discovery.',
      },
      {
        title: 'AI-search readiness',
        description:
          'Content is structured to answer questions clearly and make the business easier for AI systems to cite or summarize.',
      },
      {
        title: 'FAQ and proof strategy',
        description:
          'Questions, reviews, case proof, and objections become part of the visibility system, not scattered extras.',
      },
      {
        title: 'Content direction',
        description:
          'You get a practical content path for the next pages, articles, or updates that can support search growth.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Audit',
        description:
          'We review the current site, services, search surfaces, and gaps in clarity or structure.',
      },
      {
        num: '02',
        title: 'Structure',
        description:
          'We organize pages, keywords, FAQs, proof points, and service language around real buyer intent.',
      },
      {
        num: '03',
        title: 'Implement',
        description:
          'The search foundations are applied across page content, metadata, internal links, and local signals.',
      },
      {
        num: '04',
        title: 'Improve',
        description:
          'We define what to publish, update, or measure next so visibility can keep improving after the first pass.',
      },
    ],
    related: [
      {
        title: 'Web Design & Development',
        description: 'SEO works best when the website structure can support it.',
        href: '/services/web-design',
      },
      {
        title: 'Maintenance & Support',
        description: 'Keep content, technical health, and visibility signals improving.',
        href: '/services/maintenance',
      },
      {
        title: 'Business & Tech Consulting',
        description: 'Clarify the offer and service architecture before optimizing.',
        href: '/services/consulting',
      },
    ],
    faqs: [
      {
        question: 'Is this only for Google?',
        answer:
          'No. Google matters, but we also think about maps, AI answers, structured content, reviews, and the way buyers research.',
      },
      {
        question: 'Do you guarantee rankings?',
        answer:
          'No honest SEO work can guarantee exact rankings. The goal is to build strong structure, improve discoverability, and create better conditions for qualified enquiries.',
      },
      {
        question: 'Can SEO be added after a website is built?',
        answer:
          'Yes, but it is stronger when planned early. Retrofitting is possible, especially if the current site has a solid technical base.',
      },
    ],
    ctaTitle: 'Make the business easier to find and easier to understand.',
    ctaBody:
      'Bring the current site, listings, or service idea. We will map the visibility layer that should support it.',
  },
  automation: {
    eyebrow: 'Less repeated admin',
    title: 'AI & Business Automation',
    intro:
      'Automation should not feel like hype. It should remove repeated work, tighten follow-ups, reduce errors, and give the team more space for judgement.',
    bestFor:
      'Businesses repeating the same intake, email, scheduling, reporting, data entry, handoff, or content tasks every week.',
    problem:
      'Manual work is slowing the team down, creating missed follow-ups, and making simple operations feel heavier than they should.',
    outcome:
      'Practical automations that move information, trigger reminders, prepare outputs, and reduce repetitive admin without hiding how the work happens.',
    proof:
      'This layer connects naturally to dashboards, content operations, lead intake, quote workflows, and after-launch support.',
    heroPreview: 'automation',
    proofPoints: [
      {
        label: 'Admin reduction',
        title: 'Repeated work gets a system',
        description:
          'Intake, reminders, reporting, routing, drafting, and status updates can be moved into workflows that do not rely on memory.',
      },
      {
        label: 'Human review',
        title: 'Judgement stays with people',
        description:
          'Automation should prepare information, reduce repetition, and flag next steps without hiding decisions from the team.',
      },
      {
        label: 'Connected layer',
        title: 'Best when tied to a real surface',
        description:
          'Automation becomes stronger when it connects to a dashboard, CRM, content calendar, portal, or support workflow.',
      },
    ],
    symptoms: [
      {
        title: 'The same task keeps coming back',
        description:
          'If a task follows rules and repeats every week, it may be a good candidate for automation.',
      },
      {
        title: 'Follow-ups depend on memory',
        description:
          'Leads, clients, invoices, or internal tasks slip because reminders and next actions are not systemized.',
      },
      {
        title: 'Reports take too long',
        description:
          'Useful information exists, but collecting it, formatting it, and sending it takes too much manual effort.',
      },
    ],
    features: [
      {
        title: 'Workflow audit',
        description:
          'We identify repeated actions, rules, triggers, exceptions, and the parts that should still stay human.',
      },
      {
        title: 'Lead and intake flows',
        description:
          'Forms, enquiries, files, and next steps can be routed into cleaner follow-up systems.',
      },
      {
        title: 'Email and reminder logic',
        description:
          'Automated messages, nudges, and internal reminders help prevent quiet drop-offs.',
      },
      {
        title: 'Reporting automation',
        description:
          'Regular summaries, status snapshots, or operational reports can be prepared with less manual formatting.',
      },
      {
        title: 'AI-assisted drafting',
        description:
          'Where appropriate, AI can help prepare first drafts, summaries, or structured outputs for human review.',
      },
      {
        title: 'Automation documentation',
        description:
          'You understand what triggers the workflow, where information goes, and how to adjust it later.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Find',
        description:
          'We identify the repeated task, the trigger, the rules, and the point where manual work becomes waste.',
      },
      {
        num: '02',
        title: 'Design',
        description:
          'We map the workflow with failure points, human review moments, and clear ownership.',
      },
      {
        num: '03',
        title: 'Connect',
        description:
          'The automation is built, tested, and connected to the tools or forms that need to trigger it.',
      },
      {
        num: '04',
        title: 'Monitor',
        description:
          'We check that it behaves correctly, then refine the workflow based on real use.',
      },
    ],
    related: [
      {
        title: 'SaaS & Custom Web Applications',
        description: 'Automations become stronger when they are connected to a clear dashboard or portal.',
        href: '/services/saas-development',
      },
      {
        title: 'Maintenance & Support',
        description: 'Keep automations monitored, updated, and improved over time.',
        href: '/services/maintenance',
      },
      {
        title: 'Business & Tech Consulting',
        description: 'Map what should be automated before building the workflow.',
        href: '/services/consulting',
      },
    ],
    faqs: [
      {
        question: 'Will automation replace my team?',
        answer:
          'No. The best automation removes repeated admin so people can focus on judgement, relationships, and higher-value work.',
      },
      {
        question: 'Can you automate everything?',
        answer:
          'Not everything should be automated. We look for tasks with clear rules, reliable inputs, and real time savings.',
      },
      {
        question: 'Can AI be part of the workflow?',
        answer:
          'Yes, when it has a practical role such as summarizing, drafting, categorizing, or preparing structured outputs for review.',
      },
    ],
    ctaTitle: 'Stop letting repeated admin shape the day.',
    ctaBody:
      'Tell us what your team keeps doing manually. We will identify what can be automated safely and what should stay human.',
  },
  consulting: {
    eyebrow: 'Clarity before build',
    title: 'Business & Tech Consulting',
    intro:
      'When the business feels messy, the first move is not always a build. Sometimes you need the system mapped, the bottleneck named, and the next decision made clearly.',
    bestFor:
      'Founders and teams who know something needs to change but are not sure whether they need a website, dashboard, automation, SEO, or a smaller first step.',
    problem:
      'Jumping into tools too early can make complexity permanent. The business needs a practical map before scope, budget, or software decisions.',
    outcome:
      'A clear roadmap that separates what matters now from what can wait, with a recommended next step and implementation path.',
    proof:
      'This is often the smartest first step when a business has grown around workarounds and needs direction before committing to a larger build.',
    heroPreview: 'consulting',
    founderNote: {
      eyebrow: 'Who you work with',
      heading: 'Consulting is led directly by the founder',
      body: 'Consulting is the most personal service here, so you work with Disele directly, not a handoff. Seven years across medical sales and neurology, plus the systems built for service businesses since, go into mapping your bottleneck before anyone talks about scope or budget.',
    },
    proofPoints: [
      {
        label: 'Clarity',
        title: 'The output is a decision map',
        description:
          'The work separates what to build, what to ignore, what to improve, and what can wait until the business is ready.',
      },
      {
        label: 'Scope control',
        title: 'Avoid paying for the wrong build',
        description:
          'Consulting protects the budget by naming the bottleneck before design, development, tools, or automation begin.',
      },
      {
        label: 'Implementation bridge',
        title: 'Strategy becomes the brief',
        description:
          'If a build makes sense, the consulting output becomes the starting brief for a focused first phase.',
      },
    ],
    symptoms: [
      {
        title: 'The problem is hard to name',
        description:
          'You can feel the friction, but it is unclear whether the issue is positioning, operations, tools, visibility, or follow-up.',
      },
      {
        title: 'Every solution sounds expensive',
        description:
          'You need help separating the useful first move from the shiny idea that can wait.',
      },
      {
        title: 'The team works around the system',
        description:
          'People have invented manual fixes because the current tools do not match the business.',
      },
    ],
    features: [
      {
        title: 'Systems audit',
        description:
          'We review your website, tools, workflows, handoffs, and bottlenecks so the real constraints are visible.',
      },
      {
        title: 'Offer and journey mapping',
        description:
          'We clarify how clients discover, understand, enquire, buy, receive updates, and come back.',
      },
      {
        title: 'Roadmap planning',
        description:
          'You get a priority order for what to fix, build, automate, or ignore for now.',
      },
      {
        title: 'Tool recommendations',
        description:
          'We help decide what to keep, replace, connect, or build custom based on fit and maintenance.',
      },
      {
        title: 'Build feasibility',
        description:
          'Ideas are pressure-tested against users, scope, data, budget, and long-term care.',
      },
      {
        title: 'Implementation brief',
        description:
          'If building makes sense, you leave with a practical brief for the first focused phase.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Listen',
        description:
          'We understand the business, the current mess, and the decision you need to make.',
      },
      {
        num: '02',
        title: 'Map',
        description:
          'We map the journey, tools, handoffs, data, pages, and workflows that shape the problem.',
      },
      {
        num: '03',
        title: 'Prioritize',
        description:
          'We identify what matters now, what can wait, and what should not be built yet.',
      },
      {
        num: '04',
        title: 'Brief',
        description:
          'You get a clear next step, whether that is a build, SEO pass, automation, or maintenance plan.',
      },
    ],
    related: [
      {
        title: 'Web Design & Development',
        description: 'Move into website work once the offer and buyer journey are clear.',
        href: '/services/web-design',
      },
      {
        title: 'SaaS & Custom Web Applications',
        description: 'Build the internal system after the workflow has been mapped.',
        href: '/services/saas-development',
      },
      {
        title: 'AI & Business Automation',
        description: 'Automate the repeated work after the rules and exceptions are known.',
        href: '/services/automation',
      },
    ],
    faqs: [
      {
        question: 'Is this only for people ready to build?',
        answer:
          'No. Consulting is useful when you are not sure what to build, what to fix, or whether the idea is worth building yet.',
      },
      {
        question: 'Will I receive a practical output?',
        answer:
          'Yes. The goal is a clear recommendation, roadmap, or brief, not a vague strategy conversation.',
      },
      {
        question: 'Can we move into implementation after?',
        answer:
          'Yes. If implementation makes sense, the consulting work becomes the foundation for a focused build phase.',
      },
    ],
    ctaTitle: 'Before you build the thing, name the real problem.',
    ctaBody:
      'Bring the tangled version. We will map the system and find the smartest next move.',
  },
  maintenance: {
    eyebrow: 'After launch support',
    title: 'Maintenance & Support',
    intro:
      'Launch is not the finish line. A useful digital system needs updates, monitoring, fixes, content changes, and steady improvement after it goes live.',
    bestFor:
      'Businesses with a live website, portal, dashboard, or automation that needs reliable care and someone who understands the build.',
    problem:
      'Without ongoing support, small issues become broken trust, slow pages, outdated content, security risk, and quiet technical debt.',
    outcome:
      'A healthier, more stable digital product with clear support, practical improvements, and fewer surprises.',
    proof:
      'This service protects the work after launch so websites, dashboards, and automation systems do not slowly drift out of shape.',
    heroPreview: 'maintenance',
    proofPoints: [
      {
        label: 'Care rhythm',
        title: 'The product does not get left alone',
        description:
          'Updates, checks, fixes, and small improvements create a practical support rhythm after launch.',
      },
      {
        label: 'Trust protection',
        title: 'Small issues do not become public friction',
        description:
          'Broken links, slow pages, outdated copy, and layout bugs are small until they start costing credibility.',
      },
      {
        label: 'Improvement loop',
        title: 'Support can also move the product forward',
        description:
          'Maintenance can include measured UX, SEO, conversion, and automation improvements instead of only emergency fixes.',
      },
    ],
    symptoms: [
      {
        title: 'Small fixes keep piling up',
        description:
          'Content changes, layout issues, broken links, and minor improvements sit untouched because there is no support rhythm.',
      },
      {
        title: 'You are nervous to update things',
        description:
          'The site or system works, but nobody wants to touch it because the setup is unclear.',
      },
      {
        title: 'The launch momentum faded',
        description:
          'The product went live, but SEO, content, performance, and workflow improvements stopped there.',
      },
    ],
    features: [
      {
        title: 'Technical updates',
        description:
          'Framework, dependency, plugin, and platform updates are handled carefully to reduce risk.',
      },
      {
        title: 'Performance checks',
        description:
          'We watch for slow pages, broken interactions, layout regressions, and technical errors.',
      },
      {
        title: 'Content changes',
        description:
          'Small updates, new sections, copy changes, and page adjustments have a direct support path.',
      },
      {
        title: 'Priority fixes',
        description:
          'When something breaks, you are not starting from zero with a new vendor.',
      },
      {
        title: 'Monthly improvements',
        description:
          'Support can include measured UX, SEO, conversion, and automation improvements, not only emergency fixes.',
      },
      {
        title: 'Simple reporting',
        description:
          'You know what was checked, what changed, and what needs attention next.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Review',
        description:
          'We review the current site or system, known issues, stack, analytics, and support needs.',
      },
      {
        num: '02',
        title: 'Plan',
        description:
          'We define the support rhythm, response expectations, and the kinds of work covered.',
      },
      {
        num: '03',
        title: 'Maintain',
        description:
          'Updates, checks, fixes, and agreed changes are handled on a recurring basis.',
      },
      {
        num: '04',
        title: 'Improve',
        description:
          'We identify the next useful improvement so the product keeps earning its place.',
      },
    ],
    related: [
      {
        title: 'Web Design & Development',
        description: 'Refresh or rebuild when the current site has outgrown maintenance.',
        href: '/services/web-design',
      },
      {
        title: 'Local & AI SEO',
        description: 'Use support time to improve visibility, content, and search structure.',
        href: '/services/seo',
      },
      {
        title: 'AI & Business Automation',
        description: 'Keep automations monitored and refine them after real use.',
        href: '/services/automation',
      },
    ],
    faqs: [
      {
        question: 'Can you support a site you did not build?',
        answer:
          'Usually, yes, but it starts with a review. Some builds need cleanup before ongoing support makes sense.',
      },
      {
        question: 'Is maintenance only technical?',
        answer:
          'No. It can include technical care, content changes, UX improvements, SEO updates, and support for small workflow changes.',
      },
      {
        question: 'Do I need support every month?',
        answer:
          'Not always. Some businesses need a recurring plan, while others need a focused cleanup or improvement sprint.',
      },
    ],
    ctaTitle: 'Keep the launch alive after the launch day.',
    ctaBody:
      'Show us what is running now. We will recommend the support rhythm that makes sense.',
  },
} satisfies Record<string, ServiceDetailPageProps>;
