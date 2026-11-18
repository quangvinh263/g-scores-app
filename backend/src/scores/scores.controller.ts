import { Controller, Get, Param } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { SbdParamDto } from './dto/sbd-param.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get('report/levels')
  getLevelReport() {
    return this.scoresService.getLevelReport();
  }

  @Get('top/group-a')
  getTopGroupA() {
    return this.scoresService.getTopGroupA();
  }

  @Get(':sbd')
  findBySbd(@Param() params: SbdParamDto) {
    return this.scoresService.findBySbd(params.sbd);
  }
}
