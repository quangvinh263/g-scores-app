import { Matches } from 'class-validator';

export class CreateScoreDto {
  @Matches(/^\d{8}$/, {
    message: 'SBD must contain exactly 8 digits',
  })
  sbd: string;
}
