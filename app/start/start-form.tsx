'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  getLeadCaptureErrorMessage,
  submitLeadCapture,
} from '@/lib/lead-capture';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const serviceOptions = [
  'Website or redesign',
  'Custom web app or dashboard',
  'Local SEO or AI SEO',
  'Automation or workflow support',
  'Maintenance and support',
  'Not sure yet',
];

const timelineOptions = [
  'As soon as possible',
  'This month',
  '1-3 months',
  'Still exploring',
];

const inputClass =
  'mt-2 min-h-14 w-full rounded-[14px] border border-[#151419]/12 bg-[#FBFBFB] px-4 font-montserrat text-sm text-[#151419] outline-none transition-colors placeholder:text-[#151419]/38 focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20';

const labelClass =
  'font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#151419]/58';

export function StartForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [service, setService] = useState(serviceOptions[0]);
  const [timeline, setTimeline] = useState(timelineOptions[1]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const formattedMessage = useMemo(() => {
    return [
      'Lead source: /start one-page intake',
      `Service interest: ${service}`,
      `Timeline: ${timeline}`,
      business ? `Business: ${business}` : 'Business: Not provided',
      '',
      'Message:',
      message.trim(),
    ].join('\n');
  }, [business, message, service, timeline]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError('');

    try {
      await submitLeadCapture({
        type: 'contact',
        sourcePath: '/start',
        lead: { name, email, business },
        service,
        timeline,
        budget: 'Not sure yet',
        message: formattedMessage,
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
      className="start-glow-card start-glow-card--form rounded-xl border border-[#151419]/12 bg-[#F0EFED] p-5 shadow-[0_28px_80px_rgba(21,20,25,0.12)] md:p-7"
    >
      <div className="border-b border-[#151419]/12 pb-6">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.24em] text-[#FC6E20]">
          Project enquiry
        </p>
        <h2 className="mt-3 font-playfair text-4xl font-bold leading-tight text-[#151419] md:text-5xl">
          Tell me what you need<span className="text-[#FC6E20]">.</span>
        </h2>
        <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62">
          A rough note is enough. Send the problem, the goal, or the site you
          want me to look at.
        </p>
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
        <span className={labelClass}>Business or project</span>
        <input
          value={business}
          onChange={(event) => setBusiness(event.target.value)}
          autoComplete="organization"
          className={inputClass}
          placeholder="Optional, but helpful"
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>What do you need?</span>
          <Select
            value={service}
            onValueChange={setService}
            indicatorPosition="right"
          >
            <SelectTrigger size="lg" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="block">
          <span className={labelClass}>Timing</span>
          <Select
            value={timeline}
            onValueChange={setTimeline}
            indicatorPosition="right"
          >
            <SelectTrigger size="lg" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timelineOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className={labelClass}>Message</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={6}
          className="mt-2 w-full resize-none rounded-[14px] border border-[#151419]/12 bg-[#FBFBFB] px-4 py-4 font-montserrat text-sm leading-7 text-[#151419] outline-none transition-colors placeholder:text-[#151419]/38 focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20"
          placeholder="Tell me what you want to build, fix, improve, or automate."
        />
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={sending || sent}
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#151419] transition-colors hover:bg-[#e95f14] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {sent ? 'Enquiry sent' : sending ? 'Sending' : 'Send enquiry'}
          {sent ? (
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          )}
        </button>

        <p className="max-w-xs font-montserrat text-xs leading-6 text-[#151419]/52">
          Your details are used only to reply to this enquiry. POPIA-aware
          handling, no spam, no newsletter detour.
        </p>
      </div>

      {error ? (
        <p className="mt-5 border border-red-500/25 bg-red-500/10 p-4 font-montserrat text-sm leading-6 text-red-950">
          {error}
        </p>
      ) : null}

      {sent ? (
        <p className="mt-5 flex items-start gap-3 border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-6 text-[#151419]">
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-[#FC6E20]"
          />
          Got it. I will reply with the clearest next step.
        </p>
      ) : null}
    </form>
  );
}
