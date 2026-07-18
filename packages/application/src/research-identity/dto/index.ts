/**
 * Application Layer DTOs for Research Identity
 */

export interface EducationDto {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface ExperienceDto {
  id: string;
  positionTitle: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string;
}

export interface ResearchInterestDto {
  id: string;
  name: string;
  category?: string;
}

export interface SkillDto {
  id: string;
  name: string;
  category: string;
  proficiencyLevel?: string;
}

export interface ExternalProfileDto {
  id: string;
  provider: string;
  url: string;
  externalIdentifier?: string;
  isVerified: boolean;
}

export interface PortfolioAssetDto {
  id: string;
  title: string;
  assetType: string;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

export interface ResearchProfileDto {
  id: string;
  userId: string;
  title: string;
  headline?: string;
  biography?: string;
  summary?: string;
  statement?: string;
  mission?: string;
  vision?: string;
  education: EducationDto[];
  experience: ExperienceDto[];
  interests: ResearchInterestDto[];
  skills: SkillDto[];
  externalProfiles: ExternalProfileDto[];
  portfolioAssets: PortfolioAssetDto[];
  completenessPercentage: number;
  createdAt: string;
  updatedAt: string;
}
