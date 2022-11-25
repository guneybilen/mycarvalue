import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1668982894888 implements MigrationInterface {
    name = 'InitialMigration1668982894888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report" ("id" SERIAL NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "admin" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "admin"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "admin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "report" ADD "approved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "report" ADD "make" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report" ADD "model" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report" ADD "year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report" ADD "lng" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report" ADD "lat" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report" ADD "mileage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_e347c56b008c2057c9887e230aa"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "mileage"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "make"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "approved"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "admin"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "admin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "report"`);
    }

}
