-- CreateTable
CREATE TABLE "workspace_likes" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_comments" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userIdentifier" TEXT NOT NULL,
    "userName" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workspace_likes_workspaceId_idx" ON "workspace_likes"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_likes_userIdentifier_idx" ON "workspace_likes"("userIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_likes_workspaceId_userIdentifier_key" ON "workspace_likes"("workspaceId", "userIdentifier");

-- CreateIndex
CREATE INDEX "workspace_comments_workspaceId_idx" ON "workspace_comments"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_comments_userIdentifier_idx" ON "workspace_comments"("userIdentifier");

-- CreateIndex
CREATE INDEX "workspace_comments_createdAt_idx" ON "workspace_comments"("createdAt");
