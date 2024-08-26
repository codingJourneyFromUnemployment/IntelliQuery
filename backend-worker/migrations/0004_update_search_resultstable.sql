-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_search_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "queryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "serperBatchRawData" TEXT,
    "searchLinks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_search_results" ("createdAt", "id", "queryId", "type") SELECT "createdAt", "id", "queryId", "type" FROM "search_results";
DROP TABLE "search_results";
ALTER TABLE "new_search_results" RENAME TO "search_results";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
