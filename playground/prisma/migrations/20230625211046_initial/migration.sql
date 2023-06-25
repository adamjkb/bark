-- CreateTable
CREATE TABLE "node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "numchild" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "node_path_key" ON "node"("path");
