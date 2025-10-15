-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conversation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "input" TEXT NOT NULL,
    "reqScore" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "warned" BOOLEAN NOT NULL,
    "ephemeral" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conversation" ("archived", "createdAt", "deleted", "ephemeral", "id", "input", "reqScore", "userId", "warned") SELECT "archived", "createdAt", "deleted", "ephemeral", "id", "input", "reqScore", "userId", "warned" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
