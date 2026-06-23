import { cache } from "react";
import { db } from "@/lib/db";

/** Fallbacks used before any settings row exists, or if the DB is unreachable. */
export const DEFAULT_SETTINGS = {
  brandName: "Rifat Mashrur",
  metaTitle: "Rifat Mashrur — Digital Marketing",
  metaDescription: "Data-driven digital marketing campaigns that convert.",
  tagline: "Data-driven digital marketing.",
  email: "hello@studio.com",
  phone: "",
  colorCanvas: "#1A1917",
  colorCream: "#F5EFE0",
  colorGreen: "#7CFC00",
  profileImage: "/images/profile.jpg", // fallback to the bundled photo
  faviconUrl: "",
  ogImage: "",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

/**
 * Reads the singleton settings row. Wrapped in React `cache` so it runs at
 * most once per request even though it's read from several places (metadata,
 * layout, page). Never exposes `passwordHash` — that's read directly where
 * needed (the login action).
 */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    if (row) {
      return {
        brandName: row.brandName,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        tagline: row.tagline,
        email: row.email,
        phone: row.phone,
        colorCanvas: row.colorCanvas,
        colorCream: row.colorCream,
        colorGreen: row.colorGreen,
        // Empty string in DB → keep the bundled fallback photo.
        profileImage: row.profileImage || DEFAULT_SETTINGS.profileImage,
        faviconUrl: row.faviconUrl,
        ogImage: row.ogImage,
      };
    }
  } catch {
    // table missing / DB down → fall back to defaults below
  }
  return DEFAULT_SETTINGS;
});
