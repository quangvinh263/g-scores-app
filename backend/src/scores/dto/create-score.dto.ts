import { IsOptional, Matches, Max, Min, IsNumber, IsString } from 'class-validator';

export class CreateScoreDto {
  @Matches(/^\d{8}$/, {
    message: 'SBD must contain exactly 8 digits',
  })
  sbd: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  toan?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  ngu_van?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  ngoai_ngu?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  vat_li?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  hoa_hoc?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  sinh_hoc?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  lich_su?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  dia_li?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  gdcd?: number;

  @IsOptional()
  @IsString()
  ma_ngoai_ngu?: string;
}
