'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import {
  getLeadCaptureErrorMessage,
  submitLeadCapture,
} from '@/lib/lead-capture';

const serviceOptions = [
  'Web design and development',
  'SaaS or custom web application',
  'Dashboard or client portal',
  'Local and AI SEO',
  'AI and business automation',
  'Consulting',
  'Maintenance and support',
];

const timelineOptions = [
  'As soon as possible',
  'This month',
  '1-3 months',
  'Still exploring',
];

const budgetOptions = [
  'Not sure yet',
  'Under R15k',
  'R15k - R35k',
  'R35k - R75k',
  'R75k+',
];

const inputClass =
  'mt-2 min-h-[54px] w-full rounded-2xl border border-white/10 bg-[#151419] px-4 font-montserrat text-sm text-[#FBFBFB] outline-none transition-colors placeholder:text-[#878787] focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20';

const labelClass =
  'font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-[#878787]';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(serviceOptions[0]);
  const [timeline, setTimeline] = useState(timelineOptions[0]);
  const [budget, setBudget] = useState(budgetOptions[0]);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError('');

    try {
      await submitLeadCapture({
        type: 'contact',
        sourcePath: '/contact',
        lead: { name, email, business: company },
        service,
        timeline,
        budget,
        message,
      });

      setSent(true);
    } catch (submissionError) {
      setError(getLeadCaptureErrorMessage(submissionError));
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1B1B1E] p-5 shadow-2xl shadow-black/25 md:p-7"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FC6E20] to-transparent" />

      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.24em] text-[#FC6E20]">
            Build brief
          </p>
          <h2 className="mt-3 font-playfair text-3xl font-bold leading-tight text-[#FBFBFB] md:text-4xl">
            Give us the signal.
          </h2>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-[#878787]">
          Direct enquiry
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className={labelClass}>Company or project name</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          autoComplete="organization"
          className={inputClass}
          placeholder="Optional, but helpful"
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Project type</span>
          <select
            value={service}
            onChange={(event) => setService(event.target.value)}
            className={`${inputClass} appearance-none`}
          >
            {serviceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Timeline</span>
          <select
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            className={`${inputClass} appearance-none`}
          >
            {timelineOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Budget range</span>
          <select
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className={`${inputClass} appearance-none`}
          >
            {budgetOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className={labelClass}>What is going on?</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={7}
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[#151419] px-4 py-4 font-montserrat text-sm leading-7 text-[#FBFBFB] outline-none transition-colors placeholder:text-[#878787] focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20"
          placeholder="Tell us what you want to build, fix, simplify, automate, or understand better."
        />
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#151419] transition-colors hover:bg-[#e95f14] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {sending ? 'Sending enquiry' : 'Send enquiry'}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </button>

        <p className="max-w-xs font-montserrat text-xs leading-6 text-[#878787]">
          The studio receives your project context and can reply with the next
          practical step.
        </p>
      </div>

      {error ? (
        <p className="mt-5 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 font-montserrat text-sm leading-6 text-red-100">
          {error}
        </p>
      ) : null}

      {sent && (
        <p className="mt-5 flex items-start gap-3 rounded-2xl border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-6 text-[#F0EFED]">
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-[#FC6E20]"
          />
          Your enquiry has been sent. We will reply with the clearest next step.
        </p>
      )}
    </form>
  );
}
