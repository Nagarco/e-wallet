import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalanceCheckConstraint1792844760073 implements MigrationInterface {
    name = 'AddBalanceCheckConstraint1792844760073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "CHK_9036eeeef957484cb53159047f" CHECK ("balance" >= 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "CHK_9036eeeef957484cb53159047f"`);
    }

}
