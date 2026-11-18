import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { SubjectRegistry } from './domain/subject-registry';
import { GroupA } from './domain/group-a';

export interface ScoreLevelReportItem {
  code: string;
  name: string;
  excellent: number;
  good: number;
  average: number;
  weak: number;
}

export interface GroupATopItem {
  rank: number;
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  total: number;
}

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly subjectRegistry: SubjectRegistry,
    private readonly groupA: GroupA,
  ) {}

  async findBySbd(sbd: string): Promise<{
    sbd: string;
    ma_ngoai_ngu: string | null;
    subjects: Array<{
      code: string;
      name: string;
      score: number | null;
      level: 'excellent' | 'good' | 'average' | 'weak' | null;
    }>;
  }> {
    const score = await this.scoreRepository.findOne({ where: { sbd } });

    if (!score) {
      throw new NotFoundException(`No score found for SBD ${sbd}`);
    }

    return {
      sbd: score.sbd,
      ma_ngoai_ngu: score.ma_ngoai_ngu,
      subjects: this.subjectRegistry.getAll().map((subject) => {
        const value = score[subject.code as keyof Score];
        const numericScore =
          typeof value === 'number' ? value : value === null ? null : null;

        return {
          code: subject.code,
          name: subject.name,
          score: numericScore,
          level: subject.classify(numericScore),
        };
      }),
    };
  }

  async getLevelReport(): Promise<ScoreLevelReportItem[]> {
    const expressions = this.subjectRegistry
      .getAll()
      .flatMap((subject) => {
        const code = subject.code;
        return [
          `COUNT(*) FILTER (WHERE "${code}" IS NOT NULL AND "${code}" >= 8) AS "${code}_excellent"`,
          `COUNT(*) FILTER (WHERE "${code}" >= 6 AND "${code}" < 8) AS "${code}_good"`,
          `COUNT(*) FILTER (WHERE "${code}" >= 4 AND "${code}" < 6) AS "${code}_average"`,
          `COUNT(*) FILTER (WHERE "${code}" < 4) AS "${code}_weak"`,
        ];
      })
      .join(', ');

    const rows = (await this.scoreRepository.query(
      `SELECT ${expressions} FROM "scores"`,
    )) as Array<Record<string, string>>;

    const row = rows[0] ?? {};

    return this.subjectRegistry.getAll().map((subject) => ({
      code: subject.code,
      name: subject.name,
      excellent: Number(row[`${subject.code}_excellent`] ?? 0),
      good: Number(row[`${subject.code}_good`] ?? 0),
      average: Number(row[`${subject.code}_average`] ?? 0),
      weak: Number(row[`${subject.code}_weak`] ?? 0),
    }));
  }

  async getTopGroupA(): Promise<GroupATopItem[]> {
    const rows = (await this.scoreRepository.query(`
      SELECT
        "sbd",
        "toan",
        "vat_li",
        "hoa_hoc",
        ("toan" + "vat_li" + "hoa_hoc") AS "total"
      FROM "scores"
      WHERE "toan" IS NOT NULL
        AND "vat_li" IS NOT NULL
        AND "hoa_hoc" IS NOT NULL
      ORDER BY "total" DESC, "sbd" ASC
      LIMIT 10
    `)) as Array<{
      sbd: string;
      toan: number | string;
      vat_li: number | string;
      hoa_hoc: number | string;
      total: number | string;
    }>;

    return rows.map((row, index) => {
      const toan = Number(row.toan);
      const vat_li = Number(row.vat_li);
      const hoa_hoc = Number(row.hoa_hoc);
      const total = this.groupA.calculate({ toan, vat_li, hoa_hoc });

      return {
        rank: index + 1,
        sbd: row.sbd,
        toan,
        vat_li,
        hoa_hoc,
        total: total === null ? Number(row.total) : Number(total.toFixed(2)),
      };
    });
  }
}
