/*
  Warnings:

  - You are about to drop the column `tags` on the `Journal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Made the column `uuid` on table `Journal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "tags",
ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uuid" SET NOT NULL;

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalTags" (
    "journalId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "JournalTags_pkey" PRIMARY KEY ("journalId","tagId")
);

-- CreateTable
CREATE TABLE "_JournalTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JournalTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_uuid_key" ON "Tag"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_JournalTags_B_index" ON "_JournalTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Role_uuid_key" ON "Role"("uuid");

-- AddForeignKey
ALTER TABLE "JournalTags" ADD CONSTRAINT "JournalTags_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalTags" ADD CONSTRAINT "JournalTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalTags" ADD CONSTRAINT "_JournalTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalTags" ADD CONSTRAINT "_JournalTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
