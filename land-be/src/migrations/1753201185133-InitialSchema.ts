import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1753201185133 implements MigrationInterface {
    name = 'InitialSchema1753201185133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dispute_status_enum" AS ENUM('pending', 'resolved', 'mediation')`);
        await queryRunner.query(`CREATE TABLE "dispute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "resolutionNotes" text, "status" "public"."dispute_status_enum" NOT NULL DEFAULT 'pending', "reporterId" uuid, "landPlotId" uuid, CONSTRAINT "PK_e2f1f4741f2094ce789b0a7c5b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inspection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduledDate" TIMESTAMP NOT NULL, "actualDate" TIMESTAMP, "report" text, "permitId" uuid, "inspectorId" uuid, CONSTRAINT "PK_1e895c2ae7b7d9d1ec464950013" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."construction_permit_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "construction_permit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "buildingPlanFileName" character varying, "buildingPlanFilePath" character varying, "status" "public"."construction_permit_status_enum" NOT NULL DEFAULT 'pending', "applicantId" uuid, CONSTRAINT "PK_4a5896187afb57ff90f0dab7f2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('citizen', 'admin', 'tax_officer', 'urban_planner')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nationalId" character varying NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_523469f4c23cb1df14fb0d86835" UNIQUE ("nationalId"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "land_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownershipStartDate" date NOT NULL, "ownershipEndDate" date, "ownershipType" character varying NOT NULL, "userId" uuid, "landPlotId" uuid, CONSTRAINT "PK_3d3411d8fad11d4c855f60cc65e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "land_plot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parcelNumber" character varying NOT NULL, "boundary" geography(Polygon,4326) NOT NULL, "areaHectares" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9cc72bc64e4fcc3799df123799b" UNIQUE ("parcelNumber"), CONSTRAINT "PK_dd23a9a368c91fcef2d552ebc14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tax_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision NOT NULL, "dueDate" date NOT NULL, "isPaid" boolean NOT NULL DEFAULT false, "landPlotId" uuid, CONSTRAINT "PK_4e32fd3ab057ee3052cd8113ad9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system_settings" ("id" character varying NOT NULL DEFAULT 'default', "taxRates" jsonb NOT NULL DEFAULT '{"residential":1000,"commercial":2000,"agricultural":500}', "permitWorkflow" jsonb NOT NULL DEFAULT '{"steps":["SUBMISSION","REVIEW","INSPECTION"],"requiredDocuments":["LAND_TITLE","BUILDING_PLAN"]}', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82521f08790d248b2a80cc85d40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."land_transfer_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "land_transfer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."land_transfer_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "adminNotes" text, "currentOwnerId" uuid, "newOwnerId" uuid, "landPlotId" uuid, CONSTRAINT "PK_f164cc2cf043eb73858fbe809e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dispute" ADD CONSTRAINT "FK_33d50b97e799aca940f1a987ed1" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dispute" ADD CONSTRAINT "FK_b65addb2c3505264a21510d23f4" FOREIGN KEY ("landPlotId") REFERENCES "land_plot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inspection" ADD CONSTRAINT "FK_4c68daf07a28f13c48c516da978" FOREIGN KEY ("permitId") REFERENCES "construction_permit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inspection" ADD CONSTRAINT "FK_518d3f66e307ced56ef6fc143d6" FOREIGN KEY ("inspectorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "construction_permit" ADD CONSTRAINT "FK_409ba9320ca64282c72a5b28e9b" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "land_owner" ADD CONSTRAINT "FK_4210cd06309541cc74973ffee0d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "land_owner" ADD CONSTRAINT "FK_4304e422fb0d720210224b3f022" FOREIGN KEY ("landPlotId") REFERENCES "land_plot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tax_record" ADD CONSTRAINT "FK_45e37c51060213473557bfc6221" FOREIGN KEY ("landPlotId") REFERENCES "land_plot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "land_transfer" ADD CONSTRAINT "FK_34074d52b2117e2ca9a717c31f1" FOREIGN KEY ("currentOwnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "land_transfer" ADD CONSTRAINT "FK_37e824247ece4fbecfe004af0d1" FOREIGN KEY ("newOwnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "land_transfer" ADD CONSTRAINT "FK_ae1a82a1ee6242206ed55cda485" FOREIGN KEY ("landPlotId") REFERENCES "land_plot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "land_transfer" DROP CONSTRAINT "FK_ae1a82a1ee6242206ed55cda485"`);
        await queryRunner.query(`ALTER TABLE "land_transfer" DROP CONSTRAINT "FK_37e824247ece4fbecfe004af0d1"`);
        await queryRunner.query(`ALTER TABLE "land_transfer" DROP CONSTRAINT "FK_34074d52b2117e2ca9a717c31f1"`);
        await queryRunner.query(`ALTER TABLE "tax_record" DROP CONSTRAINT "FK_45e37c51060213473557bfc6221"`);
        await queryRunner.query(`ALTER TABLE "land_owner" DROP CONSTRAINT "FK_4304e422fb0d720210224b3f022"`);
        await queryRunner.query(`ALTER TABLE "land_owner" DROP CONSTRAINT "FK_4210cd06309541cc74973ffee0d"`);
        await queryRunner.query(`ALTER TABLE "construction_permit" DROP CONSTRAINT "FK_409ba9320ca64282c72a5b28e9b"`);
        await queryRunner.query(`ALTER TABLE "inspection" DROP CONSTRAINT "FK_518d3f66e307ced56ef6fc143d6"`);
        await queryRunner.query(`ALTER TABLE "inspection" DROP CONSTRAINT "FK_4c68daf07a28f13c48c516da978"`);
        await queryRunner.query(`ALTER TABLE "dispute" DROP CONSTRAINT "FK_b65addb2c3505264a21510d23f4"`);
        await queryRunner.query(`ALTER TABLE "dispute" DROP CONSTRAINT "FK_33d50b97e799aca940f1a987ed1"`);
        await queryRunner.query(`DROP TABLE "land_transfer"`);
        await queryRunner.query(`DROP TYPE "public"."land_transfer_status_enum"`);
        await queryRunner.query(`DROP TABLE "system_settings"`);
        await queryRunner.query(`DROP TABLE "tax_record"`);
        await queryRunner.query(`DROP TABLE "land_plot"`);
        await queryRunner.query(`DROP TABLE "land_owner"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "construction_permit"`);
        await queryRunner.query(`DROP TYPE "public"."construction_permit_status_enum"`);
        await queryRunner.query(`DROP TABLE "inspection"`);
        await queryRunner.query(`DROP TABLE "dispute"`);
        await queryRunner.query(`DROP TYPE "public"."dispute_status_enum"`);
    }

}
