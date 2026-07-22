/**
 * RIOS — Research Profile Service
 *
 * Boundary for the research-profile backend endpoints used by onboarding (and
 * later by the profile/CV features in Part 4). Every path here is ✅ VERIFIED
 * against packages/presentation/src/routes/research-profile.routes.ts.
 */

import { apiClient } from '@/lib/api-client';
import type { ResearchProfile } from '@/types/api';

/** ✅ POST /research-profiles — matches CreateResearchProfileApiRequestDto. */
export interface CreateProfilePayload {
  userId: string;
  title: string;
  headline?: string;
  biography?: string;
  summary?: string;
  statement?: string;
}

/** ✅ POST /research-profiles/:id/research-interests */
export interface AddResearchInterestPayload {
  name: string;
  category?: string;
}

/** ✅ POST /research-profiles/:id/external-profiles */
export type ExternalProvider =
  | 'ORCID'
  | 'GOOGLE_SCHOLAR'
  | 'SEMANTIC_SCHOLAR'
  | 'RESEARCHGATE'
  | 'GITHUB'
  | 'LINKEDIN'
  | 'PERSONAL_WEBSITE'
  | 'OTHER';

export interface AddExternalProfilePayload {
  provider: ExternalProvider;
  url: string;
  externalIdentifier?: string;
}

/** ✅ POST /research-profiles/:id/education */
export interface AddEducationPayload {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
}

/** ✅ POST /research-profiles/:id/experience */
export interface AddExperiencePayload {
  positionTitle: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

/** ✅ POST /research-profiles/:id/skills */
export type SkillCategory =
  | 'PROGRAMMING_LANGUAGE'
  | 'AI_TECHNOLOGY'
  | 'RESEARCH_METHODOLOGY'
  | 'FRAMEWORK'
  | 'LABORATORY'
  | 'PROFESSIONAL'
  | 'OTHER';

export interface AddSkillPayload {
  name: string;
  category: SkillCategory;
  proficiencyLevel?: string;
}

export const researchProfileService = {
  /** ✅ Fetch the profile owned by a user (used to detect completed onboarding). */
  async getByUserId(userId: string): Promise<ResearchProfile> {
    return apiClient.get<ResearchProfile>(`/api/v1/users/${userId}/research-profile`);
  },

  /** ✅ Create a research profile. */
  async create(payload: CreateProfilePayload): Promise<ResearchProfile> {
    return apiClient.post<ResearchProfile>('/api/v1/research-profiles', payload);
  },

  /** ✅ Add a research interest to a profile. */
  async addResearchInterest(
    profileId: string,
    payload: AddResearchInterestPayload,
  ): Promise<ResearchProfile> {
    return apiClient.post<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/research-interests`,
      payload,
    );
  },

  /** ✅ Add an external profile link (e.g. ORCID) to a profile. */
  async addExternalProfile(
    profileId: string,
    payload: AddExternalProfilePayload,
  ): Promise<ResearchProfile> {
    return apiClient.post<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/external-profiles`,
      payload,
    );
  },

  /** ✅ PUT /research-profiles/:id/biography — replace the biography text. */
  async updateBiography(profileId: string, biography: string): Promise<ResearchProfile> {
    return apiClient.put<ResearchProfile>(`/api/v1/research-profiles/${profileId}/biography`, {
      biography,
    });
  },

  /** ✅ Add an education entry. */
  async addEducation(profileId: string, payload: AddEducationPayload): Promise<ResearchProfile> {
    return apiClient.post<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/education`,
      payload,
    );
  },

  /** ✅ Add a professional experience entry. */
  async addExperience(profileId: string, payload: AddExperiencePayload): Promise<ResearchProfile> {
    return apiClient.post<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/experience`,
      payload,
    );
  },

  /** ✅ Add a skill. */
  async addSkill(profileId: string, payload: AddSkillPayload): Promise<ResearchProfile> {
    return apiClient.post<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/skills`,
      payload,
    );
  },

  /** ✅ Remove a research interest. */
  async removeResearchInterest(profileId: string, interestId: string): Promise<ResearchProfile> {
    return apiClient.delete<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/research-interests/${interestId}`,
    );
  },

  /** ✅ Remove a skill. */
  async removeSkill(profileId: string, skillId: string): Promise<ResearchProfile> {
    return apiClient.delete<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/skills/${skillId}`,
    );
  },

  /** ✅ Remove an external profile link. */
  async removeExternalProfile(
    profileId: string,
    externalProfileId: string,
  ): Promise<ResearchProfile> {
    return apiClient.delete<ResearchProfile>(
      `/api/v1/research-profiles/${profileId}/external-profiles/${externalProfileId}`,
    );
  },
};
