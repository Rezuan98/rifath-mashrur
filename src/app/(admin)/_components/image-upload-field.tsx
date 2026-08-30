"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  name?: string;
  defaultValue?: string;
  label?: string;
  /** When true, the field is not required and the label drops the "*". */
  optional?: boolean;
  /** Optional helper text shown under the upload control. */
  hint?: string;
}

export function ImageUploadField({
  name = "imageUrl",
  defaultValue = "",
  label = "Image",
  optional = false,
  hint,
}: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [broken, setBroken] = useState(false);

  const { startUpload } = useUploadThing("achievementImage", {
    onUploadError: (err) => {
      setError(err.message || "Upload failed.");
      setUploading(false);
    },
  });

  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
        {label}{optional ? "" : " *"}
      </label>

      {url && !broken && (
        <div className="mb-3 w-full h-48 bg-cream/[0.04] border border-cream/[0.1] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setBroken(true)}
          />
        </div>
      )}
      {url && broken && (
        <p className="mb-3 text-red-400 text-xs">
          That URL didn&apos;t load as an image. Check the address or upload a file instead.
        </p>
      )}

      {/*
        A real, focusable text input — not type="hidden". Hidden and readonly
        inputs are barred from HTML constraint validation, so `required` on one
        is silently ignored and the form submits an empty imageUrl. Keeping it
        visible also lets an admin paste an image URL instead of uploading.

        type="text" on purpose: type="url" rejects anything that isn't a fully
        qualified URL, so a pasted path blocked the whole form behind a browser
        tooltip. `required` still does the job this field exists for — stopping
        an EMPTY submit — and the preview below flags a value that won't load.
      */}
      <input
        type="text"
        inputMode="url"
        name={name}
        value={url}
        required={!optional}
        onChange={(e) => {
          setUrl(e.target.value.trim());
          setBroken(false);
          setError("");
        }}
        placeholder="Upload a file below, or paste an image URL"
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-xs px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 font-mono"
      />

      <div className="flex items-center gap-3 mt-3">
        <label
          className={`inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors ${
            uploading
              ? "border-cream/[0.06] text-cream/30 cursor-not-allowed bg-cream/[0.02]"
              : "border-cream/[0.12] text-cream/70 hover:text-cream hover:border-cream/30 bg-cream/[0.04] cursor-pointer"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              // Reset so picking the same file again still fires onChange.
              e.target.value = "";
              if (!file) return;

              setUploading(true);
              setError("");
              setBroken(false);

              // Read the URL off the resolved value rather than only from
              // onClientUploadComplete, so a callback that never fires can't
              // leave the field silently empty.
              const res = await startUpload([file]);
              const uploaded = res?.[0];
              const fileUrl =
                uploaded?.serverData?.url ?? uploaded?.ufsUrl ?? uploaded?.url ?? "";

              if (fileUrl) {
                setUrl(fileUrl);
                setError("");
              } else if (res) {
                setError("Upload finished but returned no file URL. Please try again.");
              }
              setUploading(false);
            }}
          />
          {uploading ? "Uploading…" : url ? "Replace" : "Upload Image"}
        </label>

        {url && !uploading && !broken && (
          <span className="text-green text-xs">Image set</span>
        )}
        {uploading && (
          <span className="text-cream/30 text-xs animate-pulse">Please wait…</span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-red-400 text-xs">{error}</p>
      )}

      {hint && <p className="mt-2 text-cream/30 text-xs">{hint}</p>}
    </div>
  );
}
