import { Controller, Get, Param, Query } from '@nestjs/common';
import { SbdParamDto } from './dto/sbd-param.dto';
import { TopQueryDto } from './dto/top-query.dto';
import { ScoreLookupService } from './services/score-lookup.service';
import { ScoreReportService } from './services/score-report.service';
import { LeaderboardService } from './services/leaderboard.service';

@Controller('scores')
export class ScoresController {
  constructor(
    private readonly scoreLookupService: ScoreLookupService,
    private readonly scoreReportService: ScoreReportService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @Get('report/levels')
  getLevelReport() {
    return this.scoreReportService.getLevelReport();
  }

  @Get('top/group-a')
  getTopGroupA() {
    return this.leaderboardService.getTopGroupA();
  }

  @Get('top')
  getTopGroup(@Query() query: TopQueryDto) {
    return this.leaderboardService.getTopGroup(query.group ?? 'A');
  }

  @Get(':sbd')
  findBySbd(@Param() params: SbdParamDto) {
    return this.scoreLookupService.findBySbd(params.sbd);
  }
}
