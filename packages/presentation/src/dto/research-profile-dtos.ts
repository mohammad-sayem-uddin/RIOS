/**
 * Research Profile API Request & Response DTOs
 */

export interface CreateResearchProfileApiRequestDto {
  userId: string;
  title: string;
  headline?: string;
  biography?: string;
  summary?: string;
  statement?: string;
}

export interface UpdateBiographyApiRequestDto {
  biography: string;
}

export interface AddEducationApiRequestDto {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
}

export interface AddExperienceApiRequestDto {
  positionTitle: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface AddResearchInterestApiRequestDto {
  name: string;
  category?: string;
}

export interface AddSkillApiRequestDto {
  name: string;
  category:
    | 'PROGRAMMING_LANGUAGE'
    | 'AI_TECHNOLOGY'
    | 'RESEARCH_METHODOLOGY'
    | 'FRAMEWORK'
    | 'LABORATORY'
    | 'PROFESSIONAL'
    | 'OTHER';
  proficiencyLevel?: string;
}

export interface AddExternalProfileApiRequestDto {
  provider:
    | 'ORCID'
    | 'GOOGLE_SCHOLAR'
    | 'SEMANTIC_SCHOLAR'
    | 'RESEARCHGATE'
    | 'GITHUB'
    | 'LINKEDIN'
    | 'PERSONAL_WEBSITE'
    | 'OTHER';
  url: string;
  externalIdentifier?: string;
}

export interface UploadPortfolioAssetApiRequestDto {
  title: string;
  assetType:
    | 'CV'
    | 'RESUME'
    | 'PROFILE_PHOTO'
    | 'COVER_IMAGE'
    | 'RESEARCH_STATEMENT_DOC'
    | 'SUPPORTING_DOCUMENT'
    | 'OTHER';
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
}
