-- AlterTable
ALTER TABLE "events" ADD COLUMN     "entrance" TEXT,
ADD COLUMN     "link" TEXT,
ALTER COLUMN "contact" DROP NOT NULL;
