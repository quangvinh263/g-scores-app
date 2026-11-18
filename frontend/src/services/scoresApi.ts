import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 15000,
});

export type ScoreLevel = 'excellent' | 'good' | 'average' | 'weak';

export interface ScoreSubject {
  code: string;
  name: string;
  score: number | null;
  level: ScoreLevel | null;
}

export interface StudentScore {
  sbd: string;
  ma_ngoai_ngu: string | null;
  subjects: ScoreSubject[];
}

export interface LevelReportItem {
  code: string;
  name: string;
  excellent: number;
  good: number;
  average: number;
  weak: number;
}

export interface TopGroupAItem {
  rank: number;
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  total: number;
}

export async function getScoreBySbd(sbd: string): Promise<StudentScore> {
  const response = await api.get<StudentScore>(`/scores/${encodeURIComponent(sbd)}`);
  return response.data;
}

export async function getLevelReport(): Promise<LevelReportItem[]> {
  const response = await api.get<LevelReportItem[]>('/scores/report/levels');
  return response.data;
}

export async function getTopGroupA(): Promise<TopGroupAItem[]> {
  const response = await api.get<TopGroupAItem[]>('/scores/top/group-a');
  return response.data;
}
