import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const { brandName } = await getSettings();

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
          <span className="font-bold text-sm tracking-tight text-cream">{brandName}</span>
          <span className="text-cream/20 text-xs ml-1">/ Admin</span>
        </div>

        <div className="border border-cream/[0.09] bg-cream/[0.02] p-8">
          <h1 className="text-cream font-bold text-xl mb-1">Sign in</h1>
          <p className="text-cream/40 text-sm mb-8">Enter your admin password to continue.</p>

          <LoginForm />
        </div>

        <p className="text-center text-cream/20 text-xs mt-6">
          <Link href="/" className="hover:text-cream/50 transition-colors">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
