-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "numchild" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT
);
INSERT INTO "new_node" ("depth", "id", "name", "numchild", "path") SELECT "depth", "id", "name", "numchild", "path" FROM "node";
DROP TABLE "node";
ALTER TABLE "new_node" RENAME TO "node";
CREATE UNIQUE INDEX "node_path_key" ON "node"("path");
CREATE INDEX "node_path_idx" ON "node"("path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
