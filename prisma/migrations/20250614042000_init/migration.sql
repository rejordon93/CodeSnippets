-- DropIndex
DROP INDEX "Friend_requesterId_recipientId_key";

-- CreateIndex
CREATE INDEX "Friend_requesterId_idx" ON "Friend"("requesterId");

-- CreateIndex
CREATE INDEX "Friend_recipientId_idx" ON "Friend"("recipientId");
