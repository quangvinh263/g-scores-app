import { SubjectRegistry } from './subject-registry';
import { ExamGroupRegistry } from './exam-group-registry';
import { StandardSubject } from './subject';

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

  it.each([
    [10, 'excellent'],
    [8, 'excellent'],
    [7.99, 'good'],
    [6, 'good'],
    [5.99, 'average'],
    [4, 'average'],
    [3.99, 'weak'],
  ] as const)('classifies score %p as %p', (score, level) => {
    const subject = new StandardSubject('test', 'Test');
    expect(subject.classify(score)).toBe(level);
  });

  it.each([
    ['A', { toan: 9, vat_li: 8, hoa_hoc: 7 }],
    ['A01', { toan: 9, vat_li: 8, ngoai_ngu: 7 }],
    ['B', { toan: 9, hoa_hoc: 8, sinh_hoc: 7 }],
    ['C', { ngu_van: 9, lich_su: 8, dia_li: 7 }],
    ['D01', { toan: 9, ngu_van: 8, ngoai_ngu: 7 }],
  ] as const)('calculates Group %s total as 24', (code, scores) => {
    expect(registry.get(code)?.calculate(scores)).toBe(24);
  });
});
