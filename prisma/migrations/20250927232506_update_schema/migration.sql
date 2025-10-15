/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Signup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Signup_email_key" ON "Signup"("email");
