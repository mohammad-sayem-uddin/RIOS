import { Award, Grant, Patent, ProfessionalActivity } from '@rios/domain';
import { describe, expect, it } from 'vitest';

import { AcademicRecognitionApplicationServiceImpl } from '../academic-recognition/services/academic-recognition-application-service.impl.js';

class InMemoryAwardRepository {
  private items = new Map<string, Award>();
  save(award: Award): Promise<void> {
    this.items.set(award.awardId.value, award);
    return Promise.resolve();
  }
  findById(id: string): Promise<Award | null> {
    return Promise.resolve(this.items.get(id) ?? null);
  }
  findByResearchProfile(profileId: string): Promise<Award[]> {
    return Promise.resolve(
      Array.from(this.items.values()).filter((a) => a.profileId.value === profileId),
    );
  }
  search(query: string): Promise<Award[]> {
    return Promise.resolve(Array.from(this.items.values()).filter((a) => a.title.includes(query)));
  }
  delete(id: string): Promise<void> {
    this.items.delete(id);
    return Promise.resolve();
  }
}

class InMemoryGrantRepository {
  private items = new Map<string, Grant>();
  save(grant: Grant): Promise<void> {
    this.items.set(grant.grantId.value, grant);
    return Promise.resolve();
  }
  findById(id: string): Promise<Grant | null> {
    return Promise.resolve(this.items.get(id) ?? null);
  }
  findByGrantNumber(grantNum: string): Promise<Grant | null> {
    return Promise.resolve(
      Array.from(this.items.values()).find((g) => g.grantNumber.value === grantNum) ?? null,
    );
  }
  findByResearchProfile(profileId: string): Promise<Grant[]> {
    return Promise.resolve(
      Array.from(this.items.values()).filter((g) => g.profileId.value === profileId),
    );
  }
  search(query: string): Promise<Grant[]> {
    return Promise.resolve(Array.from(this.items.values()).filter((g) => g.title.includes(query)));
  }
  delete(id: string): Promise<void> {
    this.items.delete(id);
    return Promise.resolve();
  }
}

class InMemoryPatentRepository {
  private items = new Map<string, Patent>();
  save(patent: Patent): Promise<void> {
    this.items.set(patent.patentId.value, patent);
    return Promise.resolve();
  }
  findById(id: string): Promise<Patent | null> {
    return Promise.resolve(this.items.get(id) ?? null);
  }
  findByPatentNumber(patentNum: string): Promise<Patent | null> {
    return Promise.resolve(
      Array.from(this.items.values()).find((p) => p.patentNumber.value === patentNum) ?? null,
    );
  }
  findByResearchProfile(profileId: string): Promise<Patent[]> {
    return Promise.resolve(
      Array.from(this.items.values()).filter((p) => p.profileId.value === profileId),
    );
  }
  search(query: string): Promise<Patent[]> {
    return Promise.resolve(Array.from(this.items.values()).filter((p) => p.title.includes(query)));
  }
  delete(id: string): Promise<void> {
    this.items.delete(id);
    return Promise.resolve();
  }
}

class InMemoryProfessionalActivityRepository {
  private items = new Map<string, ProfessionalActivity>();
  save(act: ProfessionalActivity): Promise<void> {
    this.items.set(act.activityId.value, act);
    return Promise.resolve();
  }
  findById(id: string): Promise<ProfessionalActivity | null> {
    return Promise.resolve(this.items.get(id) ?? null);
  }
  findByResearchProfile(profileId: string): Promise<ProfessionalActivity[]> {
    return Promise.resolve(
      Array.from(this.items.values()).filter((a) => a.profileId.value === profileId),
    );
  }
  search(query: string): Promise<ProfessionalActivity[]> {
    return Promise.resolve(Array.from(this.items.values()).filter((a) => a.title.includes(query)));
  }
  delete(id: string): Promise<void> {
    this.items.delete(id);
    return Promise.resolve();
  }
}

describe('Academic Recognition Application Service Integration Tests', () => {
  const awardRepo = new InMemoryAwardRepository();
  const grantRepo = new InMemoryGrantRepository();
  const patentRepo = new InMemoryPatentRepository();
  const activityRepo = new InMemoryProfessionalActivityRepository();

  const service = new AcademicRecognitionApplicationServiceImpl(
    awardRepo,
    grantRepo,
    patentRepo,
    activityRepo,
  );
  const profileId = '11111111-1111-4111-a111-111111111111';

  it('should create award via application service', async () => {
    const res = await service.createAward({
      profileId,
      title: 'Turing Innovation Award',
      category: 'AWARD',
      sponsorOrAgency: 'ACM',
      amount: 100000,
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.title).toBe('Turing Innovation Award');
  });

  it('should create and complete grant via application service', async () => {
    const createRes = await service.createGrant({
      profileId,
      grantNumber: 'GRANT-2026-X1',
      title: 'AI Governance Frameworks',
      fundingAgency: 'DARPA',
      amount: 750000,
      startDate: '2026-01-01',
      endDate: '2028-12-31',
    });

    expect(createRes.isSuccess).toBe(true);
    expect(createRes.value.status).toBe('ACTIVE');

    const compRes = await service.completeGrant(createRes.value.id);
    expect(compRes.isSuccess).toBe(true);
    expect(compRes.value.status).toBe('COMPLETED');
  });

  it('should create and update patent via application service', async () => {
    const createRes = await service.createPatent({
      profileId,
      patentNumber: 'US-9928172',
      title: 'Autonomous System Protocol',
      status: 'APPLIED',
      patentType: 'UTILITY',
      filingDate: '2026-01-15',
    });

    expect(createRes.isSuccess).toBe(true);

    const updateRes = await service.updatePatentStatus({
      patentId: createRes.value.id,
      nextStatus: 'PENDING',
    });

    expect(updateRes.isSuccess).toBe(true);
    expect(updateRes.value.status).toBe('PENDING');
  });
});
