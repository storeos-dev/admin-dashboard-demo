import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ApiError, gqlRequest } from "@/lib/gql";
import { isAuthenticated, setAccessToken } from "@/lib/auth";
import { LOGIN_MUTATION } from "@/lib/queries";
import { ErrorBanner } from "@/components/error-banner";

type LoginData = {
  identity__login: {
    accessToken: string;
    mustChangePassword?: boolean;
    memberships: { tenant: string; roles: string[] }[];
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const data = await gqlRequest<LoginData>(LOGIN_MUTATION, {
        input: { email: email.trim(), password },
      });
      setAccessToken(data.identity__login.accessToken);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not sign in. Check your credentials and API key.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-[calc(var(--radius)+6px)] border border-[var(--border)] bg-[var(--bg-elevated)] p-8 shadow-[var(--shadow)]">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--primary)] uppercase">
          Custom admin demo
        </p>
        <h1
          className="mt-2 text-4xl text-[var(--fg)]"
          style={{ fontFamily: "var(--display)" }}
        >
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Sandbox admin. Set{" "}
          <code className="rounded bg-[var(--primary-soft)] px-1.5 py-0.5 text-xs text-[var(--primary)]">
            VITE_STOREOS_API_KEY
          </code>{" "}
          in <code className="text-xs">.env</code>, then sign in with a staff
          account.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          {error ? <ErrorBanner message={error} title="Sign-in failed" /> : null}

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--primary)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--primary)]"
            />
          </label>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-fg)] transition-opacity disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
