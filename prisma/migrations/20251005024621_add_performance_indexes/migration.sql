-- CreateIndex
CREATE INDEX "contests_isActive_idx" ON "public"."contests"("isActive");

-- CreateIndex
CREATE INDEX "contests_area_idx" ON "public"."contests"("area");

-- CreateIndex
CREATE INDEX "contests_organizerType_idx" ON "public"."contests"("organizerType");

-- CreateIndex
CREATE INDEX "contests_deadline_idx" ON "public"."contests"("deadline");

-- CreateIndex
CREATE INDEX "contests_createdAt_idx" ON "public"."contests"("createdAt");

-- CreateIndex
CREATE INDEX "events_isActive_idx" ON "public"."events"("isActive");

-- CreateIndex
CREATE INDEX "events_area_idx" ON "public"."events"("area");

-- CreateIndex
CREATE INDEX "events_organizerType_idx" ON "public"."events"("organizerType");

-- CreateIndex
CREATE INDEX "events_startDate_idx" ON "public"."events"("startDate");

-- CreateIndex
CREATE INDEX "events_createdAt_idx" ON "public"."events"("createdAt");

-- CreateIndex
CREATE INDEX "facilities_isActive_idx" ON "public"."facilities"("isActive");

-- CreateIndex
CREATE INDEX "facilities_area_idx" ON "public"."facilities"("area");

-- CreateIndex
CREATE INDEX "facilities_organizerType_idx" ON "public"."facilities"("organizerType");

-- CreateIndex
CREATE INDEX "facilities_isDropinAvailable_idx" ON "public"."facilities"("isDropinAvailable");

-- CreateIndex
CREATE INDEX "facilities_isNexanaAvailable_idx" ON "public"."facilities"("isNexanaAvailable");

-- CreateIndex
CREATE INDEX "facilities_createdAt_idx" ON "public"."facilities"("createdAt");

-- CreateIndex
CREATE INDEX "knowledge_isActive_idx" ON "public"."knowledge"("isActive");

-- CreateIndex
CREATE INDEX "knowledge_categoryTag_idx" ON "public"."knowledge"("categoryTag");

-- CreateIndex
CREATE INDEX "knowledge_area_idx" ON "public"."knowledge"("area");

-- CreateIndex
CREATE INDEX "knowledge_publishedAt_idx" ON "public"."knowledge"("publishedAt");

-- CreateIndex
CREATE INDEX "knowledge_createdAt_idx" ON "public"."knowledge"("createdAt");

-- CreateIndex
CREATE INDEX "news_isActive_idx" ON "public"."news"("isActive");

-- CreateIndex
CREATE INDEX "news_type_idx" ON "public"."news"("type");

-- CreateIndex
CREATE INDEX "news_area_idx" ON "public"."news"("area");

-- CreateIndex
CREATE INDEX "news_publishedAt_idx" ON "public"."news"("publishedAt");

-- CreateIndex
CREATE INDEX "news_createdAt_idx" ON "public"."news"("createdAt");

-- CreateIndex
CREATE INDEX "open_calls_isActive_idx" ON "public"."open_calls"("isActive");

-- CreateIndex
CREATE INDEX "open_calls_area_idx" ON "public"."open_calls"("area");

-- CreateIndex
CREATE INDEX "open_calls_organizerType_idx" ON "public"."open_calls"("organizerType");

-- CreateIndex
CREATE INDEX "open_calls_deadline_idx" ON "public"."open_calls"("deadline");

-- CreateIndex
CREATE INDEX "open_calls_createdAt_idx" ON "public"."open_calls"("createdAt");
