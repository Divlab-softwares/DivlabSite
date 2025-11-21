/*
  Warnings:

  - The primary key for the `Formation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Formation" DROP CONSTRAINT "Formation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Formation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Formation_id_seq";
