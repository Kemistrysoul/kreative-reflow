import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import type { LocalNavItem, StudioMetric } from '@/lib/dashboard-data';

export function StudioPageHeader({
  eyebrow,
  title,
  description,
  tabs,
  activeTab,
  actions,
  onTabChange,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tabs: LocalNavItem[];
  activeTab: string;
  actions?: ReactNode;
  onTabChange?: (label: string) => void;
}) {
  return (
    <section className="min-w-0 rounded-[30px] border border-white/8 bg-[#1B1B1E]/92 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.36)] backdrop-blur lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">{eyebrow}</p>
          <h2 className="mt-3 font-playfair text-4xl font-semibold text-white lg:text-5xl">{title}</h2>
          <p className="mt-3 max-w-3xl font-montserrat text-sm leading-7 text-[#595959] lg:text-base">{description}</p>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.label === activeTab;
          const className = `rounded-full border px-4 py-2 font-montserrat text-sm transition ${
            active
              ? 'border-[#FC6E20] bg-[#FC6E20] text-[#151419]'
              : 'border-white/8 bg-white/5 text-[#FBFBFB]'
          }`;

          if (tab.href) {
            return (
              <Link key={tab.label} href={tab.href} className={className}>
                {tab.label}
              </Link>
            );
          }

          return (
            <button
              key={tab.label}
              type="button"
              onClick={onTabChange ? () => onTabChange(tab.label) : undefined}
              className={className}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function StudioPanel({
  title,
  eyebrow,
  icon: Icon,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-[30px] border border-white/8 bg-[#1B1B1E]/92 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur lg:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#FC6E20]">
              <Icon className="h-4 w-4" />
            </span>
          ) : null}
          <div>
            {eyebrow ? (
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{eyebrow}</p>
            ) : null}
            <h3 className="font-playfair text-3xl font-semibold text-white">{title}</h3>
          </div>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function StudioMetricCard({ metric }: { metric: StudioMetric }) {
  const Icon = metric.icon;
  const toneClass =
    metric.tone === 'accent'
      ? 'border-[#FC6E20]/50 bg-[linear-gradient(180deg,rgba(252,110,32,0.2),rgba(252,110,32,0.06))]'
      : metric.tone === 'muted'
        ? 'border-white/8 bg-white/5'
        : 'border-white/8 bg-[#151419]';

  return (
    <article className={`min-w-0 rounded-[26px] border p-5 ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#FC6E20]">
          <Icon className="h-4 w-4" />
        </div>
        {metric.spark?.length ? <MiniSpark bars={metric.spark} /> : null}
      </div>
      <p className="mt-5 font-montserrat text-xs uppercase tracking-[0.18em] text-[#595959]">{metric.label}</p>
      <p className="mt-2 font-playfair text-5xl font-semibold text-white">{metric.value}</p>
      <p className="mt-2 font-montserrat text-sm text-[#595959]">{metric.detail}</p>
    </article>
  );
}

function MiniSpark({ bars }: { bars: number[] }) {
  const max = Math.max(...bars);

  return (
    <div className="flex h-10 items-end gap-1">
      {bars.map((bar, index) => (
        <span
          key={`${bar}-${index}`}
          className="w-2 rounded-full bg-[#FC6E20]"
          style={{ height: `${Math.max(18, (bar / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function StudioStatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'accent' | 'neutral' | 'muted';
}) {
  const classes =
    tone === 'accent'
      ? 'border-[#FC6E20]/40 bg-[#FC6E20]/12 text-[#FC6E20]'
      : tone === 'muted'
        ? 'border-white/8 bg-white/5 text-[#595959]'
        : 'border-white/10 bg-white/6 text-[#F0EFED]';

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.16em] ${classes}`}>
      {label}
    </span>
  );
}

export type StudioTableColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => ReactNode;
};

export function StudioDataTable<T>({
  columns,
  rows,
  onRowClick,
  getRowKey,
  emptyMessage = 'Nothing matches the current filter state.',
}: {
  columns: StudioTableColumn<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  getRowKey?: (row: T, index: number) => string;
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-white/8 bg-[#151419]">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/8">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.16em] text-[#595959] ${column.className ?? ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr
                key={getRowKey ? getRowKey(row, index) : String(index)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-white/6 last:border-b-0 ${onRowClick ? 'cursor-pointer transition hover:bg-white/[0.03]' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-4 font-montserrat text-sm text-[#FBFBFB] ${column.className ?? ''}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center font-montserrat text-sm text-[#595959]"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function StudioList({
  items,
}: {
  items: { title: string; meta?: string; time?: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
              {item.meta ? <p className="mt-2 font-montserrat text-sm text-[#595959]">{item.meta}</p> : null}
            </div>
            {item.time ? (
              <span className="shrink-0 font-mono text-xs text-[#595959]">{item.time}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudioLinkRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div>
        <p className="font-montserrat text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 font-montserrat text-sm text-[#595959]">{description}</p>
      </div>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-[#FBFBFB]">
        <ChevronRight className="h-4 w-4" />
      </span>
    </div>
  );
}
