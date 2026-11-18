import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('scores')
@Index('IDX_scores_group_a_complete', ['toan', 'vat_li', 'hoa_hoc'], {
  where: '"toan" IS NOT NULL AND "vat_li" IS NOT NULL AND "hoa_hoc" IS NOT NULL',
})
export class Score {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  sbd: string; // Đánh Primary Key giúp tra cứu theo SBD cực nhanh

  @Column({ type: 'float', nullable: true })
  toan: number | null;

  @Column({ type: 'float', nullable: true })
  ngu_van: number | null;

  @Column({ type: 'float', nullable: true })
  ngoai_ngu: number | null;

  @Column({ type: 'float', nullable: true })
  vat_li: number | null;

  @Column({ type: 'float', nullable: true })
  hoa_hoc: number | null;

  @Column({ type: 'float', nullable: true })
  sinh_hoc: number | null;

  @Column({ type: 'float', nullable: true })
  lich_su: number | null;

  @Column({ type: 'float', nullable: true })
  dia_li: number | null;

  @Column({ type: 'float', nullable: true })
  gdcd: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  ma_ngoai_ngu: string | null;
}