/**
 * Profile Completeness Evaluator Domain Service
 */

import { ResearchProfile } from '../aggregates/research-profile.js';

export interface CompletenessReport {
  overallPercentage: number;
  hasBiography: boolean;
  hasSummary: boolean;
  hasStatement: boolean;
  hasEducation: boolean;
  hasExperience: boolean;
  hasInterests: boolean;
  hasSkills: boolean;
  hasExternalProfiles: boolean;
  missingSections: string[];
}

export class ProfileCompletenessEvaluator {
  public static evaluate(profile: ResearchProfile): CompletenessReport {
    const hasBiography = Boolean(profile.biography && profile.biography.value.length > 0);
    const hasSummary = Boolean(profile.summary && profile.summary.value.length > 0);
    const hasStatement = Boolean(profile.statement && profile.statement.value.length > 0);
    const hasEducation = profile.education.length > 0;
    const hasExperience = profile.experience.length > 0;
    const hasInterests = profile.interests.length > 0;
    const hasSkills = profile.skills.length > 0;
    const hasExternalProfiles = profile.externalProfiles.length > 0;

    const sections = [
      { name: 'Biography', check: hasBiography, weight: 15 },
      { name: 'Academic Summary', check: hasSummary, weight: 15 },
      { name: 'Research Statement', check: hasStatement, weight: 15 },
      { name: 'Education', check: hasEducation, weight: 15 },
      { name: 'Professional Experience', check: hasExperience, weight: 10 },
      { name: 'Research Interests', check: hasInterests, weight: 10 },
      { name: 'Skills', check: hasSkills, weight: 10 },
      { name: 'External Profiles', check: hasExternalProfiles, weight: 10 },
    ];

    let overallPercentage = 0;
    const missingSections: string[] = [];

    for (const sec of sections) {
      if (sec.check) {
        overallPercentage += sec.weight;
      } else {
        missingSections.push(sec.name);
      }
    }

    return {
      overallPercentage,
      hasBiography,
      hasSummary,
      hasStatement,
      hasEducation,
      hasExperience,
      hasInterests,
      hasSkills,
      hasExternalProfiles,
      missingSections,
    };
  }
}
