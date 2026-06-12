'use client';

import type React from 'react';
import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Layers3,
  MonitorSmartphone,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Wrench,
} from 'lucide-react';
import {
  buildBrandedReportHtml,
  downloadPdfReport,
  getLeadCaptureErrorMessage,
  submitLeadCapture,
} from '@/lib/lead-capture';

type CategoryId = 'technical' | 'design' | 'business' | 'performance';
type PathId = 'rebuild' | 'refresh' | 'optimize';
type Tone = 'critical' | 'warning' | 'strong';

type QuizOption = {
  label: string;
  value: string;
  points: number;
  forcedPath?: Extract<PathId, 'rebuild' | 'refresh'>;
  forcedReason?: string;
  insight?: string;
};

type QuizQuestion = {
  id: string;
  category: CategoryId;
  weight: number;
  question: string;
  helpText: string;
  options: QuizOption[];
};

type CategoryScore = {
  earned: number;
  possible: number;
};

type DecisionResult = {
  path: PathId;
  score: number;
  categoryScores: Record<CategoryId, CategoryScore>;
  forced: boolean;
  forcedReason?: string;
  confidence: 'high' | 'medium';
};

type PathDetails = {
  title: string;
  tone: Tone;
  cost: string;
  timeline: string;
  roiTimeline: string;
  description: string;
  why: string;
  whatYouGet: string[];
  risks: string[];
  whatIfWrong: string;
  ctaText: string;
  ctaMessage: string;
};

type LeadCaptureState = {
  name: string;
  email: string;
  business: string;
};

const categories: Record<
  CategoryId,
  {
    name: string;
    maxPoints: number;
    description: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }
> = {
  technical: {
    name: 'Technical Foundation',
    maxPoints: 30,
    description: 'Age, mobile, speed, security, and integration readiness.',
    icon: MonitorSmartphone,
  },
  design: {
    name: 'Design & UX',
    maxPoints: 20,
    description: 'How current, clear, trustworthy, and consistent the site feels.',
    icon: Layers3,
  },
  business: {
    name: 'Business Alignment',
    maxPoints: 20,
    description: 'Whether the site still reflects the offer, audience, and model.',
    icon: SlidersHorizontal,
  },
  performance: {
    name: 'Performance & Conversions',
    maxPoints: 30,
    description: 'Traffic, conversion, bounce, content freshness, and bottlenecks.',
    icon: Gauge,
  },
};

const categoryOrder: CategoryId[] = ['technical', 'design', 'business', 'performance'];

const quizQuestions: QuizQuestion[] = [
  {
    id: 'tech_cms_age',
    category: 'technical',
    weight: 6,
    question: 'When was your website last completely rebuilt?',
    helpText:
      'A rebuild means new code and new structure, not just design changes. Check with your developer or look at the footer date.',
    options: [
      { label: '2024-2025, less than 1 year old', value: '2024_2025', points: 6 },
      { label: '2022-2023, 1-3 years old', value: '2022_2023', points: 4 },
      { label: '2020-2021, 3-5 years old', value: '2020_2021', points: 2 },
      { label: '2018-2019, 5-7 years old', value: '2018_2019', points: 1 },
      {
        label: '2017 or earlier, 8+ years old',
        value: '2017_earlier',
        points: 0,
        forcedPath: 'rebuild',
        forcedReason: 'Site is 8+ years old. The technology, security, structure, and compatibility risk are too high for a cosmetic refresh.',
      },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'tech_mobile',
    category: 'technical',
    weight: 6,
    question: 'Open your site on a mobile phone. How does it look?',
    helpText:
      'Test on a real phone using mobile data. Can you read text without zooming? Does anything break or overlap?',
    options: [
      { label: 'Perfect, fully responsive and everything works', value: 'perfect', points: 6 },
      { label: 'Good, minor issues but mostly works', value: 'good', points: 4 },
      { label: 'Okay, but needs zooming or has horizontal scroll', value: 'okay', points: 2 },
      {
        label: "Broken, text unreadable or buttons don't work",
        value: 'broken',
        points: 0,
        forcedPath: 'rebuild',
        forcedReason: 'Site is broken on mobile. Most South African traffic is mobile, so this is a core structural issue.',
      },
    ],
  },
  {
    id: 'tech_speed',
    category: 'technical',
    weight: 6,
    question: "Test your site at pagespeed.web.dev on mobile. What's your score?",
    helpText:
      'Go to pagespeed.web.dev, enter your URL, run the mobile test, and check the score out of 100.',
    options: [
      { label: '90-100, Excellent', value: '90_100', points: 6 },
      { label: '70-89, Good', value: '70_89', points: 4 },
      { label: '50-69, Needs improvement', value: '50_69', points: 2 },
      { label: 'Below 50, Poor', value: 'below_50', points: 0 },
      { label: "I don't know or haven't tested", value: 'unknown', points: 1 },
    ],
  },
  {
    id: 'tech_security',
    category: 'technical',
    weight: 6,
    question: 'Does your website have HTTPS with a padlock icon?',
    helpText:
      "Look at your website URL. It should start with https:// and show a padlock. This is basic trust and security.",
    options: [
      { label: 'Yes, HTTPS with padlock', value: 'yes', points: 6 },
      {
        label: 'No, HTTP only or security warnings',
        value: 'no',
        points: 0,
        forcedPath: 'rebuild',
        forcedReason: 'No HTTPS creates a security vulnerability, trust issue, and ranking penalty.',
      },
    ],
  },
  {
    id: 'tech_integrations',
    category: 'technical',
    weight: 6,
    question: 'Can you connect your site to tools you use, like CRM, WhatsApp, booking, or email?',
    helpText:
      'Can you add integrations easily through plugins, Zapier, or API connections? Or do you need a developer for every change?',
    options: [
      { label: 'Easy, 5+ integrations already working', value: 'easy', points: 6 },
      { label: 'Possible, 1-2 integrations with some effort', value: 'possible', points: 3 },
      { label: 'Difficult, manual workarounds only', value: 'difficult', points: 1 },
      { label: 'Impossible, custom code or rebuild needed', value: 'impossible', points: 0 },
    ],
  },
  {
    id: 'design_age',
    category: 'design',
    weight: 5,
    question: 'How old does your website design look?',
    helpText: 'Be honest. Compare your site to competitors. Does it look modern or dated?',
    options: [
      { label: 'Modern, looks 2024-2025', value: 'modern', points: 5 },
      { label: 'Recent, looks 2022-2023', value: 'recent', points: 3 },
      { label: 'Dated, looks 2020 or older', value: 'dated', points: 0 },
    ],
  },
  {
    id: 'design_navigation',
    category: 'design',
    weight: 5,
    question: 'Can a first-time visitor find what they need in under 30 seconds?',
    helpText:
      'Ask someone unfamiliar with your business to find your pricing, services, or contact information. Time them.',
    options: [
      { label: 'Yes, clear and intuitive navigation', value: 'yes', points: 5 },
      { label: 'Mostly, takes some clicking around', value: 'mostly', points: 3 },
      { label: 'No, confusing and hard to find things', value: 'no', points: 0 },
    ],
  },
  {
    id: 'design_trust',
    category: 'design',
    weight: 5,
    question: 'How many trust signals does your site have?',
    helpText:
      'Count reviews, testimonials, client logos, team photos, certifications, case studies, or media mentions.',
    options: [
      { label: '5+ trust signals visible on homepage', value: '5_plus', points: 5 },
      { label: '3-4 trust signals', value: '3_4', points: 3 },
      { label: '1-2 trust signals', value: '1_2', points: 1 },
      { label: 'None visible', value: 'none', points: 0 },
    ],
  },
  {
    id: 'design_brand',
    category: 'design',
    weight: 5,
    question: 'Do your colors, fonts, and tone feel consistent across all pages?',
    helpText:
      'Click through 5-6 pages. Do they all feel like the same brand or does each page look different?',
    options: [
      { label: 'Fully consistent, professional brand system', value: 'consistent', points: 5 },
      { label: 'Mostly consistent, minor inconsistencies', value: 'mostly', points: 3 },
      { label: 'Inconsistent, feels random', value: 'inconsistent', points: 0 },
    ],
  },
  {
    id: 'business_services',
    category: 'business',
    weight: 7,
    question: 'Does your website accurately show what you sell today?',
    helpText:
      'Not what you used to sell. What you actually offer right now. Are any services outdated or missing?',
    options: [
      { label: '100% current, everything is accurate', value: 'current', points: 7 },
      { label: 'Mostly current, 1-2 things outdated', value: 'mostly', points: 4 },
      { label: 'Half outdated, half current', value: 'half', points: 2 },
      {
        label: "Mostly outdated, doesn't reflect current business",
        value: 'outdated',
        points: 0,
        forcedPath: 'refresh',
        forcedReason: "The site does not reflect the current business. Messaging, service structure, and key content need a serious refresh.",
      },
    ],
  },
  {
    id: 'business_audience',
    category: 'business',
    weight: 7,
    question: 'Does your site speak to your ideal customer?',
    helpText:
      'Who is your site trying to attract? Is the messaging, design, and content aimed at them or at someone else?',
    options: [
      { label: 'Perfectly targeted, speaks directly to ideal customer', value: 'perfect', points: 7 },
      { label: 'Mostly right, minor misalignment', value: 'mostly', points: 4 },
      { label: 'Wrong audience, speaks to old or wrong customer type', value: 'wrong', points: 0 },
    ],
  },
  {
    id: 'business_model',
    category: 'business',
    weight: 6,
    question: 'Have you changed how you make money in the last 2 years?',
    helpText:
      'Examples: added subscriptions, changed pricing, moved from product to service, or added new revenue streams.',
    options: [
      { label: 'No major changes, or changes are fully reflected', value: 'no_or_reflected', points: 6 },
      {
        label: 'Yes, major changes are not reflected on the site',
        value: 'yes_not_reflected',
        points: 0,
        forcedPath: 'refresh',
        forcedReason: 'The business model changed but the site has not caught up. The structure and content need a business-alignment refresh.',
      },
    ],
  },
  {
    id: 'performance_traffic',
    category: 'performance',
    weight: 5,
    question: "What's your organic traffic trend over the last 12 months?",
    helpText: 'Check Google Analytics or Search Console. Is traffic growing, stable, or declining?',
    options: [
      { label: 'Growing 10%+', value: 'growing', points: 5 },
      { label: 'Stable, +/-10%', value: 'stable', points: 3 },
      { label: 'Declining 10-25%', value: 'declining_minor', points: 1 },
      { label: 'Declining 25%+ or nearly zero', value: 'declining_major', points: 0 },
      { label: "I don't know or no analytics", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'performance_conversion',
    category: 'performance',
    weight: 10,
    question: 'What percentage of visitors become leads or customers?',
    helpText:
      'Conversion rate equals leads or sales divided by website visitors, then multiplied by 100. Service businesses often sit around 2-4%.',
    options: [
      { label: '5%+, Excellent', value: '5_plus', points: 10 },
      { label: '3-5%, Good', value: '3_5', points: 7 },
      { label: '1-3%, Average', value: '1_3', points: 4 },
      { label: 'Below 1%, Poor', value: 'below_1', points: 0 },
      { label: "I don't know", value: 'unknown', points: 2 },
    ],
  },
  {
    id: 'performance_bounce',
    category: 'performance',
    weight: 5,
    question: "What's your bounce rate?",
    helpText:
      'Bounce rate is the percentage of visitors who leave after viewing only one page. Below 50% is usually healthier.',
    options: [
      { label: 'Below 40%, Excellent', value: 'below_40', points: 5 },
      { label: '40-60%, Good', value: '40_60', points: 3 },
      { label: 'Above 60%, Poor', value: 'above_60', points: 0 },
      { label: "I don't know", value: 'unknown', points: 1 },
    ],
  },
  {
    id: 'performance_content',
    category: 'performance',
    weight: 5,
    question: 'When was your last blog post or content update?',
    helpText:
      'Fresh content signals that your site is active. Stale content can weaken search visibility and buyer confidence.',
    options: [
      { label: 'Within the last month', value: 'last_month', points: 5 },
      { label: '1-3 months ago', value: '1_3_months', points: 3 },
      { label: '3-12 months ago', value: '3_12_months', points: 1 },
      { label: 'Over a year ago or never', value: 'over_year', points: 0 },
    ],
  },
  {
    id: 'performance_goals',
    category: 'performance',
    weight: 5,
    question: "What's the biggest problem with your current website?",
    helpText: 'This helps identify whether the real bottleneck is traffic, conversion, design, technical debt, or alignment.',
    options: [
      { label: 'Not getting enough traffic', value: 'traffic', points: 3, insight: 'SEO optimization needed' },
      { label: 'Getting traffic but no conversions', value: 'conversions', points: 3, insight: 'Conversion optimization or refresh needed' },
      { label: 'Looks outdated and unprofessional', value: 'design', points: 2, insight: 'Refresh likely needed' },
      { label: 'Too slow or broken on mobile', value: 'technical', points: 0, insight: 'Technical rebuild likely needed' },
      { label: "Doesn't represent current business", value: 'alignment', points: 1, insight: 'Business alignment issue, refresh or rebuild' },
    ],
  },
];

function getPathDetails(result: DecisionResult): PathDetails {
  const forcedWhy = result.forced && result.forcedReason ? `Critical issue detected: ${result.forcedReason}` : '';

  if (result.path === 'rebuild') {
    return {
      title: 'Full Rebuild Recommended',
      tone: 'critical',
      cost: 'R45,000-R350,000',
      timeline: '8-20 weeks',
      roiTimeline: '6-18 months',
      description:
        'Your website likely needs to be rebuilt with modern technology, a fresh structure, and a stronger conversion foundation.',
      why:
        forcedWhy ||
        "Your score points to fundamental technical or business-alignment issues that minor updates probably won't fix.",
      whatYouGet: [
        'New modern CMS or custom build foundation',
        'Mobile-first responsive design',
        'Fast page speed target under 3 seconds',
        'HTTPS, security, and POPIA-conscious structure',
        'SEO foundation and content migration',
        'CRM, WhatsApp, booking, or automation readiness',
        'Training and documentation',
      ],
      risks: [
        'Highest upfront cost',
        'Longer timeline before launch',
        'Temporary SEO dip during migration',
        'Requires strategy and content decisions',
      ],
      whatIfWrong:
        'If you refresh instead of rebuilding, you may spend R15k-R40k on surface changes while the technical problem remains. That often leads to a rebuild 6-12 months later.',
      ctaText: 'Book Rebuild Consultation',
      ctaMessage:
        'Major investment needed. We will create a phased plan to spread cost, reduce disruption, and avoid rebuilding twice.',
    };
  }

  if (result.path === 'refresh') {
    return {
      title: 'Refresh / Redesign Recommended',
      tone: 'warning',
      cost: 'R15,000-R80,000',
      timeline: '3-8 weeks',
      roiTimeline: '3-6 months',
      description:
        'Your site appears to have a usable foundation, but the design, messaging, UX, or business content needs a serious update.',
      why:
        forcedWhy ||
        "Your site works technically, but it may look dated, communicate the wrong offer, or fail to convert the visitors you're already getting.",
      whatYouGet: [
        'Modern visual design and layout refresh',
        'Updated messaging and copywriting',
        'Improved navigation and user experience',
        'New trust signals and proof points',
        'Mobile UX improvements',
        'CTA, form, and conversion improvements',
        'Key page content refresh',
      ],
      risks: [
        "Won't fix deep technical debt",
        'Limited if major integrations are needed',
        'May still need a rebuild in 2-3 years',
        'Can underperform if the business model changed deeply',
      ],
      whatIfWrong:
        'If you rebuild when you only need a refresh, you can overspend by R30k-R200k. If you only optimize when you need a refresh, the changes may feel too small to matter.',
      ctaText: 'Book Free Audit',
      ctaMessage:
        'Good foundation, needs update. We will scope what to refresh for the strongest ROI.',
    };
  }

  return {
    title: 'Optimization Only',
    tone: 'strong',
    cost: 'R3,000-R25,000',
    timeline: '1-4 weeks',
    roiTimeline: '1-3 months',
    description:
      'Your website is in good shape. It likely needs targeted improvements rather than a redesign or rebuild.',
    why:
      'Your site appears modern, technically sound, and aligned enough that small improvements should deliver the best return.',
    whatYouGet: [
      'Page speed optimization',
      'SEO metadata, schema, and content improvements',
      'Conversion improvements for CTAs and forms',
      'Fresh content updates',
      'Mobile UX tweaks',
      'Analytics setup and tracking',
      'Trust signal additions',
    ],
    risks: [
      "Won't fix fundamental issues if the diagnosis is wrong",
      'Limited impact if the design is truly dated',
      "Can't add major platform features without a bigger build",
    ],
    whatIfWrong:
      'If you rebuild or refresh when you only need optimization, you spend too much and lose time. Put that budget into marketing, proof, content, or focused conversion improvements.',
    ctaText: 'Book Consultation',
    ctaMessage:
      'Solid site, minor fixes needed. We will create an optimization roadmap for quick wins.',
  };
}

function calculateDecision(answers: Record<string, string>): DecisionResult {
  const categoryScores: Record<CategoryId, CategoryScore> = {
    technical: { earned: 0, possible: categories.technical.maxPoints },
    design: { earned: 0, possible: categories.design.maxPoints },
    business: { earned: 0, possible: categories.business.maxPoints },
    performance: { earned: 0, possible: categories.performance.maxPoints },
  };
  let score = 0;
  let forcedRebuild: string | undefined;
  let forcedRefresh: string | undefined;

  quizQuestions.forEach((question) => {
    const selected = question.options.find((option) => option.value === answers[question.id]);

    if (!selected) return;

    score += selected.points;
    categoryScores[question.category].earned += selected.points;

    if (selected.forcedPath === 'rebuild' && !forcedRebuild) {
      forcedRebuild = selected.forcedReason;
    }

    if (selected.forcedPath === 'refresh' && !forcedRefresh) {
      forcedRefresh = selected.forcedReason;
    }
  });

  if (forcedRebuild) {
    return {
      path: 'rebuild',
      score,
      categoryScores,
      forced: true,
      forcedReason: forcedRebuild,
      confidence: 'high',
    };
  }

  if (forcedRefresh) {
    return {
      path: 'refresh',
      score,
      categoryScores,
      forced: true,
      forcedReason: forcedRefresh,
      confidence: 'high',
    };
  }

  if (score >= 75) {
    return {
      path: 'optimize',
      score,
      categoryScores,
      forced: false,
      confidence: score >= 85 ? 'high' : 'medium',
    };
  }

  if (score >= 50) {
    return {
      path: 'refresh',
      score,
      categoryScores,
      forced: false,
      confidence: score >= 60 ? 'high' : 'medium',
    };
  }

  return {
    path: 'rebuild',
    score,
    categoryScores,
    forced: false,
    confidence: score < 30 ? 'high' : 'medium',
  };
}

function getPriorityIssues(answers: Record<string, string>) {
  return quizQuestions
    .map((question) => {
      const selected = question.options.find((option) => option.value === answers[question.id]);
      const points = selected?.points ?? 0;
      const lost = question.weight - points;

      return {
        question,
        selected,
        lost,
        ratio: lost / question.weight,
      };
    })
    .filter((item) => item.lost > 0)
    .sort((a, b) => b.ratio - a.ratio || b.lost - a.lost)
    .slice(0, 4);
}

function formatScore(value: number) {
  return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(value);
}

function optionScoreLabel(question: QuizQuestion, option: QuizOption) {
  return `${option.points}/${question.weight}`;
}

function toneClasses(tone: Tone) {
  if (tone === 'critical') {
    return 'border-red-400/40 bg-red-500/12 text-red-100';
  }

  if (tone === 'warning') {
    return 'border-[#FC6E20]/45 bg-[#FC6E20]/12 text-[#FBFBFB]';
  }

  return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100';
}

function buildReportText({
  answers,
  details,
  lead,
  priorityIssues,
  result,
}: {
  answers: Record<string, string>;
  details: PathDetails;
  lead: LeadCaptureState;
  priorityIssues: ReturnType<typeof getPriorityIssues>;
  result: DecisionResult;
}) {
  const categoryLines = categoryOrder.map((categoryId) => {
    const category = categories[categoryId];
    const score = result.categoryScores[categoryId];
    return `${category.name}: ${formatScore(score.earned)}/${score.possible}`;
  });
  const answerLines = quizQuestions.map((question) => {
    const selected = question.options.find((option) => option.value === answers[question.id]);

    return [
      question.question,
      `Answer: ${selected?.label ?? 'Not answered'}`,
      `Score: ${selected?.points ?? 0}/${question.weight}`,
      selected?.forcedPath ? `Trigger: ${selected.forcedReason}` : selected?.insight ? `Insight: ${selected.insight}` : 'Insight: No critical trigger.',
    ].join('\n');
  });

  return [
    'Website Rebuild vs Refresh Quiz Report',
    'Kreative Reflow',
    '',
    `Name: ${lead.name || 'Not provided'}`,
    `Email: ${lead.email || 'Not provided'}`,
    `Business: ${lead.business || 'Not provided'}`,
    '',
    `Recommendation: ${details.title}`,
    `Score: ${formatScore(result.score)}/100`,
    `Confidence: ${result.confidence}`,
    `Forced trigger: ${result.forced ? result.forcedReason : 'No'}`,
    '',
    'Cost and Timeline',
    `Expected cost range: ${details.cost}`,
    `Timeline: ${details.timeline}`,
    `ROI timeline: ${details.roiTimeline}`,
    '',
    'Why',
    details.why,
    '',
    'Category Breakdown',
    ...categoryLines,
    '',
    'Priority Issues',
    ...priorityIssues.map((item, index) => `${index + 1}. ${item.question.question} Answer: ${item.selected?.label ?? 'Not answered'}`),
    '',
    'What You Get',
    ...details.whatYouGet.map((item) => `- ${item}`),
    '',
    'Risks',
    ...details.risks.map((item) => `- ${item}`),
    '',
    'What If You Choose Wrong',
    details.whatIfWrong,
    '',
    'Full Quiz Breakdown',
    ...answerLines.map((line) => `\n${line}`),
    '',
    'Next Step',
    `${details.ctaMessage} Visit https://kreativereflow.com/contact`,
  ].join('\n');
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-[#FC6E20]">
      [ {children} ]
    </p>
  );
}

export function WebsiteRebuildRefreshQuizClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadBusiness, setLeadBusiness] = useState('');
  const [reportReady, setReportReady] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportStatusMessage, setReportStatusMessage] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const activeCategory = categories[currentQuestion.category];
  const ActiveCategoryIcon = activeCategory.icon;
  const selectedAnswer = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / quizQuestions.length) * 100);
  const result = useMemo(() => calculateDecision(answers), [answers]);
  const pathDetails = useMemo(() => getPathDetails(result), [result]);
  const priorityIssues = useMemo(() => getPriorityIssues(answers), [answers]);

  const handleAnswer = (value: string) => {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
    setReportReady(false);
    setReportError('');
    setReportStatusMessage('');
  };

  const goNext = () => {
    if (currentIndex >= quizQuestions.length - 1) {
      setShowResults(true);
      return;
    }

    setCurrentIndex((current) => current + 1);
  };

  const goPrevious = () => {
    if (showResults) {
      setShowResults(false);
      setCurrentIndex(quizQuestions.length - 1);
      return;
    }

    setCurrentIndex((current) => Math.max(0, current - 1));
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
    setLeadName('');
    setLeadEmail('');
    setLeadBusiness('');
    setReportReady(false);
    setReportError('');
    setReportStatusMessage('');
    setIsSubmittingReport(false);
  };

  const buildCurrentReport = () =>
    buildReportText({
      answers,
      details: pathDetails,
      lead: {
        name: leadName,
        email: leadEmail,
        business: leadBusiness,
      },
      priorityIssues,
      result,
    });

  const currentResultSummary = () => ({
    path: result.path,
    score: formatScore(result.score),
    recommendation: pathDetails.title,
    confidence: result.confidence,
  });

  const buildCurrentReportHtml = (reportText: string) =>
    buildBrandedReportHtml({
      reportText,
      reportTitle: 'Website Scope Decision Plan',
      toolName: 'Website Rebuild vs Refresh Quiz',
      sourcePath: '/tools/website-rebuild-vs-refresh-quiz',
      lead: {
        name: leadName,
        email: leadEmail,
        business: leadBusiness,
      },
      resultSummary: currentResultSummary(),
    });

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmittingReport(true);
    setReportError('');

    try {
      const reportText = buildCurrentReport();

      const submission = await submitLeadCapture({
        type: 'tool-report',
        toolId: 'website-rebuild-vs-refresh-quiz',
        toolName: 'Website Rebuild vs Refresh Quiz',
        sourcePath: '/tools/website-rebuild-vs-refresh-quiz',
        lead: {
          name: leadName,
          email: leadEmail,
          business: leadBusiness,
        },
        reportTitle: 'Website Scope Decision Plan',
        reportFileName: 'website-rebuild-vs-refresh-quiz-report.pdf',
        reportText,
        reportHtml: buildCurrentReportHtml(reportText),
        resultSummary: currentResultSummary(),
      });

      setReportStatusMessage(submission.message);
      setReportReady(true);
    } catch (error) {
      setReportError(getLeadCaptureErrorMessage(error));
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const downloadReport = async () => {
    setReportError('');
    const reportText = buildCurrentReport();

    try {
      await downloadPdfReport({
        type: 'tool-report',
        toolId: 'website-rebuild-vs-refresh-quiz',
        toolName: 'Website Rebuild vs Refresh Quiz',
        sourcePath: '/tools/website-rebuild-vs-refresh-quiz',
        lead: {
          name: leadName,
          email: leadEmail,
          business: leadBusiness,
        },
        reportTitle: 'Website Scope Decision Plan',
        reportFileName: 'website-rebuild-vs-refresh-quiz-report.pdf',
        reportText,
        reportHtml: buildCurrentReportHtml(reportText),
        resultSummary: currentResultSummary(),
      });
    } catch (error) {
      setReportError(getLeadCaptureErrorMessage(error));
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F0EFED] text-[#151419] dark:bg-[#151419] dark:text-[#FBFBFB]">
      <section className="relative isolate overflow-x-hidden bg-[#151419] text-[#FBFBFB]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(251,251,251,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(251,251,251,0.04)_1px,transparent_1px)] bg-[size:clamp(72px,10vw,156px)_clamp(72px,10vw,156px)]" />
        <div className="content-gutter grid gap-12 pb-16 pt-28 md:pb-24 md:pt-36 lg:min-h-screen lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <SectionLabel>Website Rebuild vs Refresh Quiz</SectionLabel>
            <h1 className="mt-6 max-w-4xl font-playfair text-5xl font-bold leading-none text-[#FBFBFB] md:text-7xl lg:text-8xl">
              Decide the scope before you spend the budget<span className="text-[#FC6E20]">.</span>
            </h1>
            <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#F0EFED]/76 md:text-lg">
              A weighted decision framework for business owners who are not
              sure whether the site needs a full rebuild, a design and content
              refresh, or focused optimization.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['17 questions', '100-point decision'],
                ['3 paths', 'Rebuild / refresh / optimize'],
                ['Forced triggers', 'Critical issues override score'],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/10 bg-white/[0.035] p-4">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787]">
                    {label}
                  </p>
                  <p className="mt-3 font-mono text-sm text-[#FBFBFB]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#1B1B1E] p-5 shadow-2xl shadow-black/25 md:p-7 lg:p-9">
            {!showResults ? (
              <section>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                      {activeCategory.name}
                    </p>
                    <h2 className="mt-3 font-playfair text-4xl font-bold leading-none text-[#FBFBFB] md:text-5xl">
                      {currentQuestion.question}
                    </h2>
                  </div>
                  <ActiveCategoryIcon className="hidden h-10 w-10 text-[#FC6E20] md:block" strokeWidth={1.5} />
                </div>

                <p className="mt-5 font-montserrat text-sm leading-7 text-[#F0EFED]/64">
                  {currentQuestion.helpText}
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.16em] text-[#878787]">
                    <span>
                      Question {currentIndex + 1}/{quizQuestions.length}
                    </span>
                    <span>{progressPercentage}% complete</span>
                  </div>
                  <div className="mt-3 h-1.5 bg-white/10">
                    <div
                      className="h-full bg-[#FC6E20] transition-[width] duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-7 grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const active = selectedAnswer === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleAnswer(option.value)}
                        className={`grid min-h-[4.5rem] grid-cols-[1rem_1fr_auto] items-center gap-4 border p-4 text-left transition-colors ${
                          active
                            ? 'border-[#FC6E20] bg-[#FC6E20] text-[#151419]'
                            : 'border-white/10 bg-white/[0.035] text-[#FBFBFB] hover:border-[#FC6E20]/70'
                        }`}
                      >
                        <span
                          className={`h-4 w-4 border ${
                            active ? 'border-[#151419] bg-[#151419]' : 'border-white/35'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="font-montserrat text-sm font-bold leading-6">
                          {option.label}
                        </span>
                        <span
                          className={`font-mono text-xs uppercase tracking-[0.14em] ${
                            active ? 'text-[#151419]/70' : 'text-[#FC6E20]'
                          }`}
                        >
                          {optionScoreLabel(currentQuestion, option)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={currentIndex === 0}
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/12 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#FBFBFB] transition-colors hover:border-[#FC6E20] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!selectedAnswer}
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {currentIndex >= quizQuestions.length - 1 ? 'See recommendation' : 'Next check'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </section>
            ) : (
              <ResultsView
                details={pathDetails}
                leadBusiness={leadBusiness}
                leadEmail={leadEmail}
                leadName={leadName}
                onDownload={downloadReport}
                onLeadBusinessChange={setLeadBusiness}
                onLeadEmailChange={setLeadEmail}
                onLeadNameChange={setLeadName}
                onLeadSubmit={handleLeadSubmit}
                onReset={resetQuiz}
                onPrevious={goPrevious}
                priorityIssues={priorityIssues}
                reportReady={reportReady}
                reportError={reportError}
                reportStatusMessage={reportStatusMessage}
                isSubmittingReport={isSubmittingReport}
                result={result}
              />
            )}
          </div>
        </div>
      </section>

      <section className="content-gutter py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <SectionLabel>Decision logic</SectionLabel>
            <h2 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-none text-[#151419] dark:text-[#FBFBFB] md:text-6xl">
              Three scopes. Very different budgets<span className="text-[#FC6E20]">.</span>
            </h2>
            <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
              The expensive mistake is choosing the wrong scope. This quiz
              separates technical rebuild problems from design refresh problems
              and smaller optimization opportunities.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Rebuild', 'New foundation for old, insecure, broken, or integration-hostile sites.'],
              ['Refresh', 'Better design, messaging, trust, and UX when the foundation still works.'],
              ['Optimize', 'Speed, SEO, conversion, and content improvements for a solid site.'],
            ].map(([title, body]) => (
              <article
                key={title}
                className="min-h-[16rem] border border-[#151419]/12 bg-[#FBFBFB] p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]"
              >
                <Wrench className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.7} />
                <h3 className="mt-8 font-montserrat text-sm font-bold uppercase text-[#151419] dark:text-[#FBFBFB]">
                  {title}
                </h3>
                <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62 dark:text-[#FBFBFB]/58">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-gutter pb-24 md:pb-32">
        <div className="border border-[#151419]/12 bg-[#151419] p-7 text-[#FBFBFB] md:p-10 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionLabel>Need the scope checked?</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-4xl font-bold leading-none md:text-6xl">
                Bring the result. We will turn it into a practical build plan<span className="text-[#FC6E20]">.</span>
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
            >
              Book scope audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResultsView({
  details,
  leadBusiness,
  leadEmail,
  leadName,
  onDownload,
  onLeadBusinessChange,
  onLeadEmailChange,
  onLeadNameChange,
  onLeadSubmit,
  onPrevious,
  onReset,
  priorityIssues,
  reportReady,
  reportError,
  reportStatusMessage,
  isSubmittingReport,
  result,
}: {
  details: PathDetails;
  leadBusiness: string;
  leadEmail: string;
  leadName: string;
  onDownload: () => void;
  onLeadBusinessChange: (value: string) => void;
  onLeadEmailChange: (value: string) => void;
  onLeadNameChange: (value: string) => void;
  onLeadSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPrevious: () => void;
  onReset: () => void;
  priorityIssues: ReturnType<typeof getPriorityIssues>;
  reportReady: boolean;
  reportError: string;
  reportStatusMessage: string;
  isSubmittingReport: boolean;
  result: DecisionResult;
}) {
  const ToneIcon =
    details.tone === 'critical' ? ShieldAlert : details.tone === 'warning' ? RefreshCw : CheckCircle2;

  return (
    <div>
      <div className={`border p-5 md:p-7 ${toneClasses(details.tone)}`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
              Recommended path
            </p>
            <h2 className="mt-4 font-playfair text-5xl font-bold leading-none md:text-7xl">
              {details.title}
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FBFBFB]">
            <ToneIcon className="h-4 w-4 text-[#FC6E20]" strokeWidth={1.7} />
            {result.confidence} confidence
          </div>
        </div>
        <p className="mt-6 max-w-4xl font-montserrat text-sm leading-7 text-[#F0EFED]/72">
          {details.description}
        </p>
        <p className="mt-4 max-w-4xl font-montserrat text-sm leading-7 text-[#F0EFED]/72">
          {details.why}
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {[
          ['Score', `${formatScore(result.score)}/100`],
          ['Cost range', details.cost],
          ['Timeline', details.timeline],
          ['ROI timeline', details.roiTimeline],
        ].map(([label, value]) => (
          <article key={label} className="border border-white/10 bg-white/[0.035] p-4">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787]">
              {label}
            </p>
            <p className="mt-4 font-playfair text-2xl font-bold leading-none text-[#FBFBFB]">
              {value}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {categoryOrder.map((categoryId) => {
          const category = categories[categoryId];
          const score = result.categoryScores[categoryId];
          const Icon = category.icon;

          return (
            <article key={categoryId} className="border border-white/10 bg-white/[0.035] p-4">
              <Icon className="h-4 w-4 text-[#FC6E20]" strokeWidth={1.7} />
              <p className="mt-5 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#878787]">
                {category.name}
              </p>
              <p className="mt-3 font-mono text-sm text-[#FBFBFB]">
                {formatScore(score.earned)}/{score.possible}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.86fr]">
        <div>
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Priority issues
          </p>
          <div className="mt-4 grid gap-3">
            {priorityIssues.map((item, index) => (
              <div key={item.question.id} className="grid gap-4 border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[2rem_1fr]">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FC6E20]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-montserrat text-sm font-bold leading-6 text-[#FBFBFB]">
                    {item.question.question}
                  </p>
                  <p className="mt-2 font-montserrat text-sm leading-7 text-[#F0EFED]/64">
                    Answer: {item.selected?.label ?? 'Not answered'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onPrevious}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/12 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to answers
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/12 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
            >
              <RotateCcw className="h-4 w-4" />
              Start over
            </button>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
            >
              {details.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="border border-[#FC6E20]/35 bg-[#FC6E20]/10 p-5 md:p-6">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Downloadable decision plan
          </p>
          <h3 className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#FBFBFB]">
            Keep the scope recommendation<span className="text-[#FC6E20]">.</span>
          </h3>
          <p className="mt-4 font-montserrat text-sm leading-7 text-[#F0EFED]/62">
            The report includes your score, category breakdown, forced triggers,
            recommended scope, cost range, risks, and the wrong-scope warning.
          </p>

          {!reportReady ? (
            <form onSubmit={onLeadSubmit} className="mt-6 grid gap-3">
              <input
                value={leadName}
                onChange={(event) => onLeadNameChange(event.target.value)}
                placeholder="Your name"
                className="min-h-12 border border-white/12 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none placeholder:text-[#878787] focus:border-[#FC6E20]"
              />
              <input
                value={leadEmail}
                onChange={(event) => onLeadEmailChange(event.target.value)}
                type="email"
                placeholder="Email address"
                required
                className="min-h-12 border border-white/12 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none placeholder:text-[#878787] focus:border-[#FC6E20]"
              />
              <input
                value={leadBusiness}
                onChange={(event) => onLeadBusinessChange(event.target.value)}
                placeholder="Business name"
                className="min-h-12 border border-white/12 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none placeholder:text-[#878787] focus:border-[#FC6E20]"
              />
              <button
                type="submit"
                disabled={isSubmittingReport}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSubmittingReport ? 'Preparing report' : 'Unlock report'}
                <ArrowRight className="h-4 w-4" />
              </button>
              {reportError ? (
                <p className="font-montserrat text-xs leading-6 text-red-200">
                  {reportError}
                </p>
              ) : null}
            </form>
          ) : (
            <div className="mt-6">
              <p className="flex items-start gap-3 border border-[#FC6E20]/30 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-7 text-[#F0EFED]/76">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#FC6E20]" />
                {reportStatusMessage || 'Your report is ready. You can download it now.'}
              </p>
              <button
                type="button"
                onClick={onDownload}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FBFBFB] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FC6E20]"
              >
                <ClipboardList className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="border border-white/10 bg-white/[0.035] p-5">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            What you get
          </p>
          <ul className="mt-5 grid gap-3 font-montserrat text-sm leading-7 text-[#F0EFED]/68">
            {details.whatYouGet.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-[#FC6E20]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="border border-white/10 bg-white/[0.035] p-5">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            If you choose wrong
          </p>
          <p className="mt-5 font-montserrat text-sm leading-7 text-[#F0EFED]/68">
            {details.whatIfWrong}
          </p>
          <p className="mt-6 font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#878787]">
            Main risks
          </p>
          <ul className="mt-4 grid gap-2 font-montserrat text-sm leading-7 text-[#F0EFED]/62">
            {details.risks.map((risk) => (
              <li key={risk}>- {risk}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
