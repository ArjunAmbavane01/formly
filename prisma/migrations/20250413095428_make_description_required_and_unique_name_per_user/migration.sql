/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "description" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Form_name_userId_key" ON "Form"("name", "userId");
