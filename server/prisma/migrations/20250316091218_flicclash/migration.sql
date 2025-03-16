-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('Codeforces', 'CodeChef', 'LeetCode');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('email', 'sms', 'both');

-- CreateTable
CREATE TABLE "contests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "solution_url" TEXT,
    "duration" INTEGER NOT NULL,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "codeforces_enabled" BOOLEAN NOT NULL DEFAULT true,
    "codechef_enabled" BOOLEAN NOT NULL DEFAULT true,
    "leetcode_enabled" BOOLEAN NOT NULL DEFAULT true,
    "notification_type" "NotificationType" NOT NULL DEFAULT 'email',
    "reminder_time" INTEGER NOT NULL DEFAULT 60,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "contest_id" INTEGER NOT NULL,
    "reminder_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contests_platform_external_id_key" ON "contests"("platform", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_contest_id_key" ON "bookmarks"("user_id", "contest_id");

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
