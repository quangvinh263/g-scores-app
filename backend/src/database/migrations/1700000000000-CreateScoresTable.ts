import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateScoresTable1700000000000 implements MigrationInterface {
  name = 'CreateScoresTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'scores',
        columns: [
          { name: 'sbd', type: 'varchar', length: '20', isPrimary: true },
          { name: 'toan', type: 'double precision', isNullable: true },
          { name: 'ngu_van', type: 'double precision', isNullable: true },
          { name: 'ngoai_ngu', type: 'double precision', isNullable: true },
          { name: 'vat_li', type: 'double precision', isNullable: true },
          { name: 'hoa_hoc', type: 'double precision', isNullable: true },
          { name: 'sinh_hoc', type: 'double precision', isNullable: true },
          { name: 'lich_su', type: 'double precision', isNullable: true },
          { name: 'dia_li', type: 'double precision', isNullable: true },
          { name: 'gdcd', type: 'double precision', isNullable: true },
          {
            name: 'ma_ngoai_ngu',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'scores',
      new TableIndex({
        name: 'IDX_scores_group_a_complete',
        columnNames: ['toan', 'vat_li', 'hoa_hoc'],
        where:
          '"toan" IS NOT NULL AND "vat_li" IS NOT NULL AND "hoa_hoc" IS NOT NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('scores', 'IDX_scores_group_a_complete');
    await queryRunner.dropTable('scores');
  }
}
