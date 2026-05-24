"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      {/* Dot grid bg */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #7CFC00 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5 mb-10">
          <span className="w-5 h-5 border border-green/50 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-green" />
          </span>
          <span className="font-bold text-sm tracking-tight text-cream">Studio</span>
          <span className="text-cream/20 text-xs ml-1">/ Admin</span>
        </div>

        <div className="border border-cream/[0.09] bg-cream/[0.02] p-8">
          <h1 className="text-cream font-bold text-xl mb-1">Sign in</h1>
          <p className="text-cream/40 text-sm mb-8">Enter your admin password to continue.</p>

          <form action={action} className="flex flex-col gap-4">
            <div>
              <label htmlFor="password" className="block text-cream/50 text-xs mb-2 tracking-widest uppercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-3 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="text-red-400 text-xs">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full bg-green text-canvas font-bold text-sm py-3 hover:bg-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="text-center text-cream/20 text-xs mt-6">
          <a href="/" className="hover:text-cream/50 transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
