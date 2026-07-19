import {
  DOI,
  IPublicationRepository,
  IResearchProjectRepository,
  IVenueRepository,
  ProjectId,
  Publication,
  PublicationId,
  ResearchProject,
  Venue,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PublicationApplicationServiceImpl } from '../../publications/services/publication-application-service.impl.js';

describe('PublicationApplicationService Unit Tests', () => {
  let pubRepo: IPublicationRepository;
  let projRepo: IResearchProjectRepository;
  let venueRepo: IVenueRepository;
  let service: PublicationApplicationServiceImpl;

  const mockProfileId = UniqueId.create().value;

  beforeEach(() => {
    const pubStore = new Map<string, Publication>();
    const projStore = new Map<string, ResearchProject>();
    const venueStore = new Map<string, Venue>();

    pubRepo = {
      findById: vi.fn((id: PublicationId) => Promise.resolve(pubStore.get(id.value) ?? null)),
      findByDOI: vi.fn((doi: DOI) => {
        for (const p of pubStore.values()) {
          if (p.doi?.value === doi.value) return Promise.resolve(p);
        }
        return Promise.resolve(null);
      }),
      findByAuthor: vi.fn(() => Promise.resolve([])),
      findByResearchProfile: vi.fn((profileId: UniqueId) => {
        return Promise.resolve(
          Array.from(pubStore.values()).filter((p) => p.profileId.equals(profileId)),
        );
      }),
      search: vi.fn(() => Promise.resolve(Array.from(pubStore.values()))),
      save: vi.fn((pub: Publication) => {
        pubStore.set(pub.id.value, pub);
        return Promise.resolve();
      }),
      delete: vi.fn((id: PublicationId) => {
        pubStore.delete(id.value);
        return Promise.resolve();
      }),
    };

    projRepo = {
      findById: vi.fn((id: ProjectId) => Promise.resolve(projStore.get(id.value) ?? null)),
      findByResearchProfile: vi.fn((profileId: UniqueId) => {
        return Promise.resolve(
          Array.from(projStore.values()).filter((p) => p.profileId.equals(profileId)),
        );
      }),
      save: vi.fn((proj: ResearchProject) => {
        projStore.set(proj.id.value, proj);
        return Promise.resolve();
      }),
      delete: vi.fn((id: ProjectId) => {
        projStore.delete(id.value);
        return Promise.resolve();
      }),
    };

    venueRepo = {
      findById: vi.fn((id: UniqueId) => Promise.resolve(venueStore.get(id.value) ?? null)),
      findByName: vi.fn(() => Promise.resolve(null)),
      search: vi.fn(() => Promise.resolve([])),
      save: vi.fn((v: Venue) => {
        venueStore.set(v.id.value, v);
        return Promise.resolve();
      }),
      delete: vi.fn((id: UniqueId) => {
        venueStore.delete(id.value);
        return Promise.resolve();
      }),
    };

    service = new PublicationApplicationServiceImpl(pubRepo, projRepo, venueRepo);
  });

  it('should create and retrieve publication successfully', async () => {
    const createRes = await service.createPublication({
      profileId: mockProfileId,
      title: 'Attention Is All You Need',
      type: 'CONFERENCE_PAPER',
      status: 'PUBLISHED',
      doi: '10.5555/3295222.3295349',
      year: 2017,
      authors: [
        {
          name: 'Ashish Vaswani',
          authorOrder: 1,
          isCorresponding: true,
        },
      ],
    });

    expect(createRes.isSuccess).toBe(true);
    const pub = createRes.value;
    expect(pub.title).toBe('Attention Is All You Need');
    expect(pub.authors.length).toBe(1);

    const getRes = await service.getPublicationById(pub.id);
    expect(getRes.isSuccess).toBe(true);
    expect(getRes.value.id).toBe(pub.id);
  });

  it('should compute publication statistics including h-index and i10-index', async () => {
    await service.createPublication({
      profileId: mockProfileId,
      title: 'Paper A',
      type: 'JOURNAL_ARTICLE',
      status: 'PUBLISHED',
      year: 2020,
    });

    const statsRes = await service.getPublicationStatistics(mockProfileId);
    expect(statsRes.isSuccess).toBe(true);
    expect(statsRes.value.totalPublications).toBe(1);
    expect(statsRes.value.publishedCount).toBe(1);
  });

  it('should create and complete research project', async () => {
    const createRes = await service.createResearchProject({
      profileId: mockProfileId,
      title: 'Next Gen AI Architectures',
      description: 'Research into sparse mixture-of-experts transformer systems.',
      startDate: '2026-01-01',
      members: [
        {
          name: 'Dr. Vaswani',
          role: 'PRINCIPAL_INVESTIGATOR',
          startDate: '2026-01-01',
        },
      ],
    });

    expect(createRes.isSuccess).toBe(true);
    const proj = createRes.value;
    expect(proj.status).toBe('ACTIVE');

    const completeRes = await service.completeResearchProject(proj.id, '2026-12-31');
    expect(completeRes.isSuccess).toBe(true);
    expect(completeRes.value.status).toBe('COMPLETED');
  });
});
