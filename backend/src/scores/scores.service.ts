import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { SubjectRegistry } from './domain/subject-registry';
import { ExamGroupRegistry } from './domain/exam-group-registry';

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

export interface ExamGroupTopItem {
  rank: number;
  sbd: string;
  scores: Record<string, number>;
  total: number;
}

export interface ExamGroupTopResponse {
  group: string;
  name: string;
  subjects: Array<{ code: string; name: string }>;
  top10: ExamGroupTopItem[];
  highest: { sbd: string; total: number } | null;
  top10Average: number | null;
}

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly subjectRegistry: SubjectRegistry,
    private readonly examGroupRegistry: ExamGroupRegistry,
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

  async getTopGroup(groupCode: 'A' | 'A01' | 'B' | 'C' | 'D01'): Promise<ExamGroupTopResponse> {
    const group = this.examGroupRegistry.get(groupCode);

    if (!group) {
      throw new BadRequestException(
        'Group must be one of: A, A01, B, C, D01',
      );
    }

    const subjectColumns = group.subjects
      .map((subject) => `"${subject.code}"`)
      .join(', ');
    const totalExpression = group.subjects
      .map((subject) => `"${subject.code}"`)
      .join(' + ');
    const whereExpression = group.subjects
      .map((subject) => `"${subject.code}" IS NOT NULL`)
      .join(' AND ');

    const rows = (await this.scoreRepository.query(`
      SELECT
        "sbd",
        ${subjectColumns},
        (${totalExpression}) AS "total"
      FROM "scores"
      WHERE ${whereExpression}
      ORDER BY "total" DESC, "sbd" ASC
      LIMIT 10
    `)) as Array<Record<string, number | string>>;

    const top10 = rows.map((row, index) => {
      const scores = Object.fromEntries(
        group.subjects.map((subject) => [
          subject.code,
          Number(row[subject.code]),
        ]),
      );
      const total = group.calculate(scores);

      return {
        rank: index + 1,
        sbd: String(row.sbd),
        scores,
        total: total === null ? Number(row.total) : Number(total.toFixed(2)),
      };
    });

    const highest =
      top10.length > 0
        ? { sbd: top10[0].sbd, total: top10[0].total }
        : null;
    const top10Average =
      top10.length > 0
        ? Number(
            (
              top10.reduce((sum, candidate) => sum + candidate.total, 0) /
              top10.length
            ).toFixed(2),
          )
        : null;

    return {
      group: group.code,
      name: group.name,
      subjects: group.subjects.map((subject) => ({
        code: subject.code,
        name: subject.name,
      })),
      top10,
      highest,
      top10Average,
    };
  }

  async getTopGroupA(): Promise<GroupATopItem[]> {
    const result = await this.getTopGroup('A');

    return result.top10.map((item) => ({
      rank: item.rank,
      sbd: item.sbd,
      toan: item.scores.toan,
      vat_li: item.scores.vat_li,
      hoa_hoc: item.scores.hoa_hoc,
      total: item.total,
    }));
  }
}
