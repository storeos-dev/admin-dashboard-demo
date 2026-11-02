import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { ErrorBanner } from "@/components/error-banner";
import { formatMoney } from "@/lib/format";
import { ApiError, gqlRequest } from "@/lib/gql";
import { DASHBOARD_OVERVIEW_QUERY } from "@/lib/queries";

type OverviewData = {
  report__dashboardOverview: {
    orders: { total: number; growth?: { percentage: number; period: string } | null };
    revenue: {
      total: number;
      currency: string;
      growth?: { percentage: number; period: string } | null;
    };
    customers: {
      total: number;
      growth?: { percentage: number; period: string } | null;
    };
    products: { total: number; newThisWeek?: number | null };
  };
};

export function OverviewPage() {
  const query = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => gqlRequest<OverviewData>(DASHBOARD_OVERVIEW_QUERY),
  });

  const overview = query.data?.report__dashboardOverview;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
          Home
        </p>
        <h1
          className="mt-1 text-4xl text-[var(--fg)]"
          style={{ fontFamily: "var(--display)" }}
        >
          Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          KPIs from <code className="text-xs">report__dashboardOverview</code> —
          the same overview feed the StoreOS console uses.
        </p>
      </header>

      {query.isError ? (
        <ErrorBanner
          title="Could not load overview"
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Try refreshing the page."
          }
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Orders"
          value={overview ? String(overview.orders.total) : "—"}
          growth={overview?.orders.growth?.percentage}
          hint={overview?.orders.growth?.period}
        />
        <KpiCard
          label="Revenue"
          value={
            overview
              ? formatMoney(overview.revenue.total, overview.revenue.currency)
              : "—"
          }
          growth={overview?.revenue.growth?.percentage}
          hint={overview?.revenue.growth?.period}
        />
        <KpiCard
          label="Customers"
          value={overview ? String(overview.customers.total) : "—"}
          growth={overview?.customers.growth?.percentage}
          hint={overview?.customers.growth?.period}
        />
        <KpiCard
          label="Products"
          value={overview ? String(overview.products.total) : "—"}
          hint={
            overview?.products.newThisWeek != null
              ? `${overview.products.newThisWeek} new this week`
              : undefined
          }
        />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to="/orders"
          className="group rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow)] transition-colors hover:border-[var(--primary)]"
        >
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Review recent invoices and open order detail.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
            Open orders
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link
          to="/products"
          className="group rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow)] transition-colors hover:border-[var(--primary)]"
        >
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Browse catalog items published for this store.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
            Open products
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </div>
  );
}
