/*
  Warnings:

  - Added the required column `department_id` to the `positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `positions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_position_id_fkey";

-- AlterTable
ALTER TABLE "positions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "department_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "avatar_url" SET DEFAULT '',
ALTER COLUMN "position_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "brazil_regions" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ibge_code" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brazil_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" CHAR(2) NOT NULL,
    "ibge_code" DECIMAL(65,30),
    "region_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intermediate_regions" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ibge_code" DECIMAL(65,30),
    "state_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intermediate_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immediate_regions" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ibge_code" DECIMAL(65,30),
    "state_id" INTEGER,
    "intermediate_region_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "immediate_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ibge_code" DECIMAL(65,30),
    "state_id" INTEGER,
    "immediate_region_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cep" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "cities_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schooling" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schooling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penalty_regime" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penalty_regime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screens" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accesses" (
    "id" SERIAL NOT NULL,
    "position_id" INTEGER NOT NULL,
    "screen_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "scope" TEXT DEFAULT 'all',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mothers_name" TEXT NOT NULL,
    "fathers_name" TEXT,
    "date_of_birth" DATE NOT NULL,
    "cpf" TEXT NOT NULL,
    "schooling_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_lawsuit" (
    "id" TEXT NOT NULL,
    "people_id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "regime_progression" DATE NOT NULL,
    "penalty_regime_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_lawsuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_telephone" (
    "id" SERIAL NOT NULL,
    "telephone" TEXT NOT NULL,
    "people_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_telephone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_address" (
    "id" SERIAL NOT NULL,
    "cep_id" INTEGER,
    "not_cep" TEXT,
    "people_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeu_service" (
    "id" TEXT NOT NULL,
    "people_lawsuit_id" TEXT NOT NULL,
    "proof_of_residence" TEXT NOT NULL,
    "proof_of_employment" TEXT NOT NULL,
    "proof_of_legal_waiver" TEXT NOT NULL,
    "is_first_signature" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "deleted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "seeu_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" TEXT,
    "old_data" JSONB,
    "new_data" JSONB,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brazil_regions_ibge_code_key" ON "brazil_regions"("ibge_code");

-- CreateIndex
CREATE UNIQUE INDEX "states_ibge_code_key" ON "states"("ibge_code");

-- CreateIndex
CREATE UNIQUE INDEX "intermediate_regions_ibge_code_key" ON "intermediate_regions"("ibge_code");

-- CreateIndex
CREATE UNIQUE INDEX "immediate_regions_ibge_code_key" ON "immediate_regions"("ibge_code");

-- CreateIndex
CREATE UNIQUE INDEX "cities_ibge_code_key" ON "cities"("ibge_code");

-- CreateIndex
CREATE UNIQUE INDEX "cep_cep_key" ON "cep"("cep");

-- CreateIndex
CREATE UNIQUE INDEX "schooling_name_key" ON "schooling"("name");

-- CreateIndex
CREATE UNIQUE INDEX "penalty_regime_name_key" ON "penalty_regime"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "screens_name_key_key" ON "screens"("name_key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key_key" ON "permissions"("name_key");

-- CreateIndex
CREATE UNIQUE INDEX "people_cpf_key" ON "people"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "people_lawsuit_document_key" ON "people_lawsuit"("document");

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "brazil_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intermediate_regions" ADD CONSTRAINT "intermediate_regions_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immediate_regions" ADD CONSTRAINT "immediate_regions_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immediate_regions" ADD CONSTRAINT "immediate_regions_intermediate_region_id_fkey" FOREIGN KEY ("intermediate_region_id") REFERENCES "intermediate_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_immediate_region_id_fkey" FOREIGN KEY ("immediate_region_id") REFERENCES "immediate_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cep" ADD CONSTRAINT "cep_cities_id_fkey" FOREIGN KEY ("cities_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "screens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesses" ADD CONSTRAINT "accesses_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_schooling_id_fkey" FOREIGN KEY ("schooling_id") REFERENCES "schooling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_lawsuit" ADD CONSTRAINT "people_lawsuit_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_lawsuit" ADD CONSTRAINT "people_lawsuit_penalty_regime_id_fkey" FOREIGN KEY ("penalty_regime_id") REFERENCES "penalty_regime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_telephone" ADD CONSTRAINT "people_telephone_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_address" ADD CONSTRAINT "people_address_cep_id_fkey" FOREIGN KEY ("cep_id") REFERENCES "cep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_address" ADD CONSTRAINT "people_address_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeu_service" ADD CONSTRAINT "seeu_service_people_lawsuit_id_fkey" FOREIGN KEY ("people_lawsuit_id") REFERENCES "people_lawsuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeu_service" ADD CONSTRAINT "seeu_service_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeu_service" ADD CONSTRAINT "seeu_service_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeu_service" ADD CONSTRAINT "seeu_service_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
