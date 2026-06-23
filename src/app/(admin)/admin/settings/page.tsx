import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ColorField } from "@/app/(admin)/_components/color-field";
import { ImageUploadField } from "@/app/(admin)/_components/image-upload-field";

async function updateSettings(formData: FormData) {
  "use server";

  const data = {
    brandName:       (formData.get("brandName")       as string).trim() || "Rifat Mashrur",
    metaTitle:       (formData.get("metaTitle")       as string).trim(),
    metaDescription: (formData.get("metaDescription") as string).trim(),
    tagline:         (formData.get("tagline")         as string).trim(),
    email:           (formData.get("email")           as string).trim(),
    phone:           (formData.get("phone")           as string).trim(),
    colorCanvas:     (formData.get("colorCanvas")     as string).trim() || "#1A1917",
    colorCream:      (formData.get("colorCream")      as string).trim() || "#F5EFE0",
    colorGreen:      (formData.get("colorGreen")      as string).trim() || "#7CFC00",
    profileImage:    ((formData.get("profileImage")   as string) || "").trim(),
    faviconUrl:      ((formData.get("faviconUrl")     as string) || "").trim(),
    ogImage:         ((formData.get("ogImage")        as string) || "").trim(),
  };

  const newPassword = ((formData.get("newPassword") as string) || "").trim();
  const passwordPatch = newPassword ? { passwordHash: hashPassword(newPassword) } : {};

  await db.siteSettings.upsert({
    where:  { id: "singleton" },
    create: { id: "singleton", ...data, ...passwordPatch },
    update: { ...data, ...passwordPatch },
  });

  // Settings feed every route (brand, colors, metadata) — revalidate the whole tree.
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const s = await getSettings();

  let hasPassword = false;
  try {
    const row = await db.siteSettings.findUnique({
      where: { id: "singleton" },
      select: { passwordHash: true },
    });
    hasPassword = !!row?.passwordHash;
  } catch {}

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Site Settings</h1>
        <p className="text-cream/40 text-sm mt-1">
          Brand, contact details, colors, and admin password — applied across the whole site.
        </p>
      </div>

      {saved && (
        <div className="mb-6 rounded-lg border border-green/30 bg-green/[0.06] px-4 py-3 text-sm text-green">
          Settings saved.
        </div>
      )}

      <form action={updateSettings} className="flex flex-col gap-10">
        {/* ── Brand ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-cream/50 text-xs tracking-widest uppercase border-b border-cream/[0.07] pb-2">
            Brand
          </h2>
          <Field label="Brand Name" name="brandName" defaultValue={s.brandName} placeholder="Rifat Mashrur" />
          <Field
            label="Browser Tab Title"
            name="metaTitle"
            defaultValue={s.metaTitle}
            placeholder="Rifat Mashrur — Digital Marketing"
            hint="Shown in the browser tab and search results."
          />
          <Textarea
            label="Meta Description"
            name="metaDescription"
            defaultValue={s.metaDescription}
            placeholder="Data-driven digital marketing campaigns that convert."
            hint="Used by search engines and link previews."
          />
          <Field
            label="Footer Tagline"
            name="tagline"
            defaultValue={s.tagline}
            placeholder="Data-driven digital marketing."
          />
        </section>

        {/* ── Contact ───────────────────────────────────────────── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-cream/50 text-xs tracking-widest uppercase border-b border-cream/[0.07] pb-2">
            Contact
          </h2>
          <Field label="Email" name="email" type="email" defaultValue={s.email} placeholder="you@example.com" />
          <Field label="Phone" name="phone" defaultValue={s.phone} placeholder="+880 1XXX-XXXXXX (optional)" />
        </section>

        {/* ── Brand colors ──────────────────────────────────────── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-cream/50 text-xs tracking-widest uppercase border-b border-cream/[0.07] pb-2">
            Brand Colors
          </h2>
          <p className="text-cream/30 text-xs -mt-2">
            These restyle the public site. The admin panel keeps its own fixed colors so it stays readable.
          </p>
          <ColorField name="colorCanvas" label="Background" defaultValue={s.colorCanvas} hint="Page background." />
          <ColorField name="colorCream"  label="Text"       defaultValue={s.colorCream}  hint="Primary text color." />
          <ColorField name="colorGreen"  label="Accent"     defaultValue={s.colorGreen}  hint="Buttons, highlights, links." />
        </section>

        {/* ── Images ────────────────────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <h2 className="text-cream/50 text-xs tracking-widest uppercase border-b border-cream/[0.07] pb-2">
            Images
          </h2>
          <ImageUploadField
            name="profileImage"
            label="Profile Photo"
            defaultValue={s.profileImage}
            optional
            hint="Your headshot, shown in the homepage hero. Square images look best."
          />
          <ImageUploadField
            name="faviconUrl"
            label="Favicon"
            defaultValue={s.faviconUrl}
            optional
            hint="The little icon in the browser tab. Use a square PNG or SVG (e.g. 512×512)."
          />
          <ImageUploadField
            name="ogImage"
            label="Social Share Image"
            defaultValue={s.ogImage}
            optional
            hint="Preview image when your link is shared on social apps. 1200×630 recommended."
          />
        </section>

        {/* ── Security ──────────────────────────────────────────── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-cream/50 text-xs tracking-widest uppercase border-b border-cream/[0.07] pb-2">
            Admin Password
          </h2>
          <Field
            label="New Password"
            name="newPassword"
            type="password"
            defaultValue=""
            placeholder={hasPassword ? "Leave blank to keep current password" : "Set a password to replace the .env default"}
            hint={
              hasPassword
                ? "A custom password is currently set. Type a new one to change it."
                : "Currently using the ADMIN_PASSWORD from .env. Set one here to override it."
            }
          />
        </section>

        <div className="flex items-center gap-4 pt-2 border-t border-cream/[0.07]">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={type === "password" ? "new-password" : "off"}
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
      />
      {hint && <p className="text-cream/30 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={2}
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
      />
      {hint && <p className="text-cream/30 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}
