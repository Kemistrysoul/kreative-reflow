'use client';

import type React from 'react';
import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock3,
  Download,
  MessageCircle,
  PhoneCall,
  RotateCcw,
  TrendingDown,
  Zap,
} from 'lucide-react';
import {
  buildBrandedReportHtml,
  downloadPdfReport,
  getLeadCaptureErrorMessage,
  submitLeadCapture,
} from '@/lib/lead-capture';

type Status = 'critical' | 'warning' | 'info' | 'strong';

type ResponseTimeOption = {
  value: string;
  label: string;
  conversionRate: number;
};

type IndustryOption = {
  value: string;
  label: string;
  avgResponseTime: string;
  avgLeads: number;
  avgDealValue: number;
};

type CalculatorState = {
  monthlyLeads: string;
  currentResponseTime: string;
  currentCloseRate: string;
  averageDealValue: string;
  industry: string;
};

type LeadCaptureState = {
  name: string;
  email: string;
  business: string;
};

type LeakResults = {
  monthlyLeads: number;
  currentCloseRate: number;
  averageDealValue: number;
  currentResponseRate: number;
  fastResponseRate: number;
  currentMonthlyRevenue: number;
  potentialMonthlyRevenue: number;
  monthlyLeak: number;
  annualLeak: number;
  threeYearLeak: number;
  currentLeadsConverted: number;
  potentialLeadsConverted: number;
  leadsLostPerMonth: number;
  conversionMultiplier: number;
  automationCostMonthly: number;
  automationCostAnnual: number;
  netAnnualGain: number;
  roi: number;
  paybackMonths: number | null;
};

type Interpretation = {
  severity: string;
  status: Status;
  title: string;
  message: string;
  urgency: string;
  recommendation: string;
  ctaText: string;
  ctaMessage: string;
};

const responseTimeOptions: ResponseTimeOption[] = [
  { value: '1min', label: 'Under 1 minute', conversionRate: 0.253 },
  { value: '5min', label: '1-5 minutes', conversionRate: 0.187 },
  { value: '15min', label: '5-15 minutes', conversionRate: 0.124 },
  { value: '30min', label: '15-30 minutes', conversionRate: 0.078 },
  { value: '1hour', label: '30 minutes to 1 hour', conversionRate: 0.035 },
  { value: '24hours', label: '1-24 hours', conversionRate: 0.012 },
  { value: '48hours', label: '24-48 hours', conversionRate: 0.004 },
  { value: 'never', label: '48+ hours or never', conversionRate: 0.001 },
];

const industryOptions: IndustryOption[] = [
  { value: 'plumbing', label: 'Plumbing / Emergency Home Services', avgResponseTime: '45min', avgLeads: 150, avgDealValue: 4500 },
  { value: 'electrical', label: 'Electrical', avgResponseTime: '1 hour', avgLeads: 100, avgDealValue: 6000 },
  { value: 'hvac', label: 'HVAC / Air Conditioning', avgResponseTime: '1 hour', avgLeads: 90, avgDealValue: 8500 },
  { value: 'locksmith', label: 'Locksmith / Security', avgResponseTime: '20min', avgLeads: 120, avgDealValue: 2800 },
  { value: 'cleaning', label: 'Cleaning Services', avgResponseTime: '2 hours', avgLeads: 140, avgDealValue: 1800 },
  { value: 'pest', label: 'Pest Control', avgResponseTime: '90min', avgLeads: 80, avgDealValue: 2500 },
  { value: 'painting', label: 'Painting / Renovations', avgResponseTime: '3 hours', avgLeads: 65, avgDealValue: 12000 },
  { value: 'auto', label: 'Auto Repair', avgResponseTime: '1 hour', avgLeads: 110, avgDealValue: 3500 },
  { value: 'medical', label: 'Medical / Dental', avgResponseTime: '2 hours', avgLeads: 130, avgDealValue: 2200 },
  { value: 'legal', label: 'Legal Services', avgResponseTime: '4 hours', avgLeads: 55, avgDealValue: 18000 },
  { value: 'beauty', label: 'Beauty / Salon', avgResponseTime: '90min', avgLeads: 160, avgDealValue: 900 },
  { value: 'professional', label: 'Professional Services (B2B)', avgResponseTime: '4 hours', avgLeads: 45, avgDealValue: 25000 },
  { value: 'other', label: 'Other', avgResponseTime: '2 hours', avgLeads: 75, avgDealValue: 5000 },
];

const fixCards = [
  {
    title: 'WhatsApp Business API',
    description: 'Auto-greeting inside 30 seconds, routing by service type, and a clear handover to a human.',
    cost: 'From R800/month',
    impact: '+35% conversion focus',
    icon: MessageCircle,
  },
  {
    title: 'Missed Call to SMS',
    description: 'Instant text reply when a call is missed, with a callback promise and booking or WhatsApp link.',
    cost: 'From R400/month',
    impact: '+20% recovery focus',
    icon: PhoneCall,
  },
  {
    title: 'After-Hours Capture',
    description: 'A response flow for evenings and weekends when high-intent leads are still comparing options.',
    cost: 'From R2,500/month',
    impact: '+40% capture focus',
    icon: Clock3,
  },
];

function parseNumber(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('en-ZA', {
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDecimal(num: number) {
  return new Intl.NumberFormat('en-ZA', {
    maximumFractionDigits: 1,
  }).format(num);
}

function formatCurrency(num: number) {
  return `R${formatNumber(Math.max(0, Math.round(num)))}`;
}

function getResponseTimeLabel(value: string) {
  return responseTimeOptions.find((option) => option.value === value)?.label ?? value;
}

function calculateLeak(inputs: CalculatorState): LeakResults {
  const monthlyLeads = clamp(parseNumber(inputs.monthlyLeads), 0, 10000);
  const currentCloseRate = clamp(parseNumber(inputs.currentCloseRate), 0, 100);
  const averageDealValue = Math.max(0, parseNumber(inputs.averageDealValue));
  const selectedResponse = responseTimeOptions.find(
    (option) => option.value === inputs.currentResponseTime,
  ) ?? responseTimeOptions[1];
  const fastResponse = responseTimeOptions.find((option) => option.value === '5min') ?? responseTimeOptions[1];
  const currentResponseRate = selectedResponse.conversionRate;
  const fastResponseRate = fastResponse.conversionRate;
  const rawMultiplier = fastResponseRate / currentResponseRate;
  const conversionMultiplier = Math.max(1, rawMultiplier);
  const currentLeadsConverted = monthlyLeads * (currentCloseRate / 100);
  const potentialLeadsConverted = currentLeadsConverted * conversionMultiplier;
  const leadsLostPerMonth = Math.max(0, potentialLeadsConverted - currentLeadsConverted);
  const currentMonthlyRevenue = currentLeadsConverted * averageDealValue;
  const potentialMonthlyRevenue = potentialLeadsConverted * averageDealValue;
  const monthlyLeak = Math.max(0, potentialMonthlyRevenue - currentMonthlyRevenue);
  const annualLeak = monthlyLeak * 12;
  const threeYearLeak = annualLeak * 3;
  const automationCostMonthly = 1200;
  const automationCostAnnual = automationCostMonthly * 12;
  const netAnnualGain = annualLeak - automationCostAnnual;
  const roi = automationCostAnnual > 0 ? (netAnnualGain / automationCostAnnual) * 100 : 0;
  const paybackMonths = monthlyLeak > 0 ? automationCostMonthly / monthlyLeak : null;

  return {
    monthlyLeads,
    currentCloseRate,
    averageDealValue,
    currentResponseRate,
    fastResponseRate,
    currentMonthlyRevenue,
    potentialMonthlyRevenue,
    monthlyLeak,
    annualLeak,
    threeYearLeak,
    currentLeadsConverted,
    potentialLeadsConverted,
    leadsLostPerMonth,
    conversionMultiplier,
    automationCostMonthly,
    automationCostAnnual,
    netAnnualGain,
    roi,
    paybackMonths,
  };
}

function getResultsInterpretation(results: LeakResults): Interpretation {
  const { monthlyLeak, annualLeak } = results;

  if (monthlyLeak > 30000) {
    return {
      severity: 'Emergency',
      status: 'critical',
      title: 'Emergency: Major Revenue Leak',
      message: `You are losing about ${formatCurrency(monthlyLeak)} per month by responding too slowly. That is ${formatCurrency(annualLeak)} per year.`,
      urgency: 'This is costing more than many marketing budgets. Every delayed day can mean thousands in missed deals.',
      recommendation: 'Immediate action required. WhatsApp automation plus CRM routing can usually be mapped and launched within 1-2 weeks.',
      ctaText: 'Book Emergency Consultation',
      ctaMessage: "Let's stop the leak and build a response plan that can recover revenue inside 30 days.",
    };
  }

  if (monthlyLeak > 10000) {
    return {
      severity: 'Significant',
      status: 'warning',
      title: 'Significant Revenue Leak',
      message: `You are losing about ${formatCurrency(monthlyLeak)} per month, or ${formatCurrency(annualLeak)} annually.`,
      urgency: 'This leak is large enough to fund a serious growth investment or a dedicated response system.',
      recommendation: 'WhatsApp Business API, instant SMS, and basic CRM follow-up can recover a large share of this within 2-4 weeks.',
      ctaText: 'Book Free Audit',
      ctaMessage: 'We will show you where the response leak is and what to automate first.',
    };
  }

  if (monthlyLeak > 3000) {
    return {
      severity: 'Moderate',
      status: 'info',
      title: 'Moderate Revenue Leak',
      message: `You are losing about ${formatCurrency(monthlyLeak)} per month, or ${formatCurrency(annualLeak)} per year.`,
      urgency: 'This is not catastrophic, but it is enough to fund better marketing, automation, or admin support.',
      recommendation: 'Start with a WhatsApp auto-greeting, missed call SMS, and a simple follow-up tracker.',
      ctaText: 'Book Consultation',
      ctaMessage: "Let's find the fastest automation wins to recover this revenue.",
    };
  }

  return {
    severity: 'Minor',
    status: 'strong',
    title: 'Minor Leak: You Are Doing Well',
    message: `Your estimated leak is ${formatCurrency(monthlyLeak)} per month. You are already responding faster than many competitors.`,
    urgency: 'Focus on optimization rather than a major rebuild.',
    recommendation: 'Consider lead scoring, faster routing for high-value leads, and after-hours capture for the next improvement.',
    ctaText: 'Book Consultation',
    ctaMessage: "Let's find the next 10% improvement opportunity.",
  };
}

function statusClasses(status: Status) {
  if (status === 'critical') {
    return 'border-red-400/40 bg-red-500/12 text-red-100';
  }

  if (status === 'warning') {
    return 'border-[#FC6E20]/45 bg-[#FC6E20]/12 text-[#FBFBFB]';
  }

  if (status === 'info') {
    return 'border-[#F5E16A]/35 bg-[#F5E16A]/10 text-[#FBFBFB]';
  }

  return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100';
}

function buildReportText({
  inputs,
  lead,
  results,
  interpretation,
}: {
  inputs: CalculatorState;
  lead: LeadCaptureState;
  results: LeakResults;
  interpretation: Interpretation;
}) {
  const selectedIndustry = industryOptions.find((industry) => industry.value === inputs.industry);

  return [
    'Lead Response Leak Calculator Report',
    'Kreative Reflow',
    '',
    `Name: ${lead.name || 'Not provided'}`,
    `Email: ${lead.email || 'Not provided'}`,
    `Business: ${lead.business || 'Not provided'}`,
    '',
    'Inputs',
    `Monthly leads: ${formatNumber(results.monthlyLeads)}`,
    `Current response time: ${getResponseTimeLabel(inputs.currentResponseTime)}`,
    `Current close rate: ${formatDecimal(results.currentCloseRate)}%`,
    `Average deal value: ${formatCurrency(results.averageDealValue)}`,
    `Industry: ${selectedIndustry?.label ?? 'Not provided'}`,
    '',
    'Executive Summary',
    `Monthly leak: ${formatCurrency(results.monthlyLeak)}`,
    `Annual leak: ${formatCurrency(results.annualLeak)}`,
    `Three-year leak: ${formatCurrency(results.threeYearLeak)}`,
    `Leads lost per month: ${formatDecimal(results.leadsLostPerMonth)}`,
    `Potential response improvement: ${formatDecimal(results.conversionMultiplier)}x`,
    '',
    'ROI Estimate',
    `Estimated automation cost: ${formatCurrency(results.automationCostMonthly)}/month`,
    `Annual automation cost: ${formatCurrency(results.automationCostAnnual)}`,
    `Net annual gain: ${formatCurrency(results.netAnnualGain)}`,
    `ROI: ${formatNumber(results.roi)}%`,
    '',
    'Diagnosis',
    interpretation.title,
    interpretation.message,
    interpretation.urgency,
    interpretation.recommendation,
    '',
    'Action Plan',
    'Week 1: Add instant WhatsApp or SMS acknowledgement for every lead source.',
    'Weeks 2-4: Connect forms, phone calls, WhatsApp, and email into a basic CRM pipeline.',
    'Month 2-3: Add lead scoring, after-hours routing, and follow-up reminders.',
    'Ongoing: Review response time weekly and tighten the slowest channel first.',
    '',
    'Recommended Fixes',
    ...fixCards.map((fix, index) => `${index + 1}. ${fix.title}: ${fix.description} ${fix.cost}. ${fix.impact}.`),
    '',
    'Next Step',
    `${interpretation.ctaMessage} Visit https://kreativereflow.com/contact`,
  ].join('\n');
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-[#FC6E20]">
      [ {children} ]
    </p>
  );
}

function NumberInput({
  helpText,
  label,
  max,
  min,
  onChange,
  placeholder,
  prefix,
  suffix,
  value,
}: {
  helpText: string;
  label: string;
  max?: number;
  min?: number;
  onChange: (value: string) => void;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  value: string;
}) {
  return (
    <label className="block border border-white/10 bg-white/[0.035] p-5">
      <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#FC6E20]">
        {label}
      </span>
      <span className="mt-3 block font-montserrat text-sm leading-6 text-[#F0EFED]/58">
        {helpText}
      </span>
      <span className="mt-5 flex min-h-14 items-center border border-white/12 bg-[#151419] px-4 focus-within:border-[#FC6E20]">
        {prefix ? <span className="font-mono text-sm text-[#595959]">{prefix}</span> : null}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          min={min}
          max={max}
          inputMode="decimal"
          placeholder={placeholder}
          className="min-h-12 w-full bg-transparent px-3 font-mono text-base text-[#FBFBFB] outline-none placeholder:text-[#595959]/70"
        />
        {suffix ? <span className="font-mono text-sm text-[#595959]">{suffix}</span> : null}
      </span>
    </label>
  );
}

function SelectInput({
  helpText,
  label,
  onChange,
  options,
  value,
}: {
  helpText: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  value: string;
}) {
  return (
    <label className="block border border-white/10 bg-white/[0.035] p-5">
      <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#FC6E20]">
        {label}
      </span>
      <span className="mt-3 block font-montserrat text-sm leading-6 text-[#F0EFED]/58">
        {helpText}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-5 min-h-14 w-full border border-white/12 bg-[#151419] px-4 font-mono text-sm text-[#FBFBFB] outline-none transition-colors focus:border-[#FC6E20]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#151419] text-[#FBFBFB]">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LeadResponseLeakCalculatorClient() {
  const [inputs, setInputs] = useState<CalculatorState>({
    monthlyLeads: '',
    currentResponseTime: '1hour',
    currentCloseRate: '',
    averageDealValue: '',
    industry: 'other',
  });
  const [lead, setLead] = useState<LeadCaptureState>({
    name: '',
    email: '',
    business: '',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportStatusMessage, setReportStatusMessage] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const results = useMemo(() => calculateLeak(inputs), [inputs]);
  const interpretation = useMemo(() => getResultsInterpretation(results), [results]);
  const selectedIndustry = industryOptions.find((industry) => industry.value === inputs.industry);
  const canCalculate =
    parseNumber(inputs.monthlyLeads) > 0 &&
    parseNumber(inputs.currentCloseRate) > 0 &&
    parseNumber(inputs.averageDealValue) > 0;

  const updateInput = (key: keyof CalculatorState, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setReportReady(false);
    setReportError('');
    setReportStatusMessage('');
  };

  const updateLead = (key: keyof LeadCaptureState, value: string) => {
    setLead((current) => ({ ...current, [key]: value }));
  };

  const handleCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCalculate) return;
    setHasCalculated(true);
    setReportReady(false);
    setReportError('');
    setReportStatusMessage('');
  };

  const buildCurrentReport = () =>
    buildReportText({
      inputs,
      lead,
      results,
      interpretation,
    });

  const currentResultSummary = () => ({
    monthlyLeak: formatCurrency(results.monthlyLeak),
    annualLeak: formatCurrency(results.annualLeak),
    severity: interpretation.severity,
    responseTime: getResponseTimeLabel(inputs.currentResponseTime),
  });

  const buildCurrentReportHtml = (reportText: string) =>
    buildBrandedReportHtml({
      reportText,
      reportTitle: 'Lead Response Recovery Plan',
      toolName: 'Lead Response Leak Calculator',
      sourcePath: '/tools/lead-response-leak-calculator',
      lead,
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
        toolId: 'lead-response-leak-calculator',
        toolName: 'Lead Response Leak Calculator',
        sourcePath: '/tools/lead-response-leak-calculator',
        lead,
        reportTitle: 'Lead Response Recovery Plan',
        reportFileName: 'lead-response-leak-calculator-report.pdf',
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

  const resetCalculator = () => {
    setInputs({
      monthlyLeads: '',
      currentResponseTime: '1hour',
      currentCloseRate: '',
      averageDealValue: '',
      industry: 'other',
    });
    setLead({ name: '', email: '', business: '' });
    setHasCalculated(false);
    setReportReady(false);
    setReportError('');
    setReportStatusMessage('');
    setIsSubmittingReport(false);
  };

  const downloadReport = async () => {
    setReportError('');
    const reportText = buildCurrentReport();

    try {
      await downloadPdfReport({
        type: 'tool-report',
        toolId: 'lead-response-leak-calculator',
        toolName: 'Lead Response Leak Calculator',
        sourcePath: '/tools/lead-response-leak-calculator',
        lead,
        reportTitle: 'Lead Response Recovery Plan',
        reportFileName: 'lead-response-leak-calculator-report.pdf',
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
        <div className="content-gutter grid gap-12 pb-16 pt-28 md:pb-24 md:pt-36 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionLabel>Lead Response Leak Calculator</SectionLabel>
            <h1 className="mt-6 max-w-4xl font-playfair text-5xl font-bold leading-none text-[#FBFBFB] md:text-7xl lg:text-8xl">
              See what slow replies are costing you<span className="text-[#FC6E20]">.</span>
            </h1>
            <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#F0EFED]/76 md:text-lg">
              A revenue calculator for service businesses that get leads from
              forms, phone calls, WhatsApp, Google Business Profile, and email.
              Put in your lead volume, response speed, close rate, and deal
              value. The calculator shows the monthly leak.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['5 inputs', 'Instant result'],
                ['5-min target', 'Response benchmark'],
                ['ROI view', 'Automation case'],
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

          <div className="border border-white/10 bg-[#1B1B1E] p-5 shadow-2xl shadow-black/25 md:p-7 lg:p-9">
            <form onSubmit={handleCalculate}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                    Calculator inputs
                  </p>
                  <h2 className="mt-3 font-playfair text-4xl font-bold leading-none text-[#FBFBFB] md:text-5xl">
                    Your current response gap
                  </h2>
                </div>
                <Calculator className="hidden h-10 w-10 text-[#FC6E20] md:block" strokeWidth={1.5} />
              </div>

              <div className="mt-8 grid gap-4">
                <NumberInput
                  label="How many leads do you get per month?"
                  helpText="Include website forms, calls, WhatsApp, email, and Google Business Profile messages."
                  placeholder="100"
                  min={1}
                  max={10000}
                  value={inputs.monthlyLeads}
                  onChange={(value) => updateInput('monthlyLeads', value)}
                />

                <SelectInput
                  label="What is your average response time?"
                  helpText="Be honest. How long does it take from lead enquiry to the first human response?"
                  value={inputs.currentResponseTime}
                  onChange={(value) => updateInput('currentResponseTime', value)}
                  options={responseTimeOptions}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <NumberInput
                    label="Lead to customer close rate"
                    helpText="If 100 leads become 10 customers, enter 10."
                    placeholder="10"
                    min={0}
                    max={100}
                    suffix="%"
                    value={inputs.currentCloseRate}
                    onChange={(value) => updateInput('currentCloseRate', value)}
                  />

                  <NumberInput
                    label="Average deal value"
                    helpText="Use the first-year value for recurring services."
                    placeholder="5000"
                    min={0}
                    prefix="R"
                    value={inputs.averageDealValue}
                    onChange={(value) => updateInput('averageDealValue', value)}
                  />
                </div>

                <SelectInput
                  label="What industry are you in?"
                  helpText="Optional. This adds a benchmark note to the result."
                  value={inputs.industry}
                  onChange={(value) => updateInput('industry', value)}
                  options={industryOptions}
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/12 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={!canCalculate}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Calculate leak
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="content-gutter py-20 md:py-28">
        {hasCalculated ? (
          <ResultsView
            inputs={inputs}
            selectedIndustry={selectedIndustry}
            results={results}
            interpretation={interpretation}
            lead={lead}
            reportReady={reportReady}
            reportError={reportError}
            reportStatusMessage={reportStatusMessage}
            isSubmittingReport={isSubmittingReport}
            onLeadChange={updateLead}
            onLeadSubmit={handleLeadSubmit}
            onDownload={downloadReport}
            onReset={resetCalculator}
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <SectionLabel>Why this matters</SectionLabel>
              <h2 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-none text-[#151419] dark:text-[#FBFBFB] md:text-6xl">
                Leads decay before your sales team even starts<span className="text-[#FC6E20]">.</span>
              </h2>
              <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
                A slow first reply makes the buyer compare other providers,
                forget the context, or assume the business is unavailable. The
                quickest fix is usually not more traffic. It is a faster first
                response.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Under 5 minutes', 'The benchmark this calculator compares against.'],
                ['R1,200/month', 'Estimated baseline for simple response automation.'],
                ['After hours', 'The hidden leak when leads arrive outside office time.'],
              ].map(([title, body]) => (
                <article
                  key={title}
                  className="min-h-[16rem] border border-[#151419]/12 bg-[#FBFBFB] p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]"
                >
                  <Zap className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.7} />
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
        )}
      </section>

      <section className="content-gutter pb-24 md:pb-32">
        <div className="border border-[#151419]/12 bg-[#151419] p-7 text-[#FBFBFB] md:p-10 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionLabel>Response systems</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-4xl font-bold leading-none md:text-6xl">
                The fastest lead is the one your system acknowledges first<span className="text-[#FC6E20]">.</span>
              </h2>
            </div>
            <Link
              href="/services/automation"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
            >
              View automation service
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResultsView({
  inputs,
  interpretation,
  lead,
  onDownload,
  onLeadChange,
  onLeadSubmit,
  onReset,
  reportReady,
  reportError,
  reportStatusMessage,
  isSubmittingReport,
  results,
  selectedIndustry,
}: {
  inputs: CalculatorState;
  interpretation: Interpretation;
  lead: LeadCaptureState;
  onDownload: () => void;
  onLeadChange: (key: keyof LeadCaptureState, value: string) => void;
  onLeadSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  reportReady: boolean;
  reportError: string;
  reportStatusMessage: string;
  isSubmittingReport: boolean;
  results: LeakResults;
  selectedIndustry?: IndustryOption;
}) {
  const maxLeads = Math.max(results.currentLeadsConverted, results.potentialLeadsConverted, 1);
  const currentWidth = `${Math.max(8, (results.currentLeadsConverted / maxLeads) * 100)}%`;
  const potentialWidth = `${Math.max(8, (results.potentialLeadsConverted / maxLeads) * 100)}%`;

  return (
    <div className="border border-[#151419]/12 bg-[#151419] p-5 text-[#FBFBFB] md:p-7 lg:p-9">
      <div className={`border p-5 md:p-7 ${statusClasses(interpretation.status)}`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
              Estimated response leak
            </p>
            <h2 className="mt-4 font-playfair text-6xl font-bold leading-none md:text-8xl">
              {formatCurrency(results.monthlyLeak)}
            </h2>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-[#F0EFED]/58">
              Lost per month
            </p>
          </div>
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FBFBFB]">
              <TrendingDown className="h-4 w-4 text-[#FC6E20]" strokeWidth={1.7} />
              {interpretation.severity}
            </div>
            <h3 className="mt-5 font-playfair text-3xl font-bold leading-tight text-[#FBFBFB]">
              {interpretation.title}
            </h3>
            <p className="mt-4 font-montserrat text-sm leading-7 text-[#F0EFED]/72">
              {interpretation.message}
            </p>
            <p className="mt-4 font-montserrat text-sm leading-7 text-[#F0EFED]/72">
              {interpretation.urgency}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {[
          ['Lost per year', formatCurrency(results.annualLeak)],
          ['Lost over 3 years', formatCurrency(results.threeYearLeak)],
          ['Leads lost monthly', formatDecimal(results.leadsLostPerMonth)],
          ['Potential lift', `${formatDecimal(results.conversionMultiplier)}x`],
        ].map(([label, value]) => (
          <article key={label} className="border border-white/10 bg-white/[0.035] p-4">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959]">
              {label}
            </p>
            <p className="mt-4 font-playfair text-3xl font-bold leading-none text-[#FBFBFB]">
              {value}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Current vs 5-minute response
          </p>
          <div className="mt-6 grid gap-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em] text-[#595959]">
                <span>Current</span>
                <span>{formatDecimal(results.currentLeadsConverted)} customers/mo</span>
              </div>
              <div className="h-4 bg-white/8">
                <div className="h-full bg-red-400/75" style={{ width: currentWidth }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em] text-[#595959]">
                <span>Potential</span>
                <span>{formatDecimal(results.potentialLeadsConverted)} customers/mo</span>
              </div>
              <div className="h-4 bg-white/8">
                <div className="h-full bg-emerald-400/75" style={{ width: potentialWidth }} />
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2">
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959]">
                Your response time
              </p>
              <p className="mt-2 font-mono text-sm text-[#FBFBFB]">
                {getResponseTimeLabel(inputs.currentResponseTime)}
              </p>
            </div>
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#595959]">
                Industry benchmark
              </p>
              <p className="mt-2 font-mono text-sm text-[#FBFBFB]">
                {selectedIndustry?.avgResponseTime ?? 'Not selected'}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            The fix pays for itself
          </p>
          <div className="mt-6 grid gap-3 font-montserrat text-sm">
            {[
              ['Annual leak', formatCurrency(results.annualLeak)],
              ['Automation cost', `-${formatCurrency(results.automationCostAnnual)}`],
              ['Net annual gain', formatCurrency(results.netAnnualGain)],
              ['ROI', `${formatNumber(results.roi)}%`],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-5 border-b border-white/10 pb-3 ${
                  index > 1 ? 'font-bold text-[#FBFBFB]' : 'text-[#F0EFED]/68'
                }`}
              >
                <span>{label}</span>
                <span className="font-mono">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 font-montserrat text-sm leading-7 text-[#F0EFED]/58">
            Estimate uses R1,200/month for a baseline WhatsApp, SMS, and CRM
            response setup. Actual scope depends on channels, routing, and
            integrations.
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[#FC6E20]">
            Payback: {results.paybackMonths ? `${formatDecimal(results.paybackMonths)} months` : 'Optimization mode'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {fixCards.map((fix) => {
          const Icon = fix.icon;

          return (
            <article key={fix.title} className="border border-white/10 bg-white/[0.035] p-5">
              <Icon className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.7} />
              <h3 className="mt-6 font-montserrat text-sm font-bold uppercase text-[#FBFBFB]">
                {fix.title}
              </h3>
              <p className="mt-4 font-montserrat text-sm leading-7 text-[#F0EFED]/62">
                {fix.description}
              </p>
              <div className="mt-6 grid gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#FC6E20]">
                <span>{fix.cost}</span>
                <span>{fix.impact}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.86fr]">
        <div className="border border-white/10 bg-white/[0.035] p-5 md:p-6">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Recommendation
          </p>
          <h3 className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#FBFBFB]">
            {interpretation.recommendation}
          </h3>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/12 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
            >
              <RotateCcw className="h-4 w-4" />
              Recalculate
            </button>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
            >
              {interpretation.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="border border-[#FC6E20]/35 bg-[#FC6E20]/10 p-5 md:p-6">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Detailed action plan
          </p>
          <h3 className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#FBFBFB]">
            Get the calculation breakdown<span className="text-[#FC6E20]">.</span>
          </h3>
          <p className="mt-4 font-montserrat text-sm leading-7 text-[#F0EFED]/62">
            The downloadable plan includes the full calculation, automation ROI,
            response benchmark, and a week-by-week fix sequence.
          </p>

          {!reportReady ? (
            <form onSubmit={onLeadSubmit} className="mt-6 grid gap-3">
              <input
                value={lead.name}
                onChange={(event) => onLeadChange('name', event.target.value)}
                placeholder="Your name"
                className="min-h-12 border border-white/12 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none placeholder:text-[#595959] focus:border-[#FC6E20]"
              />
              <input
                value={lead.email}
                onChange={(event) => onLeadChange('email', event.target.value)}
                type="email"
                placeholder="Email address"
                required
                className="min-h-12 border border-white/12 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none placeholder:text-[#595959] focus:border-[#FC6E20]"
              />
              <input
                value={lead.business}
                onChange={(event) => onLeadChange('business', event.target.value)}
                placeholder="Business name"
                className="min-h-12 border border-white/12 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none placeholder:text-[#595959] focus:border-[#FC6E20]"
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
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
