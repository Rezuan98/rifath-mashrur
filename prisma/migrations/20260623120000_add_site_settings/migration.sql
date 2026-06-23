-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "brandName" TEXT NOT NULL DEFAULT 'Rifat Mashrur',
    "metaTitle" TEXT NOT NULL DEFAULT 'Rifat Mashrur — Digital Marketing',
    "metaDescription" TEXT NOT NULL DEFAULT 'Data-driven digital marketing campaigns that convert.',
    "tagline" TEXT NOT NULL DEFAULT 'Data-driven digital marketing.',
    "email" TEXT NOT NULL DEFAULT 'hello@studio.com',
    "phone" TEXT NOT NULL DEFAULT '',
    "colorCanvas" TEXT NOT NULL DEFAULT '#1A1917',
    "colorCream" TEXT NOT NULL DEFAULT '#F5EFE0',
    "colorGreen" TEXT NOT NULL DEFAULT '#7CFC00',
    "passwordHash" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
