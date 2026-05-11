import type { Metadata } from 'next';
import { CircleDollarSign, ReceiptText, WalletCards } from 'lucide-react';
import {
  expenseRows,
  financeAlerts,
  financeMetrics,
  financeSummary,
  invoiceRows,
  studioFinanceTabs,
} from '@/lib/dashboard-data';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioMetricCard,
  StudioPageHeader,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

export const metadata: Metadata = {
  title: 'Studio Finance | Kreative Reflow',
  description: 'Finance dashboard for revenue, invoices, expenses, and cash visibility.',
};

const invoiceColumns: StudioTableColumn<(typeof invoiceRows)[number]>[] = [
  { key: 'invoice', label: 'Invoice', render: (row) => <span className="font-semibold text-white">{row.invoice}</span> },
  { key: 'client', label: 'Client', render: (row) => <span>{row.client}</span> },
  { key: 'amount', label: 'Amount', render: (row) => <span className="font-mono text-[#FC6E20]">{row.amount}</span> },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <StudioStatusPill
        label={row.status}
        tone={row.status === 'Paid' ? 'neutral' : row.status === 'Due' ? 'accent' : 'muted'}
      />
    ),
  },
  { key: 'issued', label: 'Issued', render: (row) => <span className="font-mono">{row.issued}</span> },
  { key: 'due', label: 'Due', render: (row) => <span className="font-mono">{row.due}</span> },
  { key: 'paid', label: 'Paid', render: (row) => <span className="font-mono">{row.paid}</span> },
];

const expenseColumns: StudioTableColumn<(typeof expenseRows)[number]>[] = [
  { key: 'date', label: 'Date', render: (row) => <span className="font-mono">{row.date}</span> },
  { key: 'category', label: 'Category', render: (row) => <span>{row.category}</span> },
  { key: 'description', label: 'Description', render: (row) => <span>{row.description}</span> },
  { key: 'amount', label: 'Amount', render: (row) => <span className="font-mono text-[#FC6E20]">{row.amount}</span> },
];

export default function StudioFinancePage() {
  return (
    <div className="space-y-5">
      <StudioPageHeader
        eyebrow="Finance"
        title="Revenue, invoices, and cost control"
        description="Keep money visible next to delivery. This page shows what has been collected, what is still due, and where cost is building so commercial decisions stay grounded."
        tabs={studioFinanceTabs}
        activeTab="Overview"
      />

      <section className="grid gap-4 xl:grid-cols-3">
        {financeMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <StudioPanel title="Revenue summary" eyebrow="Month to date" icon={WalletCards}>
          <div className="grid gap-3 sm:grid-cols-2">
            {financeSummary.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <p className="font-montserrat text-xs uppercase tracking-[0.16em] text-[#878787]">{item.label}</p>
                <p className="mt-2 font-playfair text-4xl text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[24px] border border-[#FC6E20]/30 bg-[#FC6E20]/10 p-4">
            <p className="font-montserrat text-xs uppercase tracking-[0.16em] text-[#FC6E20]">Keep it lean</p>
            <p className="mt-2 font-montserrat text-sm leading-6 text-[#F0EFED]">
              Forecasting and payment automation stay out of this pass. The goal here is clean visibility, not financial over-engineering.
            </p>
          </div>
        </StudioPanel>

        <StudioPanel title="Invoice manager" eyebrow="Collections" icon={ReceiptText}>
          <StudioDataTable columns={invoiceColumns} rows={invoiceRows} />
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <StudioPanel title="Expense tracker" eyebrow="Operating costs" icon={CircleDollarSign}>
          <StudioDataTable columns={expenseColumns} rows={expenseRows} />
        </StudioPanel>

        <StudioPanel title="Alerts" eyebrow="Items needing action">
          <div className="space-y-3">
            {financeAlerts.map((item) => (
              <div key={`${item.time}-${item.title}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 font-montserrat text-sm text-[#878787]">{item.meta}</p>
                  </div>
                  <StudioStatusPill label={item.time} tone={item.tone === 'accent' ? 'accent' : 'muted'} />
                </div>
              </div>
            ))}
          </div>
        </StudioPanel>
      </section>
    </div>
  );
}
