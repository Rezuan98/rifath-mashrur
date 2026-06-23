"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
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

      {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full bg-green text-canvas font-bold text-sm py-3 hover:bg-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Signing in…" : "Sign In →"}
      </button>
    </form>
  );
}
