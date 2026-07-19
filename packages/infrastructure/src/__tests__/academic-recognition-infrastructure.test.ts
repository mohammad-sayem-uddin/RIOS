import type { AcademicRecognitionApplicationService } from '@rios/application';
import { describe, expect, it } from 'vitest';

import { CompositionRoot, DITokens } from '../index.js';

describe('Academic Recognition Infrastructure Integration Tests', () => {
  const root = new CompositionRoot();
  const container = root.getContainer();

  it('should resolve AcademicRecognitionApplicationService from DI Container', () => {
    const service = container.resolve<AcademicRecognitionApplicationService>(
      DITokens.AcademicRecognitionApplicationService,
    );
    expect(service).toBeDefined();
  });

  it('should create award, grant, and patent via application service with in-memory store', async () => {
    const service = container.resolve<AcademicRecognitionApplicationService>(
      DITokens.AcademicRecognitionApplicationService,
    );
    const profileId = '11111111-1111-4111-a111-111111111111';

    const awardRes = await service.createAward({
      profileId,
      title: 'ACM Doctoral Dissertation Award',
      category: 'AWARD',
      sponsorOrAgency: 'ACM',
      amount: 20000,
    });
    expect(awardRes.isSuccess).toBe(true);
    expect(awardRes.value.title).toBe('ACM Doctoral Dissertation Award');

    const grantRes = await service.createGrant({
      profileId,
      grantNumber: 'NIH-2026-R01',
      title: 'Genomic Machine Learning',
      fundingAgency: 'NIH',
      amount: 1200000,
      startDate: '2026-01-01',
      endDate: '2030-12-31',
    });
    expect(grantRes.isSuccess).toBe(true);
    expect(grantRes.value.grantNumber).toBe('NIH-2026-R01');

    const patentRes = await service.createPatent({
      profileId,
      patentNumber: 'US-10928371',
      title: 'Neural Architecture Search',
      status: 'APPLIED',
      patentType: 'UTILITY',
      filingDate: '2026-02-01',
    });
    expect(patentRes.isSuccess).toBe(true);
    expect(patentRes.value.patentNumber).toBe('US-10928371');
  });
});
