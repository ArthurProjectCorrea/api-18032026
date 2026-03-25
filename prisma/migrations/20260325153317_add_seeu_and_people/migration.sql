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
CREATE TABLE "people" (
    "id" UUID NOT NULL,
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
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "number" TEXT NOT NULL,
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
    "person_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_telephone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_address" (
    "id" SERIAL NOT NULL,
    "cep" TEXT,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "district" TEXT,
    "city" TEXT,
    "state" TEXT,
    "person_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeu_service" (
    "id" UUID NOT NULL,
    "lawsuit_id" UUID NOT NULL,
    "proof_of_residence" TEXT NOT NULL,
    "proof_of_employment" TEXT NOT NULL,
    "proof_of_legal_waiver" TEXT NOT NULL,
    "is_first_signature" BOOLEAN NOT NULL DEFAULT false,
    "created_by" VARCHAR(128) NOT NULL,
    "updated_by" VARCHAR(128) NOT NULL,
    "deleted_by" VARCHAR(128),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "seeu_service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schooling_name_key" ON "schooling"("name");

-- CreateIndex
CREATE UNIQUE INDEX "penalty_regime_name_key" ON "penalty_regime"("name");

-- CreateIndex
CREATE UNIQUE INDEX "people_cpf_key" ON "people"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "people_lawsuit_number_key" ON "people_lawsuit"("number");

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_schooling_id_fkey" FOREIGN KEY ("schooling_id") REFERENCES "schooling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_lawsuit" ADD CONSTRAINT "people_lawsuit_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_lawsuit" ADD CONSTRAINT "people_lawsuit_penalty_regime_id_fkey" FOREIGN KEY ("penalty_regime_id") REFERENCES "penalty_regime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_telephone" ADD CONSTRAINT "people_telephone_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_address" ADD CONSTRAINT "people_address_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeu_service" ADD CONSTRAINT "seeu_service_lawsuit_id_fkey" FOREIGN KEY ("lawsuit_id") REFERENCES "people_lawsuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
