/**
 * Sprint 7 Research Profile Application Service Unit Tests
 */

import { InMemoryResearchProfileRepository } from '@rios/infrastructure';
import { describe, expect, it } from 'vitest';

import { ResearchProfileApplicationService } from '../index.js';

describe('ResearchProfileApplicationService', () => {
  it('should create a research profile and retrieve it', async () => {
    const repo = new InMemoryResearchProfileRepository();
    const service = new ResearchProfileApplicationService(repo);

    const createRes = await service.createProfile({
      userId: 'user-app-1',
      title: 'Dr. Alan Turing',
      headline: 'Father of Modern Computing',
      biography: 'Cryptanalyst, mathematician, and computer scientist.',
    });

    expect(createRes.isSuccess).toBe(true);
    const dto = createRes.value;
    expect(dto.title).toBe('Dr. Alan Turing');
    expect(dto.userId).toBe('user-app-1');

    const getRes = await service.getProfileById(dto.id);
    expect(getRes.isSuccess).toBe(true);
    expect(getRes.value.headline).toBe('Father of Modern Computing');
  });

  it('should add and remove education records', async () => {
    const repo = new InMemoryResearchProfileRepository();
    const service = new ResearchProfileApplicationService(repo);

    const createRes = await service.createProfile({
      userId: 'user-app-2',
      title: 'Dr. Ada Lovelace',
    });

    const profileId = createRes.value.id;

    const eduRes = await service.addEducation({
      profileId,
      institution: 'University of London',
      degree: 'Master of Mathematics',
      fieldOfStudy: 'Mathematical Analytics',
      startDate: new Date('1833-01-01'),
      isCurrent: false,
    });

    expect(eduRes.isSuccess).toBe(true);
    expect(eduRes.value.education.length).toBe(1);

    const eduId = eduRes.value.education[0]?.id;
    if (typeof eduId === 'string') {
      const removeRes = await service.removeEducation(profileId, eduId);
      expect(removeRes.isSuccess).toBe(true);
      expect(removeRes.value.education.length).toBe(0);
    }
  });
});
