import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  achievementImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const cookie = req.headers.get("cookie") ?? "";
      const session = cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("admin_session="))
        ?.split("=")[1];

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
