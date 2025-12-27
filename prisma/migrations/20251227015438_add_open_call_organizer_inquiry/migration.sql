-- CreateTable
CREATE TABLE "open_call_organizer_inquiries" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "openCallUrl" TEXT,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "open_call_organizer_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "open_call_organizer_inquiries_email_idx" ON "open_call_organizer_inquiries"("email");

-- CreateIndex
CREATE INDEX "open_call_organizer_inquiries_action_idx" ON "open_call_organizer_inquiries"("action");

-- CreateIndex
CREATE INDEX "open_call_organizer_inquiries_createdAt_idx" ON "open_call_organizer_inquiries"("createdAt");
