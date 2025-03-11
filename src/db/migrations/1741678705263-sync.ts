import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1741678705263 implements MigrationInterface {
    name = 'Sync1741678705263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "todo_item" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "isCompleted" boolean NOT NULL,
                CONSTRAINT "PK_d454c4b9eac15cc27c2ed8e4138" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "todo_item"
        `);
    }

}
