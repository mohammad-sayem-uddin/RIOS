import type {
  AcademicRecognitionApplicationService,
  AwardOutputDto,
  CreateAwardDto,
  CreateGrantDto,
  CreatePatentDto,
  CreateProfessionalActivityDto,
  GrantOutputDto,
  PatentOutputDto,
  ProfessionalActivityOutputDto,
  UpdatePatentStatusDto,
} from '@rios/application';
import { Result } from '@rios/shared';
import express, { json } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { AcademicRecognitionController } from '../controllers/academic-recognition.controller.js';
import { createAcademicRecognitionRouter } from '../routes/academic-recognition.routes.js';

class MockAcademicRecognitionApplicationService implements AcademicRecognitionApplicationService {
  createAward(dto: CreateAwardDto): Promise<Result<AwardOutputDto>> {
    return Promise.resolve(
      Result.ok<AwardOutputDto>({
        id: 'award-1',
        profileId: dto.profileId,
        title: dto.title,
        category: dto.category ?? 'AWARD',
        sponsorOrAgency: dto.sponsorOrAgency,
        amount: dto.amount,
        currency: dto.currency ?? 'USD',
        awardDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getAwardById(id: string): Promise<Result<AwardOutputDto>> {
    return Promise.resolve(
      Result.ok<AwardOutputDto>({
        id,
        profileId: 'profile-1',
        title: 'Mock Award',
        category: 'AWARD',
        awardDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getAwardsByProfileId(profileId: string): Promise<Result<AwardOutputDto[]>> {
    return Promise.resolve(
      Result.ok<AwardOutputDto[]>([
        {
          id: 'award-1',
          profileId,
          title: 'Mock Award',
          category: 'AWARD',
          awardDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]),
    );
  }

  searchAwards(): Promise<Result<AwardOutputDto[]>> {
    return Promise.resolve(Result.ok<AwardOutputDto[]>([]));
  }

  deleteAward(): Promise<Result<void>> {
    return Promise.resolve(Result.ok());
  }

  createGrant(dto: CreateGrantDto): Promise<Result<GrantOutputDto>> {
    return Promise.resolve(
      Result.ok<GrantOutputDto>({
        id: 'grant-1',
        profileId: dto.profileId,
        grantNumber: dto.grantNumber,
        title: dto.title,
        fundingAgency: dto.fundingAgency,
        amount: dto.amount,
        currency: dto.currency ?? 'USD',
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: 'ACTIVE',
        coInvestigators: [],
        deliverables: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getGrantById(id: string): Promise<Result<GrantOutputDto>> {
    return Promise.resolve(
      Result.ok<GrantOutputDto>({
        id,
        profileId: 'profile-1',
        grantNumber: 'GRANT-1',
        title: 'Mock Grant',
        fundingAgency: 'NSF',
        amount: 100000,
        currency: 'USD',
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        status: 'ACTIVE',
        coInvestigators: [],
        deliverables: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getGrantsByProfileId(profileId: string): Promise<Result<GrantOutputDto[]>> {
    return Promise.resolve(
      Result.ok<GrantOutputDto[]>([
        {
          id: 'grant-1',
          profileId,
          grantNumber: 'GRANT-1',
          title: 'Mock Grant',
          fundingAgency: 'NSF',
          amount: 100000,
          currency: 'USD',
          startDate: '2026-01-01',
          endDate: '2027-12-31',
          status: 'ACTIVE',
          coInvestigators: [],
          deliverables: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]),
    );
  }

  searchGrants(): Promise<Result<GrantOutputDto[]>> {
    return Promise.resolve(Result.ok<GrantOutputDto[]>([]));
  }

  completeGrant(grantId: string): Promise<Result<GrantOutputDto>> {
    return Promise.resolve(
      Result.ok<GrantOutputDto>({
        id: grantId,
        profileId: 'profile-1',
        grantNumber: 'GRANT-1',
        title: 'Mock Grant',
        fundingAgency: 'NSF',
        amount: 100000,
        currency: 'USD',
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        status: 'COMPLETED',
        coInvestigators: [],
        deliverables: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  deleteGrant(): Promise<Result<void>> {
    return Promise.resolve(Result.ok());
  }

  createPatent(dto: CreatePatentDto): Promise<Result<PatentOutputDto>> {
    return Promise.resolve(
      Result.ok<PatentOutputDto>({
        id: 'patent-1',
        profileId: dto.profileId,
        patentNumber: dto.patentNumber,
        title: dto.title,
        status: dto.status,
        patentType: dto.patentType,
        filingDate: dto.filingDate,
        inventors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getPatentById(id: string): Promise<Result<PatentOutputDto>> {
    return Promise.resolve(
      Result.ok<PatentOutputDto>({
        id,
        profileId: 'profile-1',
        patentNumber: 'US-1',
        title: 'Mock Patent',
        status: 'APPLIED',
        patentType: 'UTILITY',
        filingDate: '2026-01-01',
        inventors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getPatentsByProfileId(profileId: string): Promise<Result<PatentOutputDto[]>> {
    return Promise.resolve(
      Result.ok<PatentOutputDto[]>([
        {
          id: 'patent-1',
          profileId,
          patentNumber: 'US-1',
          title: 'Mock Patent',
          status: 'APPLIED',
          patentType: 'UTILITY',
          filingDate: '2026-01-01',
          inventors: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]),
    );
  }

  searchPatents(): Promise<Result<PatentOutputDto[]>> {
    return Promise.resolve(Result.ok<PatentOutputDto[]>([]));
  }

  updatePatentStatus(dto: UpdatePatentStatusDto): Promise<Result<PatentOutputDto>> {
    return Promise.resolve(
      Result.ok<PatentOutputDto>({
        id: dto.patentId,
        profileId: 'profile-1',
        patentNumber: 'US-1',
        title: 'Mock Patent',
        status: dto.nextStatus,
        patentType: 'UTILITY',
        filingDate: '2026-01-01',
        inventors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  deletePatent(): Promise<Result<void>> {
    return Promise.resolve(Result.ok());
  }

  createProfessionalActivity(
    dto: CreateProfessionalActivityDto,
  ): Promise<Result<ProfessionalActivityOutputDto>> {
    return Promise.resolve(
      Result.ok<ProfessionalActivityOutputDto>({
        id: 'act-1',
        profileId: dto.profileId,
        category: dto.category,
        title: dto.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getProfessionalActivityById(id: string): Promise<Result<ProfessionalActivityOutputDto>> {
    return Promise.resolve(
      Result.ok<ProfessionalActivityOutputDto>({
        id,
        profileId: 'profile-1',
        category: 'MEMBERSHIP',
        title: 'Mock Activity',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  getProfessionalActivitiesByProfileId(
    profileId: string,
  ): Promise<Result<ProfessionalActivityOutputDto[]>> {
    return Promise.resolve(
      Result.ok<ProfessionalActivityOutputDto[]>([
        {
          id: 'act-1',
          profileId,
          category: 'MEMBERSHIP',
          title: 'Mock Activity',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]),
    );
  }

  searchProfessionalActivities(): Promise<Result<ProfessionalActivityOutputDto[]>> {
    return Promise.resolve(Result.ok<ProfessionalActivityOutputDto[]>([]));
  }

  deleteProfessionalActivity(): Promise<Result<void>> {
    return Promise.resolve(Result.ok());
  }
}

describe('Academic Recognition Presentation REST API Tests', () => {
  const service = new MockAcademicRecognitionApplicationService();
  const controller = new AcademicRecognitionController(service);
  const router = createAcademicRecognitionRouter({ controller });

  const app = express();
  app.use(json());
  app.use('/api/v1', router);

  it('POST /api/v1/awards should create award (201)', async () => {
    const res = await request(app).post('/api/v1/awards').send({
      profileId: '11111111-1111-4111-a111-111111111111',
      title: 'IEEE Innovation Award',
      category: 'AWARD',
      amount: 5000,
    });

    expect(res.status).toBe(201);
    const body = res.body as { success: boolean; data: { title: string } };
    expect(body.success).toBe(true);
    expect(body.data.title).toBe('IEEE Innovation Award');
  });

  it('GET /api/v1/awards/:id should return award (200)', async () => {
    const res = await request(app).get('/api/v1/awards/award-123');

    expect(res.status).toBe(200);
    const body = res.body as { success: boolean; data: { id: string } };
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('award-123');
  });

  it('POST /api/v1/grants should create grant (201)', async () => {
    const res = await request(app).post('/api/v1/grants').send({
      profileId: '11111111-1111-4111-a111-111111111111',
      grantNumber: 'NSF-9921',
      title: 'Cybersecurity Research',
      fundingAgency: 'NSF',
      amount: 250000,
      startDate: '2026-01-01',
      endDate: '2027-12-31',
    });

    expect(res.status).toBe(201);
    const body = res.body as { success: boolean; data: { grantNumber: string } };
    expect(body.success).toBe(true);
    expect(body.data.grantNumber).toBe('NSF-9921');
  });
});
