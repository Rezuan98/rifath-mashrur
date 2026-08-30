import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  achievementImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const cookie = req.headers.get("cookie") ?? "";
      // Take everything after the first "=" and decode it: cookie values are
      // URL-encoded when set, and splitting on "=" would truncate any secret
      // containing one (e.g. base64 padding).
      const raw = cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("admin_session="))
        ?.slice("admin_session=".length);
      const session = raw ? decodeURIComponent(raw) : undefined;

      if (!session || session !== process.env.ADMIN_SECRET) {
        throw new UploadThingError("Unauthorized");
      }
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
