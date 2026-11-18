export type ScoreLevel = 'excellent' | 'good' | 'average' | 'weak';

export abstract class Subject {
  constructor(
    public readonly code: string,
    public readonly name: string,
  ) {}

  validate(score: number | null): boolean {
    return score !== null && score >= 0 && score <= 10;
  }

  classify(score: number | null): ScoreLevel | null {
    if (!this.validate(score)) {
      return null;
    }

    if (score! >= 8) return 'excellent';
    if (score! >= 6) return 'good';
    if (score! >= 4) return 'average';
    return 'weak';
  }
}

export class StandardSubject extends Subject {}
