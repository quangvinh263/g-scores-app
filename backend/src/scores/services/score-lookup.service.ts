import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';
import { SubjectRegistry } from '../domain/subject-registry';

export interface ScoreLookupResult {
  sbd: string;
  ma_ngoai_ngu: string | null;
  subjects: Array<{
    code: string;
    name: string;
    score: number | null;
    level: 'excellent' | 'good' | 'average' | 'weak' | null;
  }>;
}

@Injectable()
export class ScoreLookupService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly subjectRegistry: SubjectRegistry,
  ) {}

  async findBySbd(sbd: string): Promise<ScoreLookupResult> {
    const score = await this.scoreRepository.findOne({ where: { sbd } });

    if (!score) {
      throw new NotFoundException(`No score found for SBD ${sbd}`);
    }

    return {
      sbd: score.sbd,
      ma_ngoai_ngu: score.ma_ngoai_ngu,
      subjects: this.subjectRegistry.getAll().map((subject) => {
        const value = score[subject.code as keyof Score];
        const numericScore = typeof value === 'number' ? value : null;

        return {
          code: subject.code,
          name: subject.name,
          score: numericScore,
          level: subject.classify(numericScore),
        };
      }),
    };
  }
}
