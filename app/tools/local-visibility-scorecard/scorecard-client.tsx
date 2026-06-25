'use client';

import type React from 'react';
import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  Globe2,
  Loader2,
  MapPinned,
  MessageCircle,
  RotateCcw,
  SearchCheck,
  Star,
} from 'lucide-react';
import {
  buildBrandedReportHtml,
  downloadPdfReport,
  getLeadCaptureErrorMessage,
  submitLeadCapture,
} from '@/lib/lead-capture';
import { ExpandingCtaBackground } from '@/components/ExpandingCtaBackground';

type CategoryId = 'gbp' | 'reviews' | 'citations' | 'website' | 'ai' | 'jhb_specific';

type ScorecardOption = {
  label: string;
  value: string;
  points: number;
  description?: string;
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

type ScoreInterpretation = {
  range: string;
  title: string;
  tone: 'strong' | 'warning' | 'danger' | 'critical';
  diagnosis: string;
  recommendations: string[];
  ctaText: string;
  ctaMessage: string;
};

type ScoreResult = {
  total: number;
  percentage: number;
  categoryScores: Record<CategoryId, CategoryScore>;
  interpretation: ScoreInterpretation;
};

type TimelineEstimate = {
  targetScore: string;
  timeline: string;
  effort: string;
  keyActions: string;
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
  gbp: {
    name: 'Google Business Profile',
    maxPoints: 34,
    description: 'How complete, specific, and active your Google listing is.',
    icon: MapPinned,
  },
  reviews: {
    name: 'Review Profile',
    maxPoints: 24,
    description: 'Review quantity, rating, freshness, and response rhythm.',
    icon: Star,
  },
  citations: {
    name: 'Citations & Directories',
    maxPoints: 12,
    description: 'Presence and consistency across South African directories.',
    icon: ClipboardList,
  },
  website: {
    name: 'Website Local SEO',
    maxPoints: 22,
    description: 'How clearly your website confirms location, services, and areas served.',
    icon: Globe2,
  },
  ai: {
    name: 'AI Search Visibility',
    maxPoints: 4,
    description: 'How easy it is for AI answer systems to cite and understand you.',
    icon: Bot,
  },
  jhb_specific: {
    name: 'Johannesburg-Specific',
    maxPoints: 4,
    description: 'Local conversion details such as WhatsApp and SA payment trust.',
    icon: Building2,
  },
};

const categoryOrder: CategoryId[] = ['gbp', 'reviews', 'citations', 'website', 'ai', 'jhb_specific'];

const localVisibilityQuestions: ScorecardQuestion[] = [
  {
    id: 'gbp_verified',
    category: 'gbp',
    weight: 6,
    question: 'Is your Google Business Profile claimed and verified?',
    helpText:
      'Verification is required to manage your listing, update business details, and show stronger local trust signals.',
    fix: 'Claim and verify the Google Business Profile immediately, then make sure ownership sits with the business.',
    options: [
      { label: 'Yes, claimed and verified', value: 'verified', points: 6 },
      { label: 'No, not claimed or unverified', value: 'not_verified', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'gbp_primary_category',
    category: 'gbp',
    weight: 8,
    question: 'How accurate is your primary Google Business Profile category?',
    helpText:
      "Your primary category is a major matching signal. A specific category beats a broad one when buyers search by service.",
    fix: 'Set the most specific primary category that matches the main revenue service, then audit it against competitors.',
    options: [
      { label: 'Perfect, the most specific match for my main service', value: 'perfect', points: 8 },
      { label: 'Okay, correct general category but not specific', value: 'okay', points: 4 },
      { label: 'Wrong or too broad', value: 'wrong', points: 0 },
      { label: "I don't know what my primary category is", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'gbp_secondary_categories',
    category: 'gbp',
    weight: 2,
    question: 'How many relevant secondary categories have you added?',
    helpText:
      'Secondary categories help the listing appear for related searches when they genuinely match your offer.',
    fix: 'Add 3-5 relevant secondary categories that reflect real services, without stuffing unrelated categories.',
    options: [
      { label: '3-5 relevant secondary categories', value: '3_5', points: 2 },
      { label: '1-2 secondary categories', value: '1_2', points: 1 },
      { label: 'None', value: 'none', points: 0 },
    ],
  },
  {
    id: 'gbp_service_area',
    category: 'gbp',
    weight: 3,
    question: 'Have you set your service areas in Google Business Profile?',
    helpText:
      'Specific Johannesburg suburbs help Google understand where the business can reasonably serve customers.',
    fix: 'Set specific service areas such as Sandton, Rosebank, Fourways, Randburg, Midrand, or the true suburbs served.',
    options: [
      { label: 'Yes, specific suburbs listed', value: 'specific', points: 3 },
      { label: "Yes, but only 'Johannesburg' or a broad radius", value: 'generic', points: 1.5 },
      { label: 'No, service area is not set', value: 'not_set', points: 0 },
    ],
  },
  {
    id: 'gbp_hours',
    category: 'gbp',
    weight: 6,
    question: 'Are your business hours accurate and up to date?',
    helpText:
      'Incorrect hours frustrate customers and weaken trust. Holiday and special hours matter when people are ready to call.',
    fix: 'Update core hours, holiday hours, and any special schedules that affect when customers can reach you.',
    options: [
      { label: 'Yes, accurate hours including holidays and special schedules', value: 'accurate_complete', points: 6 },
      { label: 'Yes, accurate main hours but no holiday or special hours', value: 'accurate_basic', points: 3 },
      { label: 'No, hours are wrong or outdated', value: 'wrong', points: 0 },
    ],
  },
  {
    id: 'gbp_photos',
    category: 'gbp',
    weight: 2,
    question: 'How many photos do you have on your Google Business Profile?',
    helpText:
      'Photos make the listing feel current and real. Mix team, work, premises, products, process, and recent proof.',
    fix: 'Upload a fresh photo set covering team, work, premises, and service delivery, then refresh photos monthly.',
    options: [
      { label: '30+ photos including different types and recent uploads', value: '30_plus', points: 2 },
      { label: '10-29 photos with some variety', value: '10_29', points: 1 },
      { label: 'Less than 10 photos', value: 'under_10', points: 0 },
    ],
  },
  {
    id: 'gbp_posts',
    category: 'gbp',
    weight: 1,
    question: 'How often do you post updates to your Google Business Profile?',
    helpText:
      'Posts show recent activity, offers, service updates, events, and timely business information.',
    fix: 'Create a simple weekly GBP post rhythm using service tips, project notes, offers, FAQs, or local updates.',
    options: [
      { label: 'Weekly or more, at least 4 posts in the last 30 days', value: 'weekly', points: 1 },
      { label: 'Monthly, 1-3 posts in the last 30 days', value: 'monthly', points: 0.5 },
      { label: 'Rarely or never', value: 'rarely', points: 0 },
    ],
  },
  {
    id: 'gbp_action_buttons',
    category: 'gbp',
    weight: 3,
    question: 'Which action buttons do you have enabled on your Google Business Profile?',
    helpText:
      'Call, website, booking, messaging, and WhatsApp options reduce friction when the customer is ready.',
    fix: 'Enable every relevant action button, especially call, website, booking or enquiry, and WhatsApp messaging where available.',
    options: [
      { label: 'All available options including WhatsApp messaging', value: 'all', points: 3 },
      { label: 'Call and website only', value: 'call_website', points: 1.5 },
      { label: 'Just one or none', value: 'minimal', points: 0 },
    ],
  },
  {
    id: 'gbp_qna',
    category: 'gbp',
    weight: 1,
    question: 'Do you monitor and respond to questions in the Q&A section?',
    helpText:
      'Customers can ask public questions directly on your listing. Unanswered questions make the business feel unattended.',
    fix: 'Check the Q&A section weekly and seed useful common questions with direct, accurate answers.',
    options: [
      { label: 'Yes, I monitor and respond to questions', value: 'yes', points: 1 },
      { label: 'No, questions are unanswered', value: 'no', points: 0 },
    ],
  },
  {
    id: 'gbp_services',
    category: 'gbp',
    weight: 2,
    question: 'Have you added your services in the Services section?',
    helpText:
      'Specific services help customers understand the offer and help Google connect the listing to relevant searches.',
    fix: 'Add every core service with a short plain-language description and optional pricing where appropriate.',
    options: [
      { label: 'Yes, comprehensive list with descriptions', value: 'comprehensive', points: 2 },
      { label: 'Yes, basic list', value: 'basic', points: 1 },
      { label: 'No, services section is empty', value: 'empty', points: 0 },
    ],
  },
  {
    id: 'reviews_quantity',
    category: 'reviews',
    weight: 8,
    question: 'How many Google reviews does your business have?',
    helpText:
      'Review count sets the first trust benchmark against competitors in Johannesburg local searches.',
    fix: 'Build a review acquisition system that asks every happy customer quickly, clearly, and consistently.',
    options: [
      { label: '100+ reviews', value: '100_plus', points: 8, description: 'Dominant presence' },
      { label: '50-99 reviews', value: '50_99', points: 6, description: 'Strong presence' },
      { label: '20-49 reviews', value: '20_49', points: 4, description: 'Competitive' },
      { label: '10-19 reviews', value: '10_19', points: 2, description: 'Weak' },
      { label: 'Less than 10 reviews', value: 'under_10', points: 0, description: 'Invisible' },
    ],
  },
  {
    id: 'reviews_rating',
    category: 'reviews',
    weight: 6,
    question: 'What is your average star rating?',
    helpText:
      'Rating affects trust and clicks. A business can be visible and still lose the customer if the rating creates doubt.',
    fix: 'Respond to unhappy reviews, fix service issues that repeat, and increase the volume of fresh positive reviews.',
    options: [
      { label: '4.7-5.0 stars', value: '4_7_5', points: 6 },
      { label: '4.4-4.6 stars', value: '4_4_4_6', points: 5 },
      { label: '4.0-4.3 stars', value: '4_0_4_3', points: 3 },
      { label: '3.5-3.9 stars', value: '3_5_3_9', points: 1 },
      { label: 'Below 3.5 stars', value: 'below_3_5', points: 0 },
    ],
  },
  {
    id: 'reviews_velocity',
    category: 'reviews',
    weight: 6,
    question: 'How many new reviews do you get per month?',
    helpText:
      'Fresh reviews show that the business is active and still earning trust now, not only years ago.',
    fix: 'Ask for reviews in the first 24-72 hours after a good outcome and track review requests monthly.',
    options: [
      { label: '15+ reviews per month', value: '15_plus', points: 6, description: 'Excellent velocity' },
      { label: '10-14 per month', value: '10_14', points: 5, description: 'Strong velocity' },
      { label: '5-9 per month', value: '5_9', points: 3, description: 'Moderate velocity' },
      { label: '1-4 per month', value: '1_4', points: 1, description: 'Weak velocity' },
      { label: 'Less than 1 per month', value: 'under_1', points: 0, description: 'No velocity' },
    ],
  },
  {
    id: 'reviews_response_rate',
    category: 'reviews',
    weight: 4,
    question: 'Do you respond to reviews? How quickly?',
    helpText:
      'Review responses show care, keep the profile active, and give future customers more context.',
    fix: 'Respond to all reviews within 24-48 hours with specific, human replies that mention the service where natural.',
    options: [
      { label: '95%+ responded within 24-48 hours', value: 'fast_complete', points: 4 },
      { label: '80-94% responded within a week', value: 'good', points: 3 },
      { label: '50-79% responded eventually', value: 'some', points: 1.5 },
      { label: 'Less than 50% or no responses', value: 'minimal', points: 0 },
    ],
  },
  {
    id: 'citations_sa_presence',
    category: 'citations',
    weight: 5,
    question: 'How many South African business directories are you listed on?',
    helpText:
      'Relevant local directories reinforce that the business exists, serves the area, and has consistent contact information.',
    fix: 'Claim core South African listings such as HelloPeter, SAYellow, Brabys, Yellowpages, HotFrog, Cylex, and Snupit.',
    options: [
      { label: '10-15+ directories claimed', value: '10_15', points: 5 },
      { label: '5-9 directories', value: '5_9', points: 3 },
      { label: 'Less than 5 directories', value: 'under_5', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'citations_nap_consistency',
    category: 'citations',
    weight: 4,
    question: 'Is your business name, address, and phone number consistent everywhere?',
    helpText:
      'NAP should match across the website, Google Business Profile, and directories. Small formatting differences can create trust noise.',
    fix: 'Create one approved NAP format and update the website, Google profile, and all directories to match it exactly.',
    options: [
      { label: '100% consistent across all listings', value: 'consistent', points: 4 },
      { label: 'Mostly consistent with 1-2 minor differences', value: 'mostly', points: 2 },
      { label: 'Multiple variations or inconsistencies', value: 'inconsistent', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'citations_bing_apple',
    category: 'citations',
    weight: 1,
    question: 'Are you listed on Bing Places and Apple Business Connect?',
    helpText:
      'These listings cover searchers outside Google and help with map visibility for Microsoft and Apple users.',
    fix: 'Claim Bing Places and Apple Business Connect, then match the same NAP and service details used on Google.',
    options: [
      { label: 'Yes, both claimed and optimized', value: 'both', points: 1 },
      { label: 'One of the two', value: 'one', points: 0.5 },
      { label: 'Neither', value: 'neither', points: 0 },
    ],
  },
  {
    id: 'citations_completeness',
    category: 'citations',
    weight: 2,
    question: 'How complete are your directory listings?',
    helpText:
      'Complete listings include NAP, website, hours, description, photos, and categories. Partial listings waste trust.',
    fix: 'Fill out every important listing with hours, categories, photos, service description, and the correct website URL.',
    options: [
      { label: 'All fields filled on most listings', value: 'complete', points: 2 },
      { label: 'Basic info only, NAP plus website', value: 'basic', points: 1 },
      { label: 'Name only or minimal info', value: 'minimal', points: 0 },
    ],
  },
  {
    id: 'website_nap_match',
    category: 'website',
    weight: 5,
    question: 'Does your website NAP exactly match your Google Business Profile?',
    helpText:
      'Your contact page or footer should use the same business name, address, and phone number as the Google listing.',
    fix: 'Update the website footer and contact page so business name, address, and phone match Google exactly.',
    options: [
      { label: 'Yes, exact match', value: 'yes', points: 5 },
      { label: 'No, different or missing', value: 'no', points: 0 },
    ],
  },
  {
    id: 'website_location_pages',
    category: 'website',
    weight: 6,
    question: 'Do you have dedicated pages for the suburbs you serve?',
    helpText:
      'Suburb pages should be useful and unique, not duplicated doorway pages. They help match specific local intent.',
    fix: 'Build dedicated pages for the top suburbs served, with unique service detail, proof, FAQs, and local context.',
    options: [
      { label: '5+ suburb pages with unique content', value: '5_plus', points: 6, description: 'Strong local SEO' },
      { label: '3-4 suburb pages', value: '3_4', points: 4 },
      { label: '1-2 suburb pages', value: '1_2', points: 2 },
      { label: 'No suburb-specific pages', value: 'none', points: 0 },
    ],
  },
  {
    id: 'website_schema',
    category: 'website',
    weight: 3,
    question: 'Does your website have LocalBusiness schema markup?',
    helpText:
      'Schema gives search systems structured facts about the business, service areas, address, hours, and contact details.',
    fix: 'Add LocalBusiness schema with accurate NAP, opening hours, service areas, geo data where appropriate, and sameAs profiles.',
    options: [
      { label: 'Yes, complete LocalBusiness schema with service areas and geo coordinates', value: 'complete', points: 3 },
      { label: 'Yes, basic LocalBusiness schema', value: 'basic', points: 1.5 },
      { label: 'No schema markup', value: 'none', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'website_local_keywords',
    category: 'website',
    weight: 4,
    question: 'Do your page titles and headings include location keywords?',
    helpText:
      'Location language should be natural in titles, H1s, service pages, FAQs, and body copy.',
    fix: 'Rewrite titles and headings to include real service and location language without keyword stuffing.',
    options: [
      { label: 'Yes, natural location keywords in titles, headings, and content', value: 'natural', points: 4 },
      { label: 'Some location keywords but inconsistent', value: 'some', points: 2 },
      { label: 'No local keywords or keyword stuffing', value: 'none', points: 0 },
    ],
  },
  {
    id: 'website_mobile_speed',
    category: 'website',
    weight: 2,
    question: 'How fast does your website load on mobile?',
    helpText:
      'Mobile speed affects both user behavior and local performance. Test the real site on mobile, not only desktop.',
    fix: 'Compress images, remove heavy scripts, and optimize the mobile above-fold experience.',
    options: [
      { label: 'Under 2 seconds, good Core Web Vitals', value: 'under_2', points: 2 },
      { label: '2-3 seconds', value: '2_3', points: 1 },
      { label: 'Over 3 seconds', value: 'over_3', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'website_mobile_ux',
    category: 'website',
    weight: 2,
    question: 'Does your website have click-to-call, WhatsApp, and clear CTAs on mobile?',
    helpText:
      'Mobile local visitors often want the shortest path to action: call, WhatsApp, quote, or booking.',
    fix: 'Add tappable phone, WhatsApp, and a clear mobile CTA above or near the first decision point.',
    options: [
      { label: 'Yes, all mobile UX essentials are present', value: 'yes', points: 2 },
      { label: 'No, key mobile features are missing', value: 'no', points: 0 },
    ],
  },
  {
    id: 'ai_faq_content',
    category: 'ai',
    weight: 2,
    question: 'Do you have FAQ sections on your website with schema markup?',
    helpText:
      'FAQ content answers the questions customers and AI answer systems are likely to ask directly.',
    fix: 'Add practical FAQs to service and location pages, then mark them up with valid FAQ schema where appropriate.',
    options: [
      { label: 'Yes, multiple pages with FAQ schema markup', value: 'multiple_schema', points: 2 },
      { label: 'Yes, some FAQ content but no schema', value: 'no_schema', points: 1 },
      { label: 'No FAQ content', value: 'none', points: 0 },
    ],
  },
  {
    id: 'ai_editorial_mentions',
    category: 'ai',
    weight: 2,
    question: "Are you mentioned in 'Best of Johannesburg' lists or local editorial sites?",
    helpText:
      'Editorial mentions help both humans and AI systems find third-party proof that the business belongs in recommendations.',
    fix: 'Pursue relevant local roundups, professional directories, industry features, and partner pages that can mention the business credibly.',
    options: [
      { label: 'Yes, multiple mentions in local editorial, news, or best-of lists', value: 'multiple', points: 2 },
      { label: 'Yes, 1-2 mentions', value: '1_2', points: 1 },
      { label: 'No editorial mentions', value: 'none', points: 0 },
      { label: "I don't know", value: 'unknown', points: 0 },
    ],
  },
  {
    id: 'jhb_whatsapp',
    category: 'jhb_specific',
    weight: 2,
    question: 'Do you have WhatsApp integration on both your website and Google Business Profile?',
    helpText:
      'WhatsApp is a natural first-contact channel for many South African customers, especially on mobile.',
    fix: 'Add WhatsApp to the website and Google Business Profile messaging options, then test the full enquiry path.',
    options: [
      { label: 'Yes, WhatsApp is on website and GBP', value: 'yes', points: 2 },
      { label: 'No, it is missing on one or both', value: 'no', points: 0 },
    ],
  },
  {
    id: 'jhb_payment_methods',
    category: 'jhb_specific',
    weight: 2,
    question: 'Do you display South African payment methods on your website?',
    helpText:
      'Visible local payment options reduce doubt for customers who need to know how payment works before enquiring.',
    fix: 'Show relevant South African payment methods such as EFT, SnapScan, Zapper, PayFast, Yoco, or card options where appropriate.',
    options: [
      { label: 'Yes, EFT, SnapScan, Zapper, and other SA methods are visible', value: 'multiple', points: 2 },
      { label: 'EFT only mentioned', value: 'eft_only', points: 1 },
      { label: 'Card only or no payment info', value: 'none', points: 0 },
    ],
  },
];

function getScoreInterpretation(score: number): ScoreInterpretation {
  if (score >= 80) {
    return {
      range: '80-100',
      title: 'Dominant',
      tone: 'strong',
      diagnosis:
        'Strong local visibility. You are likely competing well in Maps, Local Finder, and suburb-level searches.',
      recommendations: [
        'Maintain review velocity and respond quickly.',
        'Post weekly updates to Google Business Profile.',
        'Refresh suburb pages quarterly.',
        'Expand into new suburbs and keyword clusters.',
        'Monitor competitor movement monthly.',
      ],
      ctaText: 'Book Strategy Consultation',
      ctaMessage: "You are leading. Let's protect that position and expand into new local markets.",
    };
  }

  if (score >= 60) {
    return {
      range: '60-79',
      title: 'Competitive',
      tone: 'warning',
      diagnosis:
        'You have a useful foundation, but competitors can still beat you on reviews, completeness, suburb relevance, or citations.',
      recommendations: [
        'Increase review velocity to 10-15 per month.',
        'Add more Google Business Profile photos.',
        'Create suburb-specific pages for priority areas.',
        'Add LocalBusiness schema if missing.',
        'Claim 10-15 South African directory listings with consistent NAP.',
      ],
      ctaText: 'Book Free Audit',
      ctaMessage: 'You are competitive but have gaps. A focused audit can close them.',
    };
  }

  if (score >= 40) {
    return {
      range: '40-59',
      title: 'Weak Presence',
      tone: 'danger',
      diagnosis:
        "You may show up for branded searches, but you are probably losing most category and 'near me' demand to competitors.",
      recommendations: [
        'Fix the Google Business Profile primary category.',
        'Add specific service areas for Johannesburg suburbs.',
        'Start a review acquisition system.',
        'Make NAP match exactly across website and Google.',
        'Create 3-5 suburb-specific pages.',
        'Add WhatsApp to the website and Google listing.',
      ],
      ctaText: 'Book Urgent Consultation',
      ctaMessage: 'Weak visibility is costing local leads daily. This needs a structured fix plan.',
    };
  }

  return {
    range: '0-39',
    title: 'Invisible',
    tone: 'critical',
    diagnosis:
      'Most potential customers in Johannesburg probably cannot find you for non-branded local searches.',
    recommendations: [
      'Claim and verify Google Business Profile immediately.',
      'Set the correct primary category.',
      'Add specific Johannesburg service areas.',
      'Add 20+ photos to the profile.',
      'Make NAP consistent across website and Google.',
      'Get the first 10 reviews as fast as ethically possible.',
      'Create basic location pages for top suburbs.',
      'Add WhatsApp to website and Google Business Profile.',
    ],
    ctaText: 'Book Emergency Consultation',
    ctaMessage: 'You are invisible. Customers cannot find you. The first fix plan should be built within days.',
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

  localVisibilityQuestions.forEach((question) => {
    const selectedValue = answers[question.id];
    const selectedOption = question.options.find((option) => option.value === selectedValue);

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

function getTimelineEstimate(score: number): TimelineEstimate {
  if (score < 20) {
    return {
      targetScore: '45-55',
      timeline: '2-3 weeks',
      effort: 'Intensive, 5+ hours per week',
      keyActions: 'GBP setup, NAP fix, WhatsApp, 10 reviews, basic citations',
    };
  }

  if (score < 40) {
    return {
      targetScore: '55-65',
      timeline: '3-4 weeks',
      effort: 'Intensive, 5+ hours per week',
      keyActions: 'Above plus 3 suburb pages, schema, and expanded photos',
    };
  }

  if (score < 60) {
    return {
      targetScore: '70-80',
      timeline: '8-12 weeks',
      effort: 'Moderate, 3 hours per week',
      keyActions: 'Review velocity, suburb expansion, FAQ content, citation cleanup',
    };
  }

  if (score < 80) {
    return {
      targetScore: '85-93',
      timeline: '12-16 weeks',
      effort: 'Light, 2 hours per week',
      keyActions: 'AI optimization, editorial mentions, competitor gap closing',
    };
  }

  return {
    targetScore: '90-97',
    timeline: 'Ongoing',
    effort: 'Maintenance, 1 hour per week',
    keyActions: 'Weekly posts, monthly content updates, review velocity, competitor monitoring',
  };
}

function getPriorityFixes(result: ScoreResult, answers: Record<string, string>) {
  const categoryFixes: Record<CategoryId, { action: string; detail: string; timeframe: string; impact: string }> = {
    gbp: {
      action: 'Complete your Google Business Profile',
      detail: 'Add categories, service areas, hours, photos, services, action buttons, and Q&A responses.',
      timeframe: '1-3 days',
      impact: '+8 to +15 points',
    },
    reviews: {
      action: 'Start a review acquisition system',
      detail: 'Ask every happy customer, track requests, and respond to all reviews within 48 hours.',
      timeframe: 'Ongoing',
      impact: '+6 to +12 points over 60 days',
    },
    website: {
      action: 'Create suburb-specific pages',
      detail: 'Build useful location pages for Sandton, Rosebank, Fourways, Randburg, and other priority areas.',
      timeframe: '1-2 weeks',
      impact: '+4 to +8 points',
    },
    citations: {
      action: 'Claim South African directory listings',
      detail: 'Clean up HelloPeter, SAYellow, Brabys, Yellowpages, HotFrog, Cylex, Snupit, Bing, and Apple listings.',
      timeframe: '1-2 weeks',
      impact: '+3 to +6 points',
    },
    ai: {
      action: 'Add answer-friendly FAQ content',
      detail: 'Answer cost, location, service, comparison, and process questions in structured FAQ sections.',
      timeframe: '1 week',
      impact: '+1 to +4 points',
    },
    jhb_specific: {
      action: 'Add Johannesburg conversion signals',
      detail: 'Make WhatsApp and local payment methods visible on the website and Google listing.',
      timeframe: '1 day',
      impact: '+2 to +4 points',
    },
  };

  const categoryGaps = categoryOrder
    .map((categoryId) => {
      const score = result.categoryScores[categoryId];
      return {
        categoryId,
        percentage: (score.earned / score.possible) * 100,
        lost: score.possible - score.earned,
      };
    })
    .filter((gap) => gap.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage || b.lost - a.lost)
    .map((gap) => categoryFixes[gap.categoryId]);

  if (categoryGaps.length >= 3) return categoryGaps.slice(0, 4);

  const questionFixes = localVisibilityQuestions
    .map((question) => {
      const selectedValue = answers[question.id];
      const selectedOption = question.options.find((option) => option.value === selectedValue);
      const points = selectedOption?.points ?? 0;
      return {
        question,
        lost: question.weight - points,
        ratio: question.weight === 0 ? 0 : (question.weight - points) / question.weight,
      };
    })
    .filter((item) => item.lost > 0)
    .sort((a, b) => b.ratio - a.ratio || b.lost - a.lost)
    .slice(0, 4 - categoryGaps.length)
    .map((item) => ({
      action: item.question.question,
      detail: item.question.fix,
      timeframe: 'Next practical sprint',
      impact: `Up to +${item.question.weight} points`,
    }));

  const combined = [...categoryGaps, ...questionFixes];

  return combined.length > 0
    ? combined
    : result.interpretation.recommendations.slice(0, 3).map((recommendation) => ({
        action: 'Maintain current advantage',
        detail: recommendation,
        timeframe: 'Ongoing',
        impact: 'Protect score',
      }));
}

function toneClasses(tone: ScoreInterpretation['tone']) {
  if (tone === 'strong') return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100';
  if (tone === 'warning') return 'border-[#F5E16A]/35 bg-[#F5E16A]/10 text-[#FBFBFB]';
  if (tone === 'danger') return 'border-[#FC6E20]/45 bg-[#FC6E20]/12 text-[#FBFBFB]';
  return 'border-red-400/45 bg-red-500/12 text-[#FBFBFB]';
}

function buildReportText({
  answers,
  lead,
  priorityFixes,
  result,
  timeline,
}: {
  answers: Record<string, string>;
  lead: { name: string; email: string; business: string };
  priorityFixes: ReturnType<typeof getPriorityFixes>;
  result: ScoreResult;
  timeline: TimelineEstimate;
}) {
  const categoryLines = categoryOrder.map((categoryId) => {
    const category = categories[categoryId];
    const score = result.categoryScores[categoryId];
    return `${category.name}: ${score.earned}/${score.possible}`;
  });

  const answerLines = localVisibilityQuestions.map((question) => {
    const selected = question.options.find((option) => option.value === answers[question.id]);
    return [
      question.question,
      `Answer: ${selected?.label ?? 'Not answered'}`,
      `Score: ${selected?.points ?? 0}/${question.weight}`,
      selected && selected.points < question.weight ? `Fix: ${question.fix}` : 'Fix: Keep this signal strong.',
    ].join('\n');
  });

  return [
    'Local Visibility Scorecard Report',
    'Kreative Reflow',
    '',
    `Name: ${lead.name || 'Not provided'}`,
    `Email: ${lead.email || 'Not provided'}`,
    `Business: ${lead.business || 'Not provided'}`,
    '',
    `Score: ${result.percentage}/100`,
    `Result: ${result.interpretation.title} (${result.interpretation.range})`,
    '',
    'Diagnosis',
    result.interpretation.diagnosis,
    '',
    'Category Breakdown',
    ...categoryLines,
    '',
    'Priority Fixes',
    ...priorityFixes.map((fix, index) => `${index + 1}. ${fix.action}: ${fix.detail} (${fix.timeframe}, ${fix.impact})`),
    '',
    'Timeline Estimate',
    `Target score: ${timeline.targetScore}`,
    `Timeline: ${timeline.timeline}`,
    `Effort: ${timeline.effort}`,
    `Key actions: ${timeline.keyActions}`,
    '',
    'Full Check Breakdown',
    ...answerLines.map((line) => `\n${line}`),
    '',
    'Next Step',
    `${result.interpretation.ctaMessage} Visit https://kreativereflow.com/contact`,
  ].join('\n');
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
      <span>[</span>
      {children}
      <span>]</span>
    </span>
  );
}

function VerticalLines({ dark = false }: { dark?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((line) => (
        <span
          key={line}
          className={`absolute top-0 h-full border-l ${dark ? 'border-[#FBFBFB]/[0.055]' : 'border-[#151419]/[0.045]'}`}
          style={{ left: `${(line / 7) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function LocalVisibilityScorecardClient() {
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

  const currentQuestion = localVisibilityQuestions[currentIndex];
  const activeCategory = categories[currentQuestion.category];
  const currentCategoryQuestions = localVisibilityQuestions.filter(
    (question) => question.category === currentQuestion.category,
  );
  const currentCategoryPosition =
    currentCategoryQuestions.findIndex((question) => question.id === currentQuestion.id) + 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / localVisibilityQuestions.length) * 100);
  const result = useMemo(() => calculateScore(answers), [answers]);
  const priorityFixes = useMemo(() => getPriorityFixes(result, answers), [answers, result]);
  const timeline = useMemo(() => getTimelineEstimate(result.percentage), [result.percentage]);
  const selectedAnswer = answers[currentQuestion.id];

  const handleAnswer = (value: string) => {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
  };

  const goNext = () => {
    if (currentIndex >= localVisibilityQuestions.length - 1) {
      setShowResults(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const goPrevious = () => {
    if (showResults) {
      setShowResults(false);
      setCurrentIndex(localVisibilityQuestions.length - 1);
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
      timeline,
    });

  const currentResultSummary = () => ({
    score: result.percentage,
    range: result.interpretation.range,
    timeline: timeline.timeline,
    firstPriority: priorityFixes[0]?.action || null,
  });

  const buildCurrentReportHtml = (reportText: string) =>
    buildBrandedReportHtml({
      reportText,
      reportTitle: 'Local Visibility Action Plan',
      toolName: 'Local Visibility Scorecard',
      sourcePath: '/tools/local-visibility-scorecard',
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
        toolId: 'local-visibility-scorecard',
        toolName: 'Local Visibility Scorecard',
        sourcePath: '/tools/local-visibility-scorecard',
        lead: { name: leadName, email: leadEmail, business: leadBusiness },
        reportTitle: 'Local Visibility Action Plan',
        reportFileName: 'local-visibility-scorecard-report.pdf',
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
        toolId: 'local-visibility-scorecard',
        toolName: 'Local Visibility Scorecard',
        sourcePath: '/tools/local-visibility-scorecard',
        lead: { name: leadName, email: leadEmail, business: leadBusiness },
        reportTitle: 'Local Visibility Action Plan',
        reportFileName: 'local-visibility-scorecard-report.pdf',
        reportText,
        reportHtml: buildCurrentReportHtml(reportText),
        resultSummary: currentResultSummary(),
      });
    } catch (error) {
      setReportError(getLeadCaptureErrorMessage(error));
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <section className="relative isolate overflow-hidden bg-[#151419] text-[#FBFBFB]">
        <VerticalLines dark />
        <div className="content-gutter grid gap-12 pb-16 pt-28 md:pb-24 md:pt-36 lg:min-h-screen lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <SectionLabel>Local Visibility Scorecard</SectionLabel>
            <h1 className="mt-6 max-w-4xl font-playfair text-[clamp(3.1rem,7.2vw,7.2rem)] font-bold leading-[0.93] tracking-tight text-[#FBFBFB]">
              Find out if local customers can actually find you<span className="text-[#FC6E20]">.</span>
            </h1>
            <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#F0EFED]/76 md:text-lg">
              A Johannesburg-focused diagnostic for Google Business Profile,
              reviews, directories, website local SEO, AI search visibility,
              and South African conversion signals.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['28 checks', '100-point score'],
                ['6 categories', 'Local search stack'],
                ['Full report', 'Unlocked at result'],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/10 bg-white/[0.035] p-4">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959]">
                    {label}
                  </p>
                  <p className="mt-3 font-mono text-sm text-[#FBFBFB]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-white/10 bg-[#1B1B1E] p-5 shadow-2xl shadow-black/25 md:p-7 lg:p-9">
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
                  <div className="shrink-0 border border-white/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#595959]">
                    {currentCategoryPosition}/{currentCategoryQuestions.length}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.16em] text-[#595959]">
                    <span>
                      Question {currentIndex + 1}/{localVisibilityQuestions.length}
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
                            className={`h-4 w-4 rounded-[0.25rem] border ${
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
                            {option.points}/{currentQuestion.weight}
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
                    {currentIndex >= localVisibilityQuestions.length - 1 ? 'See result' : 'Next check'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </section>
            ) : (
              <ResultsView
                result={result}
                priorityFixes={priorityFixes}
                timeline={timeline}
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
            <SectionLabel>Local growth order</SectionLabel>
            <h2 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-none text-[#151419] dark:text-[#FBFBFB] md:text-6xl">
              Visibility compounds when the basics line up<span className="text-[#FC6E20]">.</span>
            </h2>
            <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
              Google Business Profile comes first, then reviews, then directory
              consistency, then website local SEO and AI-friendly content. Skip
              the early layers and the later work has less to stand on.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Day 1', 'Claim or clean up GBP, verify the listing, fix category, hours, services, and contact actions.'],
              ['Week 1', 'Clean NAP across website and directories, then add WhatsApp and core South African trust signals.'],
              ['Month 1', 'Create suburb pages, add LocalBusiness schema, and start a consistent review request rhythm.'],
              ['Ongoing', 'Post weekly, add fresh photos, respond to reviews, and earn credible local mentions.'],
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

      <section className="content-gutter relative z-10 pb-24 md:pb-32">
        <ExpandingCtaBackground>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionLabel>Want the visibility map checked?</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[0.96] tracking-tight">
                Bring the score. We will find the local search gaps worth fixing first<span className="text-[#FC6E20]">.</span>
              </h2>
            </div>
            <Link
              href="/contact"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB] sm:w-auto"
            >
              Book local audit
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ExpandingCtaBackground>
      </section>
    </main>
  );
}

function ResultsView({
  result,
  priorityFixes,
  timeline,
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
  priorityFixes: ReturnType<typeof getPriorityFixes>;
  timeline: TimelineEstimate;
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
              Your local visibility score
            </p>
            <h2 className="mt-4 font-playfair text-6xl font-bold leading-none md:text-8xl">
              {result.percentage}/100
            </h2>
          </div>
          <div className="inline-flex items-center gap-3 border border-white/10 bg-black/10 px-4 py-3">
            {interpretation.tone === 'strong' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-300" strokeWidth={1.7} />
            ) : interpretation.tone === 'warning' ? (
              <SearchCheck className="h-5 w-5 text-[#F5E16A]" strokeWidth={1.7} />
            ) : interpretation.tone === 'danger' ? (
              <MessageCircle className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.7} />
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

      <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {categoryOrder.map((categoryId) => {
          const category = categories[categoryId];
          const score = result.categoryScores[categoryId];
          const Icon = category.icon;

          return (
            <article key={categoryId} className="rounded-[1rem] border border-white/10 bg-white/[0.035] p-4 text-[#FBFBFB]">
              <Icon className="h-4 w-4 text-[#FC6E20]" strokeWidth={1.7} />
              <p className="mt-5 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#595959]">
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
            Priority fix roadmap
          </p>
          <div className="mt-4 grid gap-3">
            {priorityFixes.map((fix, index) => (
              <div key={`${fix.action}-${index}`} className="grid gap-4 border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[2rem_1fr]">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FC6E20]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-montserrat text-sm font-bold leading-6 text-[#FBFBFB]">
                    {fix.action}
                  </p>
                  <p className="mt-2 font-montserrat text-sm leading-7 text-[#F0EFED]/64">
                    {fix.detail}
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[#FC6E20]">
                    {fix.timeframe} / {fix.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 border border-white/10 bg-white/[0.035] p-4 md:grid-cols-2">
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959]">
                Timeline estimate
              </p>
              <p className="mt-3 font-playfair text-3xl font-bold leading-none text-[#FBFBFB]">
                {timeline.timeline}
              </p>
            </div>
            <div>
              <p className="font-montserrat text-sm leading-7 text-[#F0EFED]/64">
                Target: {timeline.targetScore}. Effort: {timeline.effort}. Key
                actions: {timeline.keyActions}.
              </p>
            </div>
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

        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Full report
          </p>
          <h3 className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#FBFBFB]">
            Get the local visibility action plan<span className="text-[#FC6E20]">.</span>
          </h3>
          <p className="mt-4 font-montserrat text-sm leading-7 text-[#F0EFED]/62">
            {interpretation.ctaMessage}
          </p>

          {!reportReady ? (
            <form onSubmit={onLeadSubmit} className="mt-6 grid gap-4">
              <label className="block">
                <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#595959]">
                  Name
                </span>
                <input
                  value={leadName}
                  onChange={(event) => onLeadNameChange(event.target.value)}
                  className="mt-2 min-h-12 w-full border border-white/10 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none transition-colors placeholder:text-[#595959] focus:border-[#FC6E20]"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#595959]">
                  Email
                </span>
                <input
                  value={leadEmail}
                  onChange={(event) => onLeadEmailChange(event.target.value)}
                  required
                  type="email"
                  inputMode="email"
                  className="mt-2 min-h-12 w-full rounded-[0.75rem] border border-white/10 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none transition-colors placeholder:text-[#595959] focus:border-[#FC6E20]"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#595959]">
                  Business
                </span>
                <input
                  value={leadBusiness}
                  onChange={(event) => onLeadBusinessChange(event.target.value)}
                  className="mt-2 min-h-12 w-full border border-white/10 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none transition-colors placeholder:text-[#595959] focus:border-[#FC6E20]"
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
