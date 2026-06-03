'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type LoginFormProps = {
  authConfigured: boolean;
  nextPath: string;
};

type LoginResponse = {
  ok?: boolean;
  error?: string;
};

const inputClass =
  'mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-black/25 px-4 font-montserrat text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]';

export function PortalLoginForm({ authConfigured, nextPath }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const isCoolingDown = cooldownSeconds > 0;

  useEffect(() => {
    if (!cooldownSeconds) return;

    const timeout = window.setTimeout(() => {
      setCooldownSeconds((currentSeconds) => Math.max(0, currentSeconds - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [cooldownSeconds]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isCoolingDown) {
      return;
    }

    if (!authConfigured) {
      setError('Supabase Auth needs to be configured before client access can be enabled.');
      return;
    }

    setSending(true);
    setError('');
    setSent(false);

    try {
      const response = await fetch('/api/portal/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          nextPath,
          website,
        }),
      });
      const payload = (await response.json()) as LoginResponse;

      if (!response.ok || !payload.ok) {
        if (response.status === 429) {
          setCooldownSeconds(60);
        }

        throw new Error(payload.error || 'Portal sign-in could not be started.');
      }

      setSent(true);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Portal sign-in could not be started.');
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-[#181818] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-7"
    >
      <input
        type="text"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="border-b border-white/10 pb-6">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
          Secure workspace
        </p>
        <h1 className="mt-3 font-playfair text-4xl font-bold leading-tight text-white md:text-5xl">
          Portal access
        </h1>
        <p className="mt-4 max-w-2xl font-montserrat text-sm leading-6 text-stone-400">
          Enter the email address invited to this project or studio workspace.
        </p>
      </div>

      {!authConfigured ? (
        <p className="mt-6 flex items-start gap-3 rounded-lg border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-6 text-stone-100">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#FC6E20]" />
          Supabase Auth is not configured in this environment yet. Project data is locked until the Supabase URL and publishable key are available.
        </p>
      ) : null}

      <label className="mt-6 block">
        <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
          Email address
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={!authConfigured || sending}
          autoComplete="email"
          className={inputClass}
          placeholder="client@example.com"
        />
      </label>

      <button
        type="submit"
        disabled={!authConfigured || sending || isCoolingDown}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-stone-950 transition-colors hover:bg-[#e05a15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {isCoolingDown ? `Try again in ${cooldownSeconds}s` : 'Send magic link'}
      </button>

      {error ? (
        <p className="mt-5 flex items-start gap-3 rounded-lg border border-red-400/25 bg-red-400/10 p-4 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          {error}
        </p>
      ) : null}

      {sent ? (
        <p className="mt-5 flex items-start gap-3 rounded-lg border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-6 text-stone-100">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FC6E20]" />
          Check your email for the portal sign-in link.
        </p>
      ) : null}
    </form>
  );
}
