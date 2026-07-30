-- AlterTable Customer
ALTER TABLE "Customer"
ADD COLUMN "matchedParticipantNo" TEXT,
ADD COLUMN "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN "letter1Arrived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "letter2Arrived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "letter3Arrived" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Customer"
DROP COLUMN "phone",
DROP COLUMN "ageGroup";

-- AlterTable Task
DROP INDEX IF EXISTS "Task_barcode_idx";

ALTER TABLE "Task"
DROP COLUMN "barcode",
DROP COLUMN "letter1Arrived",
DROP COLUMN "letter2Arrived",
DROP COLUMN "letter3Arrived";

CREATE INDEX "Task_participantNo_idx" ON "Task"("participantNo");
