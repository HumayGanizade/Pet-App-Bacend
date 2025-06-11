import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentIdToCommentTable1716947528352
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE comment
        ADD COLUMN parentId VARCHAR(36) NULL,
      ADD CONSTRAINT FK_comment_parent FOREIGN KEY (parentId) REFERENCES comment(id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE comment
      DROP FOREIGN KEY FK_comment_parent,
      DROP COLUMN parentId
    `);
  }
}
