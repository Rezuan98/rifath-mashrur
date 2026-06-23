"use client";

import { useState } from "react";
import Image from "next/image";
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

  const { startUpload } = useUploadThing("achievementImage", {
    onClientUploadComplete: (files) => {
      const fileUrl = files[0]?.url;
      if (fileUrl) setUrl(fileUrl);
      setUploading(false);
      setError("");
    },
    onUploadError: (err) => {
      setError(err.message);
      setUploading(false);
    },
  });

  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
        {label}{optional ? "" : " *"}
      </label>

      <input type="hidden" name={name} value={url} required={!optional && !url} />

      {url && (
        <div className="relative mb-3 w-full h-48 bg-cream/[0.04] border border-cream/[0.1] overflow-hidden">
          <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="flex items-center gap-3">
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
              const files = Array.from(e.target.files ?? []);
              if (!files.length) return;
              setUploading(true);
              setError("");
              await startUpload(files);
            }}
          />
          {uploading ? "Uploading…" : url ? "Replace" : "Upload Image"}
        </label>

        {url && !uploading && (
          <span className="text-green text-xs">Uploaded</span>
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
