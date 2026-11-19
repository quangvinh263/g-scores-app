import { Subject } from './subject';

export abstract class ExamGroup {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly subjects: readonly Subject[],
  ) {}

  abstract calculate(scores: Readonly<Record<string, number | null>>): number | null;

  protected sumValidSubjects(scores: Readonly<Record<string, number | null>>): number | null {
    let total = 0;

    for (const subject of this.subjects) {
      const score = scores[subject.code];
      if (!subject.validate(score)) {
        return null;
      }
      total += score!;
    }

    return total;
  }
}

export class StandardExamGroup extends ExamGroup {
  calculate(scores: Readonly<Record<string, number | null>>): number | null {
    return this.sumValidSubjects(scores);
  }
}
