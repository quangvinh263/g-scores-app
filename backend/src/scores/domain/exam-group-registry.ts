import { ExamGroup, StandardExamGroup } from './exam-group';
import { SubjectRegistry } from './subject-registry';
import { GroupA } from './group-a';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExamGroupRegistry {
  private readonly groups = new Map<string, ExamGroup>();

  constructor(subjectRegistry: SubjectRegistry) {
    const definitions: Record<string, { name: string; subjects: string[] }> = {
      A: {
        name: 'Group A',
        subjects: ['toan', 'vat_li', 'hoa_hoc'],
      },
      A01: {
        name: 'Group A01',
        subjects: ['toan', 'vat_li', 'ngoai_ngu'],
      },
      B: {
        name: 'Group B',
        subjects: ['toan', 'hoa_hoc', 'sinh_hoc'],
      },
      C: {
        name: 'Group C',
        subjects: ['ngu_van', 'lich_su', 'dia_li'],
      },
      D01: {
        name: 'Group D01',
        subjects: ['toan', 'ngu_van', 'ngoai_ngu'],
      },
    };

    for (const [code, definition] of Object.entries(definitions)) {
      const subjects = definition.subjects.map((subjectCode) =>
        subjectRegistry.get(subjectCode),
      );

      if (subjects.some((subject) => !subject)) {
        throw new Error(`Invalid subject configuration for exam group ${code}`);
      }

      const resolvedSubjects = subjects.filter(
        (subject) => subject !== undefined,
      );

      this.groups.set(
        code,
        code === 'A'
          ? new GroupA(resolvedSubjects)
          : new StandardExamGroup(code, definition.name, resolvedSubjects),
      );
    }
  }

  get(code: string): ExamGroup | undefined {
    return this.groups.get(code.toUpperCase());
  }

  getAll(): ExamGroup[] {
    return Array.from(this.groups.values());
  }
}
