-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "faviconUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "profileImage" TEXT NOT NULL DEFAULT '';
