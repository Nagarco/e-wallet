import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1792785835522 implements MigrationInterface {
    name = 'InitialSchema1792785835522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transfer_status_enum" AS ENUM('PENDING', 'FULFILLED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "transfer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(12,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "status" "public"."transfer_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad898da19a2036169276bec8c1" ON "transfer"  ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "balance" numeric(12,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_83537e357d4daadb857592f1d3e" UNIQUE ("phoneNumber"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_780bd0b359a2b4576b2e3268600" FOREIGN KEY ("senderId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_6bad5b656535794d899c2a50323" FOREIGN KEY ("receiverId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_6bad5b656535794d899c2a50323"`);
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_780bd0b359a2b4576b2e3268600"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad898da19a2036169276bec8c1"`);
        await queryRunner.query(`DROP TABLE "transfer"`);
        await queryRunner.query(`DROP TYPE "public"."transfer_status_enum"`);
    }

}
