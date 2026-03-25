-- AlterTable
ALTER TABLE "seeu_service" ADD COLUMN     "address_id" INTEGER,
ADD COLUMN     "telephone_id" INTEGER;

-- AddForeignKey
ALTER TABLE "seeu_service" ADD CONSTRAINT "seeu_service_telephone_id_fkey" FOREIGN KEY ("telephone_id") REFERENCES "people_telephone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeu_service" ADD CONSTRAINT "seeu_service_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "people_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
