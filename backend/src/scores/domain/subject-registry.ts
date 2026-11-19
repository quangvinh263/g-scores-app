import { StandardSubject, Subject } from './subject';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectRegistry {
  private readonly subjects = new Map<string, Subject>();

  constructor() {
    const definitions: ReadonlyArray<readonly [string, string]> = [
      ['toan', 'Mathematics'],
      ['ngu_van', 'Literature'],
      ['ngoai_ngu', 'Foreign Language'],
      ['vat_li', 'Physics'],
      ['hoa_hoc', 'Chemistry'],
      ['sinh_hoc', 'Biology'],
      ['lich_su', 'History'],
      ['dia_li', 'Geography'],
      ['gdcd', 'Civic Education'],
    ];

    for (const [code, name] of definitions) {
      this.subjects.set(code, new StandardSubject(code, name));
    }
  }

  get(code: string): Subject | undefined {
    return this.subjects.get(code);
  }

  getAll(): Subject[] {
    return Array.from(this.subjects.values());
  }
}
