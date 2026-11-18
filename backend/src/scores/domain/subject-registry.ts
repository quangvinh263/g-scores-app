import { StandardSubject, Subject } from './subject';

export class SubjectRegistry {
  private readonly subjects = new Map<string, Subject>();

  constructor() {
    const definitions: ReadonlyArray<readonly [string, string]> = [
      ['toan', 'Toán'],
      ['ngu_van', 'Ngữ văn'],
      ['ngoai_ngu', 'Ngoại ngữ'],
      ['vat_li', 'Vật lý'],
      ['hoa_hoc', 'Hóa học'],
      ['sinh_hoc', 'Sinh học'],
      ['lich_su', 'Lịch sử'],
      ['dia_li', 'Địa lý'],
      ['gdcd', 'Giáo dục công dân'],
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
