import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { SubjectRegistry } from './domain/subject-registry';
import { GroupA } from './domain/group-a';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { ExamGroupRegistry } from './domain/exam-group-registry';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  controllers: [ScoresController],
  providers: [
    ScoresService,
    SubjectRegistry,
    ExamGroupRegistry,
    {
      provide: GroupA,
      inject: [SubjectRegistry],
      useFactory: (registry: SubjectRegistry) =>
        new GroupA([
          registry.get('toan')!,
          registry.get('vat_li')!,
          registry.get('hoa_hoc')!,
        ]),
    },
  ],
})
export class ScoresModule {}
