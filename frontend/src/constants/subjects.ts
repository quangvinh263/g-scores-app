export type ScoreLevelCode = 'excellent' | 'good' | 'average' | 'weak';

export const SUBJECT_LABELS: Record<string, string> = {
  toan: 'Mathematics',
  ngu_van: 'Literature',
  ngoai_ngu: 'Foreign Language',
  vat_li: 'Physics',
  hoa_hoc: 'Chemistry',
  sinh_hoc: 'Biology',
  lich_su: 'History',
  dia_li: 'Geography',
  gdcd: 'Civic Education',
};

export const SCORE_LEVEL_CONFIG: Record<
  ScoreLevelCode,
  { label: string; color: string; background: string }
> = {
  excellent: { label: 'Excellent', color: '#22c55e', background: '#dcfce7' },
  good: { label: 'Good', color: '#3b82f6', background: '#dbeafe' },
  average: { label: 'Average', color: '#f59e0b', background: '#fef3c7' },
  weak: { label: 'Weak', color: '#ef4444', background: '#fee2e2' },
};

export const ADMISSION_GROUPS = ['A', 'A01', 'B', 'C', 'D01'] as const;
