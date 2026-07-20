import type {
  IAcademicTimelineRepository,
  ICollaborationRepository,
  IResearchAnalyticsRepository,
} from '@rios/domain';
import { describe, expect, it, vi } from 'vitest';

import { ResearchIntelligenceApplicationServiceImpl } from '../research-intelligence/services/research-intelligence-application-service.impl.js';

describe('Research Intelligence Application Unit Tests', () => {
  const profileId = '11111111-1111-1111-1111-111111111111';

  const saveTimelineMock = vi.fn().mockResolvedValue(undefined);
  const saveCollabMock = vi.fn().mockResolvedValue(undefined);
  const saveAnalyticsMock = vi.fn().mockResolvedValue(undefined);

  const mockTimelineRepo: IAcademicTimelineRepository = {
    save: saveTimelineMock,
    findById: vi.fn().mockResolvedValue(null),
    findByResearchProfile: vi.fn().mockResolvedValue(null),
    search: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(undefined),
  };

  const mockCollaborationRepo: ICollaborationRepository = {
    save: saveCollabMock,
    findById: vi.fn().mockResolvedValue(null),
    findByResearchProfile: vi.fn().mockResolvedValue(null),
    search: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(undefined),
  };

  const mockAnalyticsRepo: IResearchAnalyticsRepository = {
    save: saveAnalyticsMock,
    findById: vi.fn().mockResolvedValue(null),
    findByResearchProfile: vi.fn().mockResolvedValue(null),
    search: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(undefined),
  };

  const service = new ResearchIntelligenceApplicationServiceImpl(
    mockTimelineRepo,
    mockCollaborationRepo,
    mockAnalyticsRepo,
  );

  it('should create a timeline event via application service', async () => {
    const res = await service.createTimelineEvent({
      profileId,
      eventType: 'publication',
      title: 'Deep Learning for Protein Design',
      eventDate: '2026-05-10T00:00:00.000Z',
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.events.length).toBe(1);
    expect(res.value.events[0]?.title).toBe('Deep Learning for Protein Design');
    expect(saveTimelineMock).toHaveBeenCalled();
  });

  it('should create a collaboration via application service', async () => {
    const res = await service.createCollaboration({
      profileId,
      collaboratorName: 'Dr. John Von Neumann',
      collaboratorEmail: 'john@ias.edu',
      strength: 'very_strong',
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.collaborations.length).toBe(1);
    expect(res.value.collaborations[0]?.collaboratorName).toBe('Dr. John Von Neumann');
    expect(saveCollabMock).toHaveBeenCalled();
  });

  it('should calculate research metrics via application service', async () => {
    const res = await service.calculateResearchMetrics({
      profileId,
      hIndex: 12,
      i10Index: 18,
      citationCount: 450,
      rgScore: 32.5,
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.metrics.length).toBe(4);
    expect(saveAnalyticsMock).toHaveBeenCalled();
  });

  it('should retrieve citation statistics via application service query', async () => {
    const res = await service.getCitationStatistics(profileId);
    expect(res.isSuccess).toBe(true);
    expect(res.value.profileId).toBe(profileId);
  });
});
