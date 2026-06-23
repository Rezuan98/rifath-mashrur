"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get("password") as string;

  // Prefer the password set in admin Settings; fall back to ADMIN_PASSWORD
  // env only when no custom password has been saved (so the old default
  // stops working once a real one is set).
  let ok = false;
  let hasCustomPassword = false;
  try {
    const row = await db.siteSettings.findUnique({
      where: { id: "singleton" },
      select: { passwordHash: true },
    });
    if (row?.passwordHash) {
      hasCustomPassword = true;
      ok = verifyPassword(password ?? "", row.passwordHash);
    }
  } catch {
    // DB unreachable → fall through to env password as recovery
  }
  if (!hasCustomPassword) {
    ok = !!password && password === process.env.ADMIN_PASSWORD;
  }

  if (!ok) {
    return { error: "Invalid password." };
  }

  const store = await cookies();
  store.set("admin_session", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete("admin_session");
  redirect("/login");
}
