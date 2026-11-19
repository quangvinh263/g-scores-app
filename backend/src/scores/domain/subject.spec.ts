import { StandardSubject } from './subject';

describe('StandardSubject', () => {
  const subject = new StandardSubject('toan', 'Mathematics');

  it.each([
    [10, 'excellent'],
    [8, 'excellent'],
    [7.5, 'good'],
    [6, 'good'],
    [5.5, 'average'],
    [4, 'average'],
    [3.9, 'weak'],
  ])('classifies %p as %p', (score, expected) => {
    expect(subject.classify(score)).toBe(expected);
  });

  it('rejects scores outside 0-10 and null', () => {
    expect(subject.validate(-0.1)).toBe(false);
    expect(subject.validate(10.1)).toBe(false);
    expect(subject.validate(null)).toBe(false);
  });
});
