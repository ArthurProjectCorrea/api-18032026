/*
  Warnings:

  - You are about to drop the column `cep` on the `people_address` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `people_address` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `people_address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `people_address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `people_address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "people_address" DROP COLUMN "cep",
DROP COLUMN "city",
DROP COLUMN "district",
DROP COLUMN "state",
DROP COLUMN "street",
ADD COLUMN     "cep_id" INTEGER,
ADD COLUMN     "not_cep" TEXT;

-- AddForeignKey
ALTER TABLE "people_address" ADD CONSTRAINT "people_address_cep_id_fkey" FOREIGN KEY ("cep_id") REFERENCES "ceps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
