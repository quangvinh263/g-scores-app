import { SubjectRegistry } from './subject-registry';
import { ExamGroupRegistry } from './exam-group-registry';

describe('ExamGroupRegistry', () => {
  const registry = new ExamGroupRegistry(new SubjectRegistry());

  it('registers all supported groups', () => {
    expect(registry.getAll().map((group) => group.code)).toEqual([
      'A',
      'A01',
      'B',
      'C',
      'D01',
    ]);
  });

  it('calculates a complete Group A total through OOP', () => {
    const groupA = registry.get('A');
    expect(groupA?.calculate({ toan: 9, vat_li: 8, hoa_hoc: 7 })).toBe(24);
  });

  it('returns null when a combination subject is missing', () => {
    const groupC = registry.get('C');
    expect(
      groupC?.calculate({
        ngu_van: 8,
        lich_su: null,
        dia_li: 7,
      }),
    ).toBeNull();
  });
});
