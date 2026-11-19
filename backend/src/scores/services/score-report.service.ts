import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';
import { SubjectRegistry } from '../domain/subject-registry';

export interface ScoreLevelReportItem {
  code: string;
  name: string;
  excellent: number;
  good: number;
  average: number;
  weak: number;
}

@Injectable()
export class ScoreReportService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly subjectRegistry: SubjectRegistry,
  ) {}

  async getLevelReport(): Promise<ScoreLevelReportItem[]> {
    const expressions = this.subjectRegistry
      .getAll()
      .flatMap((subject) => [
        `COUNT(*) FILTER (WHERE "${subject.code}" IS NOT NULL AND "${subject.code}" >= 8) AS "${subject.code}_excellent"`,
        `COUNT(*) FILTER (WHERE "${subject.code}" >= 6 AND "${subject.code}" < 8) AS "${subject.code}_good"`,
        `COUNT(*) FILTER (WHERE "${subject.code}" >= 4 AND "${subject.code}" < 6) AS "${subject.code}_average"`,
        `COUNT(*) FILTER (WHERE "${subject.code}" < 4) AS "${subject.code}_weak"`,
      ])
      .join(', ');

    const rawRows: unknown = await this.scoreRepository.query(
      `SELECT ${expressions} FROM "scores"`,
    );
    const rows = Array.isArray(rawRows)
      ? (rawRows as Array<Record<string, unknown>>)
      : [];
    const row = rows[0] ?? {};
    const toCount = (value: unknown): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && value.trim() !== '') {
        return Number(value);
      }
      return 0;
    };

    return this.subjectRegistry.getAll().map((subject) => ({
      code: subject.code,
      name: subject.name,
      excellent: toCount(row[`${subject.code}_excellent`]),
      good: toCount(row[`${subject.code}_good`]),
      average: toCount(row[`${subject.code}_average`]),
      weak: toCount(row[`${subject.code}_weak`]),
    }));
  }
}
