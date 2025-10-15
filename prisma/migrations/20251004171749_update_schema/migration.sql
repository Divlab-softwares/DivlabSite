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
    "receiverId" TEXT NOT NULL DEFAULT 'chatBot',
    "userId" TEXT NOT NULL,
    "convId" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conversation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conversation" ("archived", "convId", "createdAt", "deleted", "ephemeral", "id", "input", "reqScore", "userId", "warned") SELECT "archived", "convId", "createdAt", "deleted", "ephemeral", "id", "input", "reqScore", "userId", "warned" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
