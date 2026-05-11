'use client';

import type React from 'react';
import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Gauge,
  Laptop,
  Loader2,
  MapPin,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react';
import {
  buildBrandedReportHtml,
  downloadPdfReport,
  getLeadCaptureErrorMessage,
  submitLeadCapture,
} from '@/lib/lead-capture';

type CategoryId = 'speed' | 'mobile' | 'value_prop' | 'trust' | 'cta_forms';

type ScorecardOption = {
  label: string;
  value: string;
  points: number;
  description?: string;
  diagnostic?: string;
};

type ScorecardQuestion = {
  id: string;
  category: CategoryId;
  weight: number;
  question: string;
  helpText: string;
  fix: string;
  options: ScorecardOption[];
};

type CategoryScore = {
  earned: number;
  possible: number;
};

type ScoreResult = {
  total: number;
  percentage: number;
  categoryScores: Record<CategoryId, CategoryScore>;
  interpretation: ScoreInterpretation;
};

type ScoreInterpretation = {
  range: string;
  title: string;
  tone: 'strong' | 'warning' | 'danger' | 'critical';
  diagnosis: string;
  recommendations: string[];
  ctaText: string;
  ctaMessage: string;
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
  speed: {
    name: 'Speed & Technical',
    maxPoints: 25,
    description: 'How fast and secure the site feels before trust can even begin.',
    icon: Timer,
  },
  mobile: {
    name: 'Mobile Experience',
    maxPoints: 20,
    description: 'How easy it is for a phone visitor to read, tap, call, or message.',
    icon: PhoneCall,
  },
  value_prop: {
    name: 'Value Proposition',
    maxPoints: 15,
    description: 'How quickly a first-time visitor understands the offer and location.',
    icon: MapPin,
  },
  trust: {
    name: 'Trust Signals',
    maxPoints: 20,
    description: 'How credible the business feels in a scam-conscious market.',
    icon: ShieldCheck,
  },
  cta_forms: {
    name: 'CTAs & Forms',
    maxPoints: 20,
    description: 'How obvious and low-friction the next step feels.',
    icon: ClipboardCheck,
  },
};

const scorecardQuestions: ScorecardQuestion[] = [
  {
    id: 'speed_mobile_load_time',
    category: 'speed',
    weight: 10,
    question: 'How fast does your website load on mobile?',
    helpText:
      'Test this on a real phone using mobile data, not WiFi. Slow mobile loading often kills the enquiry before the visitor sees the offer.',
    fix: 'Test the homepage on mobile data, compress heavy media, remove slow scripts, and aim for a sub-three-second load.',
    options: [
      { label: 'Under 2 seconds', value: 'under_2s', points: 10, description: 'Excellent' },
      { label: '2-3 seconds', value: '2_3s', points: 5, description: 'Acceptable' },
      { label: '3-5 seconds', value: '3_5s', points: 2, description: 'Slow, losing leads' },
      { label: 'Over 5 seconds', value: 'over_5s', points: 0, description: 'Critical problem' },
      { label: "I don't know", value: 'unknown', points: 0, description: 'Test at pagespeed.web.dev' },
    ],
  },
  {
    id: 'speed_lcp',
    category: 'speed',
    weight: 10,
    question: 'What is your Largest Contentful Paint score?',
    helpText:
      'LCP measures how fast the main content loads. Check the mobile result at pagespeed.web.dev. Only a good score counts here.',
    fix: 'Improve the main hero load by reducing image weight, prioritizing above-fold content, and removing render-blocking assets.',
    options: [
      { label: 'Under 2.5 seconds, good', value: 'good', points: 10 },
      { label: '2.5-4 seconds, needs improvement', value: 'needs_improvement', points: 0 },
      { label: 'Over 4 seconds, poor', value: 'poor', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'speed_https',
    category: 'speed',
    weight: 5,
    question: 'Does your website have HTTPS?',
    helpText:
      'Look for the padlock icon in the browser. Browser warnings make visitors doubt the business before they read a word.',
    fix: 'Install or renew the SSL certificate so every public page loads over HTTPS.',
    options: [
      { label: 'Yes', value: 'yes', points: 5 },
      { label: 'No', value: 'no', points: 0 },
    ],
  },
  {
    id: 'mobile_responsive',
    category: 'mobile',
    weight: 10,
    question: 'Is your website fully optimized for mobile devices?',
    helpText:
      'Use a real phone. Text should be readable, buttons should be easy to tap, and the page should not need horizontal scrolling.',
    fix: 'Fix responsive layout issues first: readable text, tap-friendly buttons, clean spacing, and no sideways scrolling.',
    options: [
      { label: 'Fully responsive, no zooming, scrolling, or overlap needed', value: 'fully_responsive', points: 10 },
      { label: 'Mostly works, but some text is small or cramped', value: 'mostly_works', points: 3 },
      { label: 'Desktop site squished to mobile, hard to use', value: 'desktop_squished', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'mobile_click_to_call',
    category: 'mobile',
    weight: 5,
    question: 'On mobile, is your phone number instantly tappable?',
    helpText:
      'A click-to-call button should be visible without hunting. Many South African service enquiries start with a call.',
    fix: 'Add a mobile-visible click-to-call action and make sure the phone number uses a proper tel link.',
    options: [
      { label: 'Yes, sticky button always visible at top or bottom', value: 'sticky_visible', points: 5 },
      { label: 'Yes, but you have to scroll to find it', value: 'must_scroll', points: 2 },
      { label: 'Phone number is shown as text only', value: 'text_only', points: 0 },
      { label: 'No phone number on the site', value: 'no_phone', points: 0 },
    ],
  },
  {
    id: 'mobile_whatsapp',
    category: 'mobile',
    weight: 5,
    question: 'Do you have a WhatsApp contact button on your website?',
    helpText:
      'WhatsApp is a normal business communication channel in South Africa. If visitors prefer it, the site should not fight them.',
    fix: 'Add a visible WhatsApp action on key pages, especially mobile service and contact paths.',
    options: [
      { label: 'Yes, sticky WhatsApp button visible on all pages', value: 'sticky_all_pages', points: 5 },
      { label: 'Yes, but you have to scroll to find it', value: 'must_scroll', points: 2 },
      { label: 'WhatsApp is only listed in the footer or contact page', value: 'footer_only', points: 1 },
      { label: 'No WhatsApp contact option', value: 'no_whatsapp', points: 0 },
    ],
  },
  {
    id: 'value_hero_headline',
    category: 'value_prop',
    weight: 10,
    question: 'Can someone understand what you do in three seconds?',
    helpText:
      "The hero headline should make the offer obvious. Avoid vague lines like 'innovative solutions' or 'your trusted partner.'",
    fix: 'Rewrite the hero headline so it names the service, audience, and outcome in plain language.',
    options: [
      { label: "Yes, clear and specific, like 'Solar installation for Johannesburg homes'", value: 'clear_specific', points: 10 },
      { label: "Somewhat, it's there but vague or generic", value: 'vague', points: 3 },
      { label: 'No, the headline is unclear or missing', value: 'unclear', points: 0 },
    ],
  },
  {
    id: 'value_local_context',
    category: 'value_prop',
    weight: 5,
    question: 'Does your homepage clearly mention your location or service area?',
    helpText:
      "Examples: 'Serving Sandton and surrounds' or 'Johannesburg-based legal firm.' Local context builds trust and helps search.",
    fix: 'Add real service-area language above the fold and repeat it naturally on service pages.',
    options: [
      { label: 'Yes, location or suburbs are mentioned prominently', value: 'yes', points: 5 },
      { label: 'No, location is generic or missing', value: 'no', points: 0 },
    ],
  },
  {
    id: 'trust_reviews',
    category: 'trust',
    weight: 10,
    question: 'How many recent reviews or testimonials are visible on your homepage?',
    helpText:
      'Recent proof matters. Visitors want to know real people trusted the business and got a result.',
    fix: 'Add recent reviews or testimonials near the decision points, ideally with names, context, and service detail.',
    options: [
      { label: '10+ recent reviews visible', value: '10_plus', points: 10 },
      { label: '5-9 reviews visible', value: '5_9', points: 7 },
      { label: '1-4 reviews visible', value: '1_4', points: 3 },
      { label: 'No reviews or testimonials visible', value: 'none', points: 0 },
    ],
  },
  {
    id: 'trust_address_phone',
    category: 'trust',
    weight: 5,
    question: 'Are your physical address and South African phone number visible?',
    helpText:
      'A local phone number and physical address reduce doubt, especially for high-trust services.',
    fix: 'Show a South African phone number and a real location or service-area address where trust decisions happen.',
    options: [
      { label: 'Both address and +27 phone number are clearly visible', value: 'both', points: 5 },
      { label: 'One of the two is visible', value: 'one', points: 2 },
      { label: 'Neither is visible', value: 'neither', points: 0 },
    ],
  },
  {
    id: 'trust_real_photos',
    category: 'trust',
    weight: 5,
    question: 'Do you use real photos of your team or work?',
    helpText:
      'Real photos build authenticity. Stock imagery can make a serious service business feel interchangeable.',
    fix: 'Replace generic stock images with real team, premises, project, process, or work photos.',
    options: [
      { label: 'Real photos of team or work', value: 'real', points: 5 },
      { label: 'Mix of real and stock photos', value: 'mix', points: 2 },
      { label: 'Mostly or all stock photos', value: 'stock', points: 0 },
      { label: 'No photos of team or work', value: 'no_photos', points: 0 },
    ],
  },
  {
    id: 'cta_above_fold',
    category: 'cta_forms',
    weight: 10,
    question: 'Is your primary call-to-action button visible without scrolling?',
    helpText:
      "The CTA should be clear, high-contrast, and visible on both mobile and desktop. It should answer, 'What do I do next?'",
    fix: 'Place one clear primary action above the fold and make it visually distinct on mobile and desktop.',
    options: [
      { label: 'Yes, clear high-contrast button above fold on mobile and desktop', value: 'clear_visible', points: 10 },
      { label: "Yes, but it's weak, small, or blends in", value: 'weak', points: 3 },
      { label: 'No, CTA is below the fold or unclear', value: 'below_fold', points: 0 },
    ],
  },
  {
    id: 'cta_form_fields',
    category: 'cta_forms',
    weight: 5,
    question: 'How many fields does your main contact form have?',
    helpText:
      'Long forms create friction before trust has been earned. Keep first-contact forms light.',
    fix: 'Reduce first-contact forms to name, email or phone, and a short message. Qualify later.',
    options: [
      { label: '3-4 fields maximum', value: '3_4', points: 5 },
      { label: '5-6 fields', value: '5_6', points: 2 },
      { label: '7 or more fields', value: '7_plus', points: 0 },
      { label: 'No contact form on site', value: 'no_form', points: 0 },
    ],
  },
  {
    id: 'cta_button_copy',
    category: 'cta_forms',
    weight: 5,
    question: 'What does your main call-to-action button say?',
    helpText:
      "Specific action copy converts better. 'Get My Quote' is stronger than 'Submit' because it names the outcome.",
    fix: "Use action-oriented copy such as 'Get My Quote,' 'Book Free Consultation,' or 'Request Callback.'",
    options: [
      { label: "Specific action, like 'Get My Quote' or 'Request Callback'", value: 'specific_action', points: 5 },
      { label: "Generic, like 'Submit,' 'Contact Us,' 'Learn More,' or 'Click Here'", value: 'generic', points: 0 },
    ],
  },
  {
    id: 'speed_inp',
    category: 'speed',
    weight: 0,
    question: 'How responsive is your site to clicks and taps? (INP score)',
    helpText:
      'Interaction to Next Paint measures responsiveness. Check at pagespeed.web.dev. This is diagnostic and helps us understand your speed issues better.',
    fix: 'Review interaction delays, heavy scripts, and button responses if taps feel slow.',
    options: [
      { label: 'Under 200ms, Good', value: 'under_200', points: 0, diagnostic: 'excellent_interactivity' },
      { label: '200-500ms, Needs Improvement', value: '200_500', points: 0, diagnostic: 'slow_interactivity' },
      { label: 'Over 500ms, Poor', value: 'over_500', points: 0, diagnostic: 'critical_interactivity' },
      { label: "I don't know", value: 'unknown', points: 0, diagnostic: 'unknown' },
    ],
  },
  {
    id: 'speed_cls',
    category: 'speed',
    weight: 0,
    question: 'Do page elements jump around while loading?',
    helpText:
      'Cumulative Layout Shift measures visual stability. If buttons move as the page loads, users click the wrong thing.',
    fix: 'Reserve layout space for images, embeds, and banners so important buttons do not move while loading.',
    options: [
      { label: 'No jumping, everything loads in place', value: 'stable', points: 0, diagnostic: 'stable_layout' },
      { label: 'Some elements shift slightly', value: 'some_shift', points: 0, diagnostic: 'minor_cls' },
      { label: 'Yes, significant jumping and shifting', value: 'significant', points: 0, diagnostic: 'major_cls' },
      { label: "I don't know", value: 'unknown', points: 0, diagnostic: 'unknown' },
    ],
  },
  {
    id: 'speed_image_optimization',
    category: 'speed',
    weight: 0,
    question: 'Are your images optimized, compressed, and using WebP format?',
    helpText:
      'Large unoptimized images are the #1 cause of slow sites. Check your image file sizes. Each key image should usually be under 200KB.',
    fix: 'Compress large images, convert suitable assets to WebP, and keep key images lightweight.',
    options: [
      { label: 'Yes, all images are compressed and use WebP format', value: 'optimized', points: 0, diagnostic: 'optimized_images' },
      { label: 'Some are optimized, some are not', value: 'mixed', points: 0, diagnostic: 'mixed_images' },
      { label: 'No, the site uses large PNG or JPG files', value: 'not_optimized', points: 0, diagnostic: 'heavy_images' },
      { label: "I don't know", value: 'unknown', points: 0, diagnostic: 'unknown' },
    ],
  },
  {
    id: 'mobile_tap_targets',
    category: 'mobile',
    weight: 0,
    question: 'On mobile, are buttons and links easy to tap accurately?',
    helpText:
      'Buttons should be at least 44x44 pixels with space between them. Tiny buttons or links too close together frustrate users.',
    fix: 'Increase tap target size and spacing for buttons, links, and form controls on mobile.',
    options: [
      { label: 'Yes, all buttons are large and well-spaced', value: 'good', points: 0, diagnostic: 'good_tap_targets' },
      { label: 'Mostly, but a few are too small', value: 'mostly', points: 0, diagnostic: 'minor_tap_issues' },
      { label: 'No, buttons are small and hard to tap', value: 'poor', points: 0, diagnostic: 'poor_tap_targets' },
    ],
  },
  {
    id: 'mobile_form_ux',
    category: 'mobile',
    weight: 0,
    question: 'On mobile, does your contact form show the right keyboard for each field?',
    helpText:
      'Email fields should show an @ keyboard. Phone fields should show a number pad. This speeds up form completion.',
    fix: 'Use proper input types and inputMode values so mobile keyboards match email, phone, and numeric fields.',
    options: [
      { label: 'Yes, correct keyboard for each field type', value: 'yes', points: 0, diagnostic: 'optimized_keyboards' },
      { label: 'No, generic keyboard for everything', value: 'no', points: 0, diagnostic: 'poor_form_ux' },
      { label: "I don't know", value: 'unknown', points: 0, diagnostic: 'unknown' },
    ],
  },
  {
    id: 'value_usp',
    category: 'value_prop',
    weight: 0,
    question: 'What makes you different from competitors? Is it clear on your homepage?',
    helpText:
      'Your Unique Selling Proposition should be obvious. Why should someone choose you over competitors?',
    fix: 'Bring the unique reason to choose the business into the hero, proof, and service sections.',
    options: [
      { label: 'Very clear, USP is prominently stated', value: 'clear', points: 0, diagnostic: 'strong_usp' },
      { label: 'Somewhat clear but buried', value: 'buried', points: 0, diagnostic: 'weak_usp' },
      { label: 'Not clear at all, looks like everyone else', value: 'missing', points: 0, diagnostic: 'no_usp' },
    ],
  },
  {
    id: 'trust_security_badges',
    category: 'trust',
    weight: 0,
    question: 'Do you display security or trust badges, like SSL, payment security, or industry certifications?',
    helpText:
      'Trust badges can increase conversions when they are credible and placed near high-friction actions. Examples include Secure Checkout, SABS Approved, or Law Society Member.',
    fix: 'Display credible security, payment, industry, or membership trust markers near high-friction actions.',
    options: [
      { label: 'Yes, visible security or trust badges', value: 'yes', points: 0, diagnostic: 'has_trust_badges' },
      { label: 'No, no badges displayed', value: 'no', points: 0, diagnostic: 'no_trust_badges' },
    ],
  },
  {
    id: 'trust_social_proof',
    category: 'trust',
    weight: 0,
    question: "Do you show how many customers you've served, projects completed, or years in business?",
    helpText:
      'Numbers build credibility. 500+ happy clients or 15 years serving Johannesburg creates trust when the claim is true.',
    fix: 'Add honest proof numbers such as customers served, years active, projects completed, or locations covered.',
    options: [
      { label: 'Yes, specific numbers are prominently displayed', value: 'yes', points: 0, diagnostic: 'has_social_proof' },
      { label: 'No, no quantitative proof', value: 'no', points: 0, diagnostic: 'no_social_proof' },
    ],
  },
  {
    id: 'cta_secondary',
    category: 'cta_forms',
    weight: 0,
    question: 'Do you have a secondary CTA for people not ready to commit?',
    helpText:
      'Example: primary CTA is Book Consultation. Secondary CTA could be View Our Work or Download Guide. It gives hesitant visitors another path.',
    fix: 'Add a lower-commitment next step such as view work, download guide, compare services, or see pricing guidance.',
    options: [
      { label: 'Yes, secondary CTA available', value: 'yes', points: 0, diagnostic: 'has_secondary_cta' },
      { label: 'No, only one CTA option', value: 'no', points: 0, diagnostic: 'single_cta_only' },
    ],
  },
  {
    id: 'cta_urgency',
    category: 'cta_forms',
    weight: 0,
    question: 'Do you use any urgency or scarcity tactics on your site?',
    helpText:
      'Examples include limited spots available, free consultation this week only, or 3 emergency slots left today. This can boost conversions if used honestly.',
    fix: 'Use honest urgency only when true, such as limited consultation slots or time-bound offers.',
    options: [
      { label: 'Yes, using urgency or scarcity', value: 'yes', points: 0, diagnostic: 'uses_urgency' },
      { label: 'No, no urgency messaging', value: 'no', points: 0, diagnostic: 'no_urgency' },
    ],
  },
  {
    id: 'navigation_clarity',
    category: 'value_prop',
    weight: 0,
    question: 'How many clicks does it take to reach your most important page, like services, pricing, or contact?',
    helpText:
      'Best practice: key pages should be 1-2 clicks from the homepage. Every extra click loses momentum.',
    fix: 'Keep priority pages within 1-2 clicks from the homepage and make the path obvious in navigation.',
    options: [
      { label: '1-2 clicks', value: '1_2', points: 0, diagnostic: 'good_navigation' },
      { label: '3 clicks', value: '3', points: 0, diagnostic: 'acceptable_navigation' },
      { label: '4+ clicks or unclear how to get there', value: '4_plus', points: 0, diagnostic: 'poor_navigation' },
    ],
  },
];

const categoryOrder: CategoryId[] = ['speed', 'mobile', 'value_prop', 'trust', 'cta_forms'];

function getScoreInterpretation(score: number): ScoreInterpretation {
  if (score >= 80) {
    return {
      range: '80-100',
      title: 'Lead Machine',
      tone: 'strong',
      diagnosis:
        'Your website has a strong foundation across speed, mobile, trust, clarity, and conversion flow.',
      recommendations: [
        'Run small A/B tests on CTA copy and button placement.',
        'Add deeper case studies and specific testimonials.',
        'Consider advanced conversion tactics such as chat, dynamic content, or exit-intent prompts.',
      ],
      ctaText: 'Book Strategy Consultation',
      ctaMessage: "Your site is strong. Let's optimize and scale the next layer.",
    };
  }

  if (score >= 60) {
    return {
      range: '60-79',
      title: 'Optimization Needed',
      tone: 'warning',
      diagnosis:
        'You have a useful foundation, but a few leaks are probably weakening enquiries before visitors act.',
      recommendations: [
        'Add 5-10 recent Google reviews or testimonials to high-intent pages.',
        'Make WhatsApp and click-to-call actions obvious on mobile.',
        'Refine the hero headline so the offer and audience are specific.',
      ],
      ctaText: 'Book Free Audit',
      ctaMessage: "You have fixable leaks. We'll show you the top three changes.",
    };
  }

  if (score >= 40) {
    return {
      range: '40-59',
      title: 'Major Leaks',
      tone: 'danger',
      diagnosis:
        'Technical friction, weak trust, or unclear next steps are likely costing you leads every week.',
      recommendations: [
        'Reduce form fields to 3-4 maximum.',
        'Add sticky click-to-call and WhatsApp actions on mobile.',
        'Optimize images and bring load time under three seconds.',
        'Add physical address and South African phone number near key CTAs.',
      ],
      ctaText: 'Book Urgent Consultation',
      ctaMessage: "Major issues are costing leads daily. Let's build a 30-day fix plan.",
    };
  }

  return {
    range: '0-39',
    title: 'Critical Failure',
    tone: 'critical',
    diagnosis:
      'The site is probably damaging trust or wasting traffic. Critical blockers need to be fixed before more attention is sent to it.',
    recommendations: [
      'Pause paid traffic until the basics are fixed.',
      'Install or renew HTTPS.',
      'Make the site mobile responsive.',
      'Get load time under three seconds.',
      'Add one clear CTA above the fold.',
      'Add trust signals, reviews, phone number, and location context.',
    ],
    ctaText: 'Book Emergency Consultation',
    ctaMessage: 'Critical leaks need a clear fix or rebuild plan within 48 hours.',
  };
}

function calculateScore(answers: Record<string, string>): ScoreResult {
  const categoryScores = categoryOrder.reduce(
    (accumulator, categoryId) => ({
      ...accumulator,
      [categoryId]: {
        earned: 0,
        possible: categories[categoryId].maxPoints,
      },
    }),
    {} as Record<CategoryId, CategoryScore>,
  );

  let totalPoints = 0;

  scorecardQuestions.forEach((question) => {
    const answer = answers[question.id];
    const selectedOption = question.options.find((option) => option.value === answer);

    if (!selectedOption) return;

    totalPoints += selectedOption.points;
    categoryScores[question.category].earned += selectedOption.points;
  });

  const percentage = Math.round(totalPoints);

  return {
    total: totalPoints,
    percentage,
    categoryScores,
    interpretation: getScoreInterpretation(percentage),
  };
}

function getPriorityFixes(answers: Record<string, string>, fallback: string[]) {
  const missed = scorecardQuestions
    .map((question) => {
      const selectedValue = answers[question.id];
      const selectedOption = question.options.find((option) => option.value === selectedValue);
      const points = selectedOption?.points ?? 0;
      const lost = question.weight - points;

      return {
        question,
        selectedOption,
        lost,
        ratio: question.weight === 0 ? 0 : lost / question.weight,
      };
    })
    .filter((item) => item.lost > 0)
    .sort((a, b) => b.ratio - a.ratio || b.lost - a.lost);

  const fixes = missed.slice(0, 3).map((item) => item.question.fix);

  return fixes.length > 0 ? fixes : fallback.slice(0, 3);
}

function optionScoreLabel(question: ScorecardQuestion, option: ScorecardOption) {
  if (question.weight === 0) {
    return 'Diagnostic';
  }

  return `${option.points}/${question.weight}`;
}

function buildReportText({
  answers,
  lead,
  priorityFixes,
  result,
}: {
  answers: Record<string, string>;
  lead: { name: string; email: string; business: string };
  priorityFixes: string[];
  result: ScoreResult;
}) {
  const categoryLines = categoryOrder.map((categoryId) => {
    const category = categories[categoryId];
    const score = result.categoryScores[categoryId];
    return `${category.name}: ${score.earned}/${score.possible}`;
  });

  const answerLines = scorecardQuestions.map((question) => {
    const selected = question.options.find((option) => option.value === answers[question.id]);

    if (question.weight === 0) {
      return [
        question.question,
        `Answer: ${selected?.label ?? 'Not answered'}`,
        `Diagnostic signal: ${selected?.diagnostic ?? 'Not captured'}`,
        `Report note: ${question.fix}`,
      ].join('\n');
    }

    return [
      question.question,
      `Answer: ${selected?.label ?? 'Not answered'}`,
      `Score: ${selected?.points ?? 0}/${question.weight}`,
      selected && selected.points < question.weight ? `Fix: ${question.fix}` : 'Fix: Keep this strength in place.',
    ].join('\n');
  });

  return [
    'Website Lead Leak Scorecard Report',
    'Kreative Reflow',
    '',
    `Name: ${lead.name || 'Not provided'}`,
    `Email: ${lead.email || 'Not provided'}`,
    `Business: ${lead.business || 'Not provided'}`,
    '',
    `Score: ${result.percentage}/100`,
    `Result: ${result.interpretation.title} (${result.interpretation.range})`,
    'Score note: 14 scored checks determine the 100-point score. 11 diagnostic checks shape the report detail.',
    '',
    'Diagnosis',
    result.interpretation.diagnosis,
    '',
    'Category Breakdown',
    ...categoryLines,
    '',
    'Top Priority Fixes',
    ...priorityFixes.map((fix, index) => `${index + 1}. ${fix}`),
    '',
    'Quick Win Roadmap',
    'Hour 1: Add mobile click-to-call and WhatsApp actions. Make phone and location easier to find.',
    'Day 1: Reduce the main form to 3-4 fields and change generic CTA copy to a clear action.',
    'Week 1: Compress images, remove slow scripts, test mobile speed, and add recent reviews.',
    'Month 1: Improve local context, replace stock imagery, and build stronger service-page proof.',
    '',
    'Full Check Breakdown',
    ...answerLines.map((line) => `\n${line}`),
    '',
    'Next Step',
    `${result.interpretation.ctaMessage} Visit https://kreativereflow.com/contact`,
  ].join('\n');
}

function toneClasses(tone: ScoreInterpretation['tone']) {
  if (tone === 'strong') {
    return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100';
  }

  if (tone === 'warning') {
    return 'border-[#F5E16A]/35 bg-[#F5E16A]/10 text-[#FBFBFB]';
  }

  if (tone === 'danger') {
    return 'border-[#FC6E20]/45 bg-[#FC6E20]/12 text-[#FBFBFB]';
  }

  return 'border-red-400/45 bg-red-500/12 text-[#FBFBFB]';
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-[#FC6E20]">
      [ {children} ]
    </p>
  );
}

export function ScorecardClient() {
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

  const currentQuestion = scorecardQuestions[currentIndex];
  const activeCategory = categories[currentQuestion.category];
  const currentCategoryQuestions = scorecardQuestions.filter(
    (question) => question.category === currentQuestion.category,
  );
  const currentCategoryPosition =
    currentCategoryQuestions.findIndex((question) => question.id === currentQuestion.id) + 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / scorecardQuestions.length) * 100);
  const result = useMemo(() => calculateScore(answers), [answers]);
  const priorityFixes = useMemo(
    () => getPriorityFixes(answers, result.interpretation.recommendations),
    [answers, result.interpretation.recommendations],
  );
  const selectedAnswer = answers[currentQuestion.id];

  const handleAnswer = (value: string) => {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
  };

  const goNext = () => {
    if (currentIndex >= scorecardQuestions.length - 1) {
      setShowResults(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const goPrevious = () => {
    if (showResults) {
      setShowResults(false);
      setCurrentIndex(scorecardQuestions.length - 1);
      return;
    }

    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const resetScorecard = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResults(false);
    setReportReady(false);
    setReportError('');
    setReportStatusMessage('');
    setIsSubmittingReport(false);
    setLeadName('');
    setLeadEmail('');
    setLeadBusiness('');
  };

  const buildCurrentReport = () =>
    buildReportText({
      answers,
      lead: { name: leadName, email: leadEmail, business: leadBusiness },
      priorityFixes,
      result,
    });

  const currentResultSummary = () => ({
    score: result.percentage,
    range: result.interpretation.range,
    firstPriority: priorityFixes[0] || null,
  });

  const buildCurrentReportHtml = (reportText: string) =>
    buildBrandedReportHtml({
      reportText,
      reportTitle: 'Website Lead Leak Scorecard Action Plan',
      toolName: 'Website Lead Leak Scorecard',
      sourcePath: '/tools/website-lead-leak-scorecard',
      lead: { name: leadName, email: leadEmail, business: leadBusiness },
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
        toolId: 'website-lead-leak-scorecard',
        toolName: 'Website Lead Leak Scorecard',
        sourcePath: '/tools/website-lead-leak-scorecard',
        lead: { name: leadName, email: leadEmail, business: leadBusiness },
        reportTitle: 'Website Lead Leak Scorecard Action Plan',
        reportFileName: 'website-lead-leak-scorecard-report.pdf',
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
        toolId: 'website-lead-leak-scorecard',
        toolName: 'Website Lead Leak Scorecard',
        sourcePath: '/tools/website-lead-leak-scorecard',
        lead: { name: leadName, email: leadEmail, business: leadBusiness },
        reportTitle: 'Website Lead Leak Scorecard Action Plan',
        reportFileName: 'website-lead-leak-scorecard-report.pdf',
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
        <div className="content-gutter grid gap-12 pb-16 pt-28 md:pb-24 md:pt-36 lg:min-h-screen lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <SectionLabel>Website Lead Leak Scorecard</SectionLabel>
            <h1 className="mt-6 max-w-4xl font-playfair text-5xl font-bold leading-none text-[#FBFBFB] md:text-7xl lg:text-8xl">
              Find where your website is losing leads.
            </h1>
            <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#F0EFED]/76 md:text-lg">
              A five-category diagnostic for South African service businesses:
              speed, mobile experience, value clarity, trust signals, and the
              path from visit to enquiry.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['5 categories', '100-point score'],
                ['25 checks', '14 scored + 11 diagnostic'],
                ['Full report', 'Unlocked at result'],
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
              <section aria-live="polite">
                <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                      {activeCategory.name}
                    </p>
                    <p className="mt-3 max-w-xl font-montserrat text-sm leading-7 text-[#F0EFED]/64">
                      {activeCategory.description}
                    </p>
                  </div>
                  <div className="shrink-0 border border-white/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#878787]">
                    {currentCategoryPosition}/{currentCategoryQuestions.length}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.16em] text-[#878787]">
                    <span>
                      Question {currentIndex + 1}/{scorecardQuestions.length}
                    </span>
                    <span>{progressPercentage}% complete</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden bg-white/10">
                    <div
                      className="h-full bg-[#FC6E20] transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <h2 className="font-playfair text-3xl font-bold leading-tight text-[#FBFBFB] md:text-5xl">
                    {currentQuestion.question}
                  </h2>
                  <p className="mt-5 font-montserrat text-sm leading-7 text-[#F0EFED]/62 md:text-base">
                    {currentQuestion.helpText}
                  </p>

                  <div className="mt-8 grid gap-3">
                    {currentQuestion.options.map((option) => {
                      const active = selectedAnswer === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleAnswer(option.value)}
                          className={`group grid min-h-[76px] grid-cols-[1.5rem_1fr_auto] items-center gap-4 border p-4 text-left transition-colors ${
                            active
                              ? 'border-[#FC6E20] bg-[#FC6E20] text-[#151419]'
                              : 'border-white/10 bg-white/[0.035] text-[#FBFBFB] hover:border-[#FC6E20]'
                          }`}
                        >
                          <span
                            className={`h-4 w-4 border ${
                              active ? 'border-[#151419] bg-[#151419]' : 'border-white/35'
                            }`}
                            aria-hidden="true"
                          />
                          <span>
                            <span className="block font-montserrat text-sm font-bold leading-6">
                              {option.label}
                            </span>
                            {option.description ? (
                              <span
                                className={`mt-1 block font-montserrat text-xs leading-5 ${
                                  active ? 'text-[#151419]/72' : 'text-[#F0EFED]/48'
                                }`}
                              >
                                {option.description}
                              </span>
                            ) : null}
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
                    {currentIndex >= scorecardQuestions.length - 1 ? 'See result' : 'Next check'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </section>
            ) : (
              <ResultsView
                result={result}
                priorityFixes={priorityFixes}
                reportReady={reportReady}
                reportError={reportError}
                reportStatusMessage={reportStatusMessage}
                isSubmittingReport={isSubmittingReport}
                leadName={leadName}
                leadEmail={leadEmail}
                leadBusiness={leadBusiness}
                onLeadNameChange={setLeadName}
                onLeadEmailChange={setLeadEmail}
                onLeadBusinessChange={setLeadBusiness}
                onLeadSubmit={handleLeadSubmit}
                onDownloadReport={downloadReport}
                onPrevious={goPrevious}
                onReset={resetScorecard}
              />
            )}
          </div>
        </div>
      </section>

      <section className="content-gutter py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <SectionLabel>How to use the result</SectionLabel>
            <h2 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-none text-[#151419] dark:text-[#FBFBFB] md:text-6xl">
              Fix the leak in the right order.
            </h2>
            <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
              The score is useful, but the order matters more. Speed, mobile
              actions, trust, and form friction usually unlock more value than
              another cosmetic redesign.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Hour 1', 'Add mobile click-to-call and WhatsApp actions. Make phone and location easier to find.'],
              ['Day 1', 'Reduce the main form to 3-4 fields and replace generic CTA copy with a specific action.'],
              ['Week 1', 'Compress images, remove slow scripts, test mobile speed, and add recent reviews.'],
              ['Month 1', 'Improve local context, replace stock imagery, and build stronger service-page proof.'],
            ].map(([label, body]) => (
              <article
                key={label}
                className="border border-[#151419]/12 bg-[#FBFBFB] p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FC6E20]">
                  {label}
                </p>
                <p className="mt-5 font-montserrat text-sm leading-7 text-[#151419]/66 dark:text-[#FBFBFB]/62">
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
              <SectionLabel>Need a second pair of eyes?</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-4xl font-bold leading-none md:text-6xl">
                Bring the score. We will turn it into a practical fix plan.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
            >
              Book an audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResultsView({
  result,
  priorityFixes,
  reportReady,
  reportError,
  reportStatusMessage,
  isSubmittingReport,
  leadName,
  leadEmail,
  leadBusiness,
  onLeadNameChange,
  onLeadEmailChange,
  onLeadBusinessChange,
  onLeadSubmit,
  onDownloadReport,
  onPrevious,
  onReset,
}: {
  result: ScoreResult;
  priorityFixes: string[];
  reportReady: boolean;
  reportError: string;
  reportStatusMessage: string;
  isSubmittingReport: boolean;
  leadName: string;
  leadEmail: string;
  leadBusiness: string;
  onLeadNameChange: (value: string) => void;
  onLeadEmailChange: (value: string) => void;
  onLeadBusinessChange: (value: string) => void;
  onLeadSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDownloadReport: () => void;
  onPrevious: () => void;
  onReset: () => void;
}) {
  const interpretation = result.interpretation;

  return (
    <section aria-live="polite">
      <div className={`border p-5 ${toneClasses(interpretation.tone)}`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
              Your score
            </p>
            <h2 className="mt-4 font-playfair text-6xl font-bold leading-none md:text-8xl">
              {result.percentage}/100
            </h2>
          </div>
          <div className="inline-flex items-center gap-3 border border-white/10 bg-black/10 px-4 py-3">
            {interpretation.tone === 'strong' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-300" strokeWidth={1.7} />
            ) : interpretation.tone === 'warning' ? (
              <Gauge className="h-5 w-5 text-[#F5E16A]" strokeWidth={1.7} />
            ) : interpretation.tone === 'danger' ? (
              <Sparkles className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.7} />
            ) : (
              <Loader2 className="h-5 w-5 text-red-300" strokeWidth={1.7} />
            )}
            <span className="font-mono text-xs uppercase tracking-[0.16em]">
              {interpretation.range}
            </span>
          </div>
        </div>

        <h3 className="mt-8 font-playfair text-4xl font-bold leading-none">
          {interpretation.title}
        </h3>
        <p className="mt-5 font-montserrat text-sm leading-7 text-white/70">
          {interpretation.diagnosis}
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {categoryOrder.map((categoryId) => {
          const category = categories[categoryId];
          const score = result.categoryScores[categoryId];
          const Icon = category.icon;

          return (
            <article
              key={categoryId}
              className="border border-white/10 bg-white/[0.035] p-4 text-[#FBFBFB]"
            >
              <Icon className="h-4 w-4 text-[#FC6E20]" strokeWidth={1.7} />
              <p className="mt-5 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#878787]">
                {category.name}
              </p>
              <p className="mt-3 font-mono text-xl text-[#FBFBFB]">
                {score.earned}/{score.possible}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.86fr]">
        <div>
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Top priority fixes
          </p>
          <div className="mt-4 grid gap-3">
            {priorityFixes.map((fix, index) => (
              <div
                key={fix}
                className="grid grid-cols-[2rem_1fr] gap-4 border border-white/10 bg-white/[0.035] p-4"
              >
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FC6E20]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="font-montserrat text-sm leading-7 text-[#F0EFED]/70">
                  {fix}
                </p>
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
              Edit answers
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/12 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </button>
          </div>
        </div>

        <div className="border border-white/10 bg-white/[0.035] p-5">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Full report
          </p>
          <h3 className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#FBFBFB]">
            Get the downloadable action plan.
          </h3>
          <p className="mt-4 font-montserrat text-sm leading-7 text-[#F0EFED]/62">
            {interpretation.ctaMessage}
          </p>

          {!reportReady ? (
            <form onSubmit={onLeadSubmit} className="mt-6 grid gap-4">
              <label className="block">
                <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#878787]">
                  Name
                </span>
                <input
                  value={leadName}
                  onChange={(event) => onLeadNameChange(event.target.value)}
                  className="mt-2 min-h-12 w-full border border-white/10 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none transition-colors placeholder:text-[#878787] focus:border-[#FC6E20]"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#878787]">
                  Email
                </span>
                <input
                  value={leadEmail}
                  onChange={(event) => onLeadEmailChange(event.target.value)}
                  required
                  type="email"
                  inputMode="email"
                  className="mt-2 min-h-12 w-full border border-white/10 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none transition-colors placeholder:text-[#878787] focus:border-[#FC6E20]"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#878787]">
                  Business
                </span>
                <input
                  value={leadBusiness}
                  onChange={(event) => onLeadBusinessChange(event.target.value)}
                  className="mt-2 min-h-12 w-full border border-white/10 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none transition-colors placeholder:text-[#878787] focus:border-[#FC6E20]"
                  placeholder="Business name"
                  autoComplete="organization"
                />
              </label>
              <button
                type="submit"
                disabled={isSubmittingReport}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSubmittingReport ? 'Preparing report' : 'Unlock report'}
                <Download className="h-4 w-4" />
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
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={onDownloadReport}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
                >
                  Download PDF
                  <Download className="h-4 w-4" />
                </button>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/12 px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
                >
                  {interpretation.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
