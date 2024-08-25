-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_queries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "intentCategory" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "searchResults" TEXT,
    "ragResultId" TEXT,
    "deepRAGProfileId" TEXT
);
INSERT INTO "new_queries" ("content", "createdAt", "deepRAGProfileId", "id", "intentCategory", "ragResultId", "searchResults", "userId") SELECT "content", "createdAt", "deepRAGProfileId", "id", "intentCategory", "ragResultId", "searchResults", "userId" FROM "queries";
DROP TABLE "queries";
ALTER TABLE "new_queries" RENAME TO "queries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
