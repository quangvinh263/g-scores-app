import { NotFoundException } from '@nestjs/common';
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));
import { ScoreLookupService } from './score-lookup.service';
import { SubjectRegistry } from '../domain/subject-registry';

describe('ScoreLookupService', () => {
  it('returns 404 when SBD is not found', async () => {
    const repository = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const service = new ScoreLookupService(
      repository as never,
      new SubjectRegistry(),
    );

    await expect(service.findBySbd('99999999')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
