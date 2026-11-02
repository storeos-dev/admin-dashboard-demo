import { useQuery } from "@tanstack/react-query";
import { ErrorBanner } from "@/components/error-banner";
import { StatusBadge } from "@/components/status-badge";
import { formatMoney } from "@/lib/format";
import { ApiError, gqlRequest } from "@/lib/gql";
import { PRODUCTS_QUERY } from "@/lib/queries";

type ProductsData = {
  inventory__products: {
    nodes: {
      _id: string;
      title: string;
      handle: string;
      price: number;
      status: string;
      collections?: { name: string }[] | null;
    }[];
    meta: {
      totalCount: number;
      currentPage: number;
      hasNextPage: boolean;
      totalPages: number;
    };
  };
};

export function ProductsPage() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      gqlRequest<ProductsData>(PRODUCTS_QUERY, {
        where: { page: 1, limit: 25 },
      }),
  });

  const products = query.data?.inventory__products.nodes ?? [];
  const total = query.data?.inventory__products.meta.totalCount;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
          Catalog
        </p>
        <h1
          className="mt-1 text-4xl text-[var(--fg)]"
          style={{ fontFamily: "var(--display)" }}
        >
          Products
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {total != null ? `${total} total` : "Loading…"} ·{" "}
          <code className="text-xs">inventory__products</code>
        </p>
      </header>

      {query.isError ? (
        <ErrorBanner
          title="Could not load products"
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
            Loading products…
          </p>
        ) : null}

        {!query.isLoading && !query.isError && products.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">
            No products yet for this store.
          </p>
        ) : null}

        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[#f7faf8] text-xs tracking-wide text-[var(--muted)] uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Handle</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Collections</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-[#f7faf8]">
                    <td className="px-4 py-3 font-medium">{product.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
                      {product.handle}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={product.status} />
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {product.collections?.map((c) => c.name).join(", ") ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatMoney(product.price)}
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
