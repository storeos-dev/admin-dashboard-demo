import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import { ApiError, gqlRequest } from "@/lib/gql";
import { ORDERS_QUERY } from "@/lib/queries";

type OrdersData = {
  sale__invoices: {
    nodes: {
      _id: string;
      invoiceUID: string;
      paymentStatus: string;
      invoiceStatus: string;
      paymentMethod?: string | null;
      netTotalAmount: number;
      createdAt: string;
      customer?: {
        name?: string | null;
        email?: string | null;
        phoneNumber?: string | null;
      } | null;
    }[];
    meta: {
      totalCount: number;
      currentPage: number;
      hasNextPage: boolean;
      totalPages: number;
    };
  };
};

export function OrdersPage() {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      gqlRequest<OrdersData>(ORDERS_QUERY, {
        where: { page: 1, limit: 25 },
      }),
  });

  const orders = query.data?.sale__invoices.nodes ?? [];
  const total = query.data?.sale__invoices.meta.totalCount;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
            Sales
          </p>
          <h1
            className="mt-1 text-4xl text-[var(--fg)]"
            style={{ fontFamily: "var(--display)" }}
          >
            Orders
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {total != null ? `${total} total` : "Loading…"} ·{" "}
            <code className="text-xs">sale__invoices</code>
          </p>
        </div>
      </header>

      {query.isError ? (
        <ErrorBanner
          title="Could not load orders"
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Try refreshing the page."
          }
        />
      ) : null}

      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]">
        {query.isLoading ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">
            Loading orders…
          </p>
        ) : null}

        {!query.isLoading && !query.isError && orders.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">
            No orders yet for this store.
          </p>
        ) : null}

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[#f7faf8] text-xs tracking-wide text-[var(--muted)] uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#f7faf8]">
                    <td className="px-4 py-3">
                      <Link
                        to={`/orders/${order._id}`}
                        className="font-medium text-[var(--primary)] hover:underline"
                      >
                        {order.invoiceUID}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {order.customer?.name || "Guest"}
                      </div>
                      <div className="text-xs text-[var(--muted)]">
                        {order.customer?.phoneNumber ||
                          order.customer?.email ||
                          "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={order.invoiceStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge value={order.paymentStatus} />
                        {order.paymentMethod ? (
                          <span className="text-xs text-[var(--muted)]">
                            {order.paymentMethod}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatMoney(order.netTotalAmount)}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
