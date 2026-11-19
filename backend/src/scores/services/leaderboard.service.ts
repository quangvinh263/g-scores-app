import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';
import { ExamGroupRegistry } from '../domain/exam-group-registry';

export type ExamGroupCode = 'A' | 'A01' | 'B' | 'C' | 'D01';

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
export class LeaderboardService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly examGroupRegistry: ExamGroupRegistry,
  ) {}

  async getTopGroup(groupCode: ExamGroupCode): Promise<ExamGroupTopResponse> {
    const group = this.examGroupRegistry.get(groupCode);
    if (!group) {
      throw new BadRequestException('Group must be one of: A, A01, B, C, D01');
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

    const rawRows: unknown = await this.scoreRepository.query(`
      SELECT "sbd", ${subjectColumns}, (${totalExpression}) AS "total"
      FROM "scores"
      WHERE ${whereExpression}
      ORDER BY "total" DESC, "sbd" ASC
      LIMIT 10
    `);
    const rows = Array.isArray(rawRows)
      ? (rawRows as Array<Record<string, number | string>>)
      : [];

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
      top10.length > 0 ? { sbd: top10[0].sbd, total: top10[0].total } : null;
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

  async getTopGroupA() {
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
