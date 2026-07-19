import { UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import { ProjectMember, ProjectRole, ResearchProject } from '../../publications/index.js';

describe('ResearchProject Aggregate Root Unit Tests', () => {
  const profileId = UniqueId.create();
  const piRole = ProjectRole.create('PRINCIPAL_INVESTIGATOR').value;
  const researcherRole = ProjectRole.create('RESEARCHER').value;

  const validMember = ProjectMember.create({
    name: 'Dr. Jane Doe',
    role: piRole,
    startDate: new Date('2026-01-01'),
  }).value;

  it('should create valid ResearchProject when Principal Investigator is present', () => {
    const res = ResearchProject.create({
      profileId,
      title: 'Quantum Computing Operating System',
      description: 'Developing next generation NISQ fault-tolerant operating system primitives.',
      startDate: new Date('2026-01-01'),
      members: [validMember],
    });

    expect(res.isSuccess).toBe(true);
    const project = res.value;
    expect(project.status).toBe('ACTIVE');
    expect(project.members.length).toBe(1);
    expect(project.domainEvents[0].eventType).toBe('ProjectCreated');
  });

  it('should reject creation when no Principal Investigator is provided', () => {
    const nonPIMember = ProjectMember.create({
      name: 'Bob Student',
      role: researcherRole,
      startDate: new Date('2026-01-01'),
    }).value;

    const res = ResearchProject.create({
      profileId,
      title: 'Quantum Computing OS',
      description: 'Description',
      startDate: new Date('2026-01-01'),
      members: [nonPIMember],
    });

    expect(res.isFailure).toBe(true);
    expect(res.error).toContain('Principal Investigator');
  });

  it('should enforce completion date invariant', () => {
    const project = ResearchProject.create({
      profileId,
      title: 'Project Alpha',
      description: 'Description',
      startDate: new Date('2026-01-01'),
      members: [validMember],
    }).value;

    const completeRes = project.complete(new Date('2026-12-31'));
    expect(completeRes.isSuccess).toBe(true);
    expect(project.status).toBe('COMPLETED');

    // Reject end date before start date
    const project2 = ResearchProject.create({
      profileId,
      title: 'Project Beta',
      description: 'Description',
      startDate: new Date('2026-01-01'),
      members: [validMember],
    }).value;
    const invalidComplete = project2.complete(new Date('2025-12-31'));
    expect(invalidComplete.isFailure).toBe(true);
  });
});
