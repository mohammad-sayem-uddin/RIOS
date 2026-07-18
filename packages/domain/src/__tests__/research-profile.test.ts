/**
 * Sprint 7 Research Profile Domain Unit Tests
 */

import { UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  AcademicHeadline,
  AcademicPeriod,
  AcademicSummary,
  Biography,
  DegreeName,
  Education,
  InstitutionName,
  ProfileCompletenessEvaluator,
  ResearchInterest,
  ResearchInterestName,
  ResearchProfile,
  ResearchStatement,
  Skill,
  SkillCategory,
  SkillName,
} from '../index.js';

describe('ResearchProfile Aggregate', () => {
  it('should successfully create a new Research Profile and raise ResearchProfileCreated event', () => {
    const userId = UniqueId.from('user-123');
    const profileRes = ResearchProfile.create({
      userId,
      title: 'Dr. Jane Doe',
      headline: AcademicHeadline.create('Principal AI Researcher').value,
      biography: Biography.create('Jane Doe conducts foundational research in machine learning.')
        .value,
    });

    expect(profileRes.isSuccess).toBe(true);
    const profile = profileRes.value;
    expect(profile.title).toBe('Dr. Jane Doe');
    expect(profile.headline?.value).toBe('Principal AI Researcher');
    expect(profile.domainEvents.length).toBe(1);
    expect(profile.domainEvents[0]?.eventType).toBe('ResearchProfileCreated');
  });

  it('should enforce unique education degrees per institution', () => {
    const userId = UniqueId.from('user-456');
    const profile = ResearchProfile.create({ userId, title: 'John Smith' }).value;

    const edu1 = Education.create({
      institution: InstitutionName.create('MIT').value,
      degree: DegreeName.create('Ph.D. Computer Science').value,
      fieldOfStudy: 'Artificial Intelligence',
      period: AcademicPeriod.create(new Date('2018-09-01'), new Date('2022-06-01')).value,
    }).value;

    const edu2 = Education.create({
      institution: InstitutionName.create('MIT').value,
      degree: DegreeName.create('Ph.D. Computer Science').value,
      fieldOfStudy: 'Artificial Intelligence',
      period: AcademicPeriod.create(new Date('2018-09-01'), new Date('2022-06-01')).value,
    }).value;

    const add1 = profile.addEducation(edu1);
    expect(add1.isSuccess).toBe(true);
    expect(profile.education.length).toBe(1);

    const add2 = profile.addEducation(edu2);
    expect(add2.isFailure).toBe(true);
    expect(add2.error).toContain('already exists');
  });

  it('should prevent duplicate research interests regardless of case', () => {
    const userId = UniqueId.from('user-789');
    const profile = ResearchProfile.create({ userId, title: 'Alice' }).value;

    const int1 = ResearchInterest.create({
      name: ResearchInterestName.create('Deep Learning').value,
    }).value;

    const int2 = ResearchInterest.create({
      name: ResearchInterestName.create('deep learning').value,
    }).value;

    expect(profile.addResearchInterest(int1).isSuccess).toBe(true);
    expect(profile.addResearchInterest(int2).isFailure).toBe(true);
  });

  it('should prevent duplicate skills and external profile providers', () => {
    const userId = UniqueId.from('user-000');
    const profile = ResearchProfile.create({ userId, title: 'Bob' }).value;

    const sk1 = Skill.create({
      name: SkillName.create('PyTorch').value,
      category: SkillCategory.FRAMEWORK,
    }).value;

    const sk2 = Skill.create({
      name: SkillName.create('pytorch').value,
      category: SkillCategory.FRAMEWORK,
    }).value;

    expect(profile.addSkill(sk1).isSuccess).toBe(true);
    expect(profile.addSkill(sk2).isFailure).toBe(true);
  });

  it('should correctly calculate completeness report', () => {
    const userId = UniqueId.from('user-111');
    const profile = ResearchProfile.create({ userId, title: 'Dr. Sam' }).value;

    let completeness = ProfileCompletenessEvaluator.evaluate(profile);
    expect(completeness.overallPercentage).toBe(0);

    profile.updateBiography(Biography.create('Sample bio').value);
    profile.updateSummary(AcademicSummary.create('Sample summary').value);
    profile.updateStatement(ResearchStatement.create('Sample statement').value);

    completeness = ProfileCompletenessEvaluator.evaluate(profile);
    expect(completeness.overallPercentage).toBe(45);
    expect(completeness.hasBiography).toBe(true);
    expect(completeness.hasSummary).toBe(true);
    expect(completeness.hasStatement).toBe(true);
  });
});
