-- CreateTable
CREATE TABLE "HeroStat" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '◈',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "workTitle" TEXT NOT NULL DEFAULT 'Selected Work',
ADD COLUMN     "workSubtitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "servicesTitle" TEXT NOT NULL DEFAULT 'What I Do',
ADD COLUMN     "servicesSubtitle" TEXT NOT NULL DEFAULT 'Full-stack digital marketing capabilities built to work together.';
