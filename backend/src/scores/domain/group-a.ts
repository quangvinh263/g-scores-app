import { ExamGroup } from './exam-group';
import { Subject } from './subject';

export class GroupA extends ExamGroup {
  constructor(subjects: readonly Subject[]) {
    super('A', 'Group A', subjects);
  }

  calculate(scores: Readonly<Record<string, number | null>>): number | null {
    return this.sumValidSubjects(scores);
  }
}
