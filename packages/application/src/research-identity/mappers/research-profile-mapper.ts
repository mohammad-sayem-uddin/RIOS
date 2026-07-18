/**
 * Research Profile Application Mapper
 * Maps ResearchProfile Aggregate to ResearchProfileDto
 */

import { ProfileCompletenessEvaluator, ResearchProfile } from '@rios/domain';

import { ResearchProfileDto } from '../dto/index.js';

export class ResearchProfileMapper {
  public static toDto(profile: ResearchProfile): ResearchProfileDto {
    const completeness = ProfileCompletenessEvaluator.evaluate(profile);

    return {
      id: profile.id.value,
      userId: profile.userId.value,
      title: profile.title,
      headline: profile.headline?.value,
      biography: profile.biography?.value,
      summary: profile.summary?.value,
      statement: profile.statement?.value,
      mission: profile.mission?.value,
      vision: profile.vision?.value,
      education: profile.education.map((e) => ({
        id: e.id.value,
        institution: e.institution.value,
        degree: e.degree.value,
        fieldOfStudy: e.fieldOfStudy,
        startDate: e.period.startDate.toISOString(),
        endDate:
          e.period.endDate !== null && e.period.endDate !== undefined
            ? e.period.endDate.toISOString()
            : null,
        isCurrent: e.period.isCurrent,
        grade: e.grade,
        description: e.description,
      })),
      experience: profile.experience.map((e) => ({
        id: e.id.value,
        positionTitle: e.positionTitle,
        organization: e.organization,
        location: e.location,
        startDate: e.period.startDate.toISOString(),
        endDate:
          e.period.endDate !== null && e.period.endDate !== undefined
            ? e.period.endDate.toISOString()
            : null,
        isCurrent: e.period.isCurrent,
        description: e.description,
      })),
      interests: profile.interests.map((i) => ({
        id: i.id.value,
        name: i.name.value,
        category: i.category,
      })),
      skills: profile.skills.map((s) => ({
        id: s.id.value,
        name: s.name.value,
        category: s.category,
        proficiencyLevel: s.proficiencyLevel,
      })),
      externalProfiles: profile.externalProfiles.map((p) => ({
        id: p.id.value,
        provider: p.provider,
        url: p.profileUrl.url,
        externalIdentifier: p.externalIdentifier,
        isVerified: p.isVerified,
      })),
      portfolioAssets: profile.portfolioAssets.map((a) => ({
        id: a.id.value,
        title: a.title,
        assetType: a.assetType,
        fileUrl: a.fileUrl,
        mimeType: a.mimeType,
        fileSizeBytes: a.fileSizeBytes,
        uploadedAt: a.uploadedAt.toISOString(),
      })),
      completenessPercentage: completeness.overallPercentage,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
