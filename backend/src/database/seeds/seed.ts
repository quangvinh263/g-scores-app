import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import csv from 'csv-parser';
import dataSource from '../data-source';

type CsvScoreRow = {
  sbd?: string;
  toan?: string;
  ngu_van?: string;
  ngoai_ngu?: string;
  vat_li?: string;
  hoa_hoc?: string;
  sinh_hoc?: string;
  lich_su?: string;
  dia_li?: string;
  gdcd?: string;
  ma_ngoai_ngu?: string;
};

const BATCH_SIZE = 3000;

function nullableFloat(value?: string): number | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

async function seed(): Promise<void> {
  await dataSource.initialize();

  const csvPath = path.resolve(process.cwd(), 'data', 'diem_thi_thpt_2024.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV dataset not found: ${csvPath}`);
  }

  let batch: Record<string, unknown>[] = [];
  let inserted = 0;

  await new Promise<void>((resolve, reject) => {
    const stream = fs
      .createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: CsvScoreRow) => {
        const sbd = row.sbd?.trim();
        if (!sbd || !/^\d{8}$/.test(sbd)) return;

        batch.push({
          sbd,
          toan: nullableFloat(row.toan),
          ngu_van: nullableFloat(row.ngu_van),
          ngoai_ngu: nullableFloat(row.ngoai_ngu),
          vat_li: nullableFloat(row.vat_li),
          hoa_hoc: nullableFloat(row.hoa_hoc),
          sinh_hoc: nullableFloat(row.sinh_hoc),
          lich_su: nullableFloat(row.lich_su),
          dia_li: nullableFloat(row.dia_li),
          gdcd: nullableFloat(row.gdcd),
          ma_ngoai_ngu: row.ma_ngoai_ngu?.trim() || null,
        });

        if (batch.length >= BATCH_SIZE) {
          const pending = batch;
          batch = [];
          stream.pause();
          insertBatch(pending)
            .then((count) => {
              inserted += count;
              stream.resume();
            })
            .catch((error: unknown) => {
              const seedError =
                error instanceof Error ? error : new Error(String(error));
              stream.destroy(seedError);
              reject(seedError);
            });
        }
      })
      .on('end', () => {
        void insertBatch(batch)
          .then((count) => {
            inserted += count;
            resolve();
          })
          .catch(reject);
      })
      .on('error', reject);
  });

  console.log(`Seeded ${inserted} score rows.`);
  await dataSource.destroy();

  async function insertBatch(rows: Record<string, unknown>[]): Promise<number> {
    if (rows.length === 0) return 0;

    const result = await dataSource
      .createQueryBuilder()
      .insert()
      .into('scores')
      .values(rows)
      .orIgnore()
      .execute();

    return result.identifiers.length;
  }
}

seed().catch(async (error) => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  console.error(error);
  process.exitCode = 1;
});
