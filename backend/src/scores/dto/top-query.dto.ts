import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class TopQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(['A', 'A01', 'B', 'C', 'D01'], {
    message: 'Group must be one of: A, A01, B, C, D01',
  })
  group?: 'A' | 'A01' | 'B' | 'C' | 'D01' = 'A';
}
