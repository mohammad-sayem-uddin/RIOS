import { describe, expect, it } from 'vitest';

import { ResearchIntelligenceMapper } from '../research-intelligence/mappers/research-intelligence.mapper.js';

describe('Research Intelligence Infrastructure Unit Tests', () => {
  const profileId = '11111111-1111-1111-1111-111111111111';

  it('should map AcademicTimelineModel to domain aggregate and back', () => {
    const rawModel = {
      id: '22222222-2222-2222-2222-222222222222',
      profileId,
      createdAt: new Date(),
      updatedAt: new Date(),
      events: [
        {
          id: '33333333-3333-3333-3333-333333333333',
          timelineId: '22222222-2222-2222-2222-222222222222',
          eventType: 'publication',
          title: 'Paper on Quantum Mechanics',
          description: 'Published in Nature',
          eventDate: new Date('2026-04-01'),
          metadataJson: null,
          createdAt: new Date(),
        },
      ],
      milestones: [],
      institutionHistories: [],
      researchInterestHistories: [],
    };

    const domain = ResearchIntelligenceMapper.toTimelineDomain(rawModel);
    expect(domain.id.value).toBe('22222222-2222-2222-2222-222222222222');
    expect(domain.events.length).toBe(1);
    expect(domain.events[0]?.title).toBe('Paper on Quantum Mechanics');
  });

  it('should map CollaborationNetworkModel to domain aggregate', () => {
    const rawModel = {
      id: '44444444-4444-4444-4444-444444444444',
      profileId,
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborations: [
        {
          id: '55555555-5555-5555-5555-555555555555',
          networkId: '44444444-4444-4444-4444-444444444444',
          collaboratorName: 'Dr. Jane Doe',
          collaboratorEmail: 'jane@mit.edu',
          collaboratorOrcid: '0000-0001-2345-6789',
          institution: 'MIT',
          strength: 'strong',
          jointPublicationCount: 8,
          firstCollabDate: new Date('2024-01-01'),
          lastCollabDate: new Date('2026-05-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
          coAuthors: [],
        },
      ],
    };

    const domain = ResearchIntelligenceMapper.toCollaborationNetworkDomain(rawModel);
    expect(domain.profileId).toBe(profileId);
    expect(domain.collaborations.length).toBe(1);
    expect(domain.collaborations[0]?.collaboratorName).toBe('Dr. Jane Doe');
  });

  it('should map ResearchAnalyticsModel to domain aggregate', () => {
    const rawModel = {
      id: '66666666-6666-6666-6666-666666666666',
      profileId,
      createdAt: new Date(),
      updatedAt: new Date(),
      publicationStats: [
        {
          id: '77777777-7777-7777-7777-777777777777',
          analyticsId: '66666666-6666-6666-6666-666666666666',
          year: 2026,
          count: 10,
          firstAuthorCount: 4,
          correspondingAuthorCount: 3,
          createdAt: new Date(),
        },
      ],
      citationStats: [],
      metrics: [
        {
          id: '88888888-8888-8888-8888-888888888888',
          analyticsId: '66666666-6666-6666-6666-666666666666',
          metricType: 'h_index',
          metricName: 'H-Index',
          value: 7,
          measuredAt: new Date(),
          createdAt: new Date(),
        },
      ],
      trends: [],
    };

    const domain = ResearchIntelligenceMapper.toResearchAnalyticsDomain(rawModel);
    expect(domain.profileId).toBe(profileId);
    expect(domain.getMetricValue('h_index')).toBe(7);
  });
});
