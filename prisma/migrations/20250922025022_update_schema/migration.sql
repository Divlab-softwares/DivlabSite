/*
  Warnings:

  - You are about to drop the column `surname` on the `SignUp` table. All the data in the column will be lost.
  - Added the required column `password` to the `SignUp` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SignUp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SignUp" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "SignUp";
DROP TABLE "SignUp";
ALTER TABLE "new_SignUp" RENAME TO "SignUp";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
