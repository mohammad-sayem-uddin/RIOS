import { describe, expect, it } from 'vitest';

import { PublicationMapper } from '../../publications/mappers/publication-mapper.js';

describe('PublicationMapper Unit Tests', () => {
  it('should map full Prisma record to Domain Publication aggregate and back', () => {
    const raw = {
      id: '11111111-1111-1111-1111-111111111111',
      profileId: '22222222-2222-2222-2222-222222222222',
      title: 'Generative Adversarial Nets',
      type: 'CONFERENCE_PAPER',
      status: 'PUBLISHED',
      doi: '10.5555/2969033.2969125',
      isbn: null,
      abstract: 'Generative modeling framework via adversarial process.',
      keywords: 'GAN, Deep Learning, Generative Models',
      year: 2014,
      citationCount: 45000,
      url: 'https://arxiv.org/abs/1406.2661',
      language: 'en',
      venueId: null,
      publisherId: null,
      submittedDate: new Date('2014-06-01'),
      acceptedDate: new Date('2014-10-01'),
      publishedDate: new Date('2014-12-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
      authors: [
        {
          id: '33333333-3333-3333-3333-333333333333',
          publicationId: '11111111-1111-1111-1111-111111111111',
          name: 'Ian Goodfellow',
          email: 'ian@example.com',
          orcid: '0000-0002-1825-0097',
          authorOrder: 1,
          isCorresponding: true,
          affiliations: [
            {
              id: '44444444-4444-4444-4444-444444444444',
              authorId: '33333333-3333-3333-3333-333333333333',
              institution: 'Université de Montréal',
              department: 'DIRO',
              location: 'Montreal, Canada',
            },
          ],
        },
      ],
      fundings: [],
    };

    const domain = PublicationMapper.toDomain(raw);
    expect(domain.id.value).toBe(raw.id);
    expect(domain.title.value).toBe(raw.title);
    expect(domain.doi?.value).toBe(raw.doi);
    expect(domain.authors.length).toBe(1);
    expect(domain.authors[0].affiliations[0].institution).toBe('Université de Montréal');

    const persistence = PublicationMapper.toPersistence(domain);
    expect(persistence.id).toBe(raw.id);
    expect(persistence.title).toBe(raw.title);
    expect(persistence.doi).toBe(raw.doi);
  });
});
