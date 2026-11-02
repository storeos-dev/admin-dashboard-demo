import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import { ApiError, gqlRequest } from "@/lib/gql";
import { ORDER_DETAIL_QUERY } from "@/lib/queries";

type OrderDetailData = {
  sale__invoice: {
    _id: string;
    invoiceUID: string;
    paymentStatus: string;
    invoiceStatus: string;
    paymentMethod?: string | null;
    note?: string | null;
    subTotalAmount: number;
    netTotalAmount: number;
    taxAmount?: number | null;
    deliveryCharge?: number | null;
    deliveryArea?: string | null;
    createdAt: string;
    customer?: {
      name?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
    } | null;
    shippingAddress?: { caption?: string | null } | null;
    lineItems: {
      quantity: number;
      unitPrice: number;
      sku?: string | null;
      item?: { name?: string | null } | null;
    }[];
  };
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const query = useQuery({
    queryKey: ["order", id],
    enabled: Boolean(id),
    queryFn: () =>
      gqlRequest<OrderDetailData>(ORDER_DETAIL_QUERY, {
        where: { key: "_id", operator: "eq", value: id },
      }),
  });

  const order = query.data?.sale__invoice;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--primary)]"
        >
          <ArrowLeft className="size-3.5" />
          Back to orders
        </Link>
        <h1
          className="mt-3 text-4xl text-[var(--fg)]"
          style={{ fontFamily: "var(--display)" }}
        >
          {order?.invoiceUID || "Order"}
        </h1>
        {order ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {formatDate(order.createdAt)}
          </p>
        ) : null}
      </div>

      {query.isError ? (
        <ErrorBanner
          title="Could not load order"
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Try going back to the list."
          }
        />
      ) : null}

      {query.isLoading ? (
        <p className="text-sm text-[var(--muted)]">Loading order…</p>
      ) : null}

      {order ? (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="space-y-4">
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow)]">
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={order.invoiceStatus} />
                <StatusBadge value={order.paymentStatus} />
                {order.paymentMethod ? (
                  <StatusBadge value={order.paymentMethod} />
                ) : null}
              </div>

              <h2 className="mt-5 text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">
                Line items
              </h2>
              <ul className="mt-3 divide-y divide-[var(--border)]">
                {order.lineItems.map((line, index) => (
                  <li
                    key={`${line.sku ?? "line"}-${index}`}
                    className="flex items-start justify-between gap-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {line.item?.name || "Item"}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        Qty {line.quantity}
                        {line.sku ? ` · ${line.sku}` : ""}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatMoney(line.unitPrice * line.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow)]">
              <h2 className="text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">
                Customer
              </h2>
              <p className="mt-3 font-medium">
                {order.customer?.name || "Guest"}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {order.customer?.phoneNumber || order.customer?.email || "—"}
              </p>
              {order.shippingAddress?.caption ? (
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {order.shippingAddress.caption}
                </p>
              ) : null}
              {order.deliveryArea ? (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Area: {order.deliveryArea}
                </p>
              ) : null}
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow)]">
              <h2 className="text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">
                Totals
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--muted)]">Subtotal</dt>
                  <dd>{formatMoney(order.subTotalAmount)}</dd>
                </div>
                {order.deliveryCharge != null ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--muted)]">Delivery</dt>
                    <dd>{formatMoney(order.deliveryCharge)}</dd>
                  </div>
                ) : null}
                {order.taxAmount != null ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--muted)]">Tax</dt>
                    <dd>{formatMoney(order.taxAmount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3 border-t border-[var(--border)] pt-2 font-semibold">
                  <dt>Net total</dt>
                  <dd>{formatMoney(order.netTotalAmount)}</dd>
                </div>
              </dl>
              {order.note ? (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  Note: {order.note}
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
