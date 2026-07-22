/**
 * RIOS — API Response Types
 *
 * Mirrors backend DTOs from @rios/presentation/dto/
 * Source of truth: backend presentation layer DTOs
 */

/* ── Research Identity ── */

export interface ResearchIdentity {
  id: string;
  stage: string;
  focus: string;
  vision?: {
    statement: string;
    timeHorizon: string;
    targetAudience: string[];
    coreThemes: string[];
  };
  agenda?: {
    focusAreas: string[];
    strategicPillars: string[];
  };
  areasCount: number;
  questionsCount: number;
  goalsCount: number;
  contributionsCount: number;
  createdAt: string;
  updatedAt: string;
}

/* ── Research Profile ── */

export interface ResearchProfile {
  id: string;
  userId: string;
  title: string;
  headline?: string;
  biography?: string;
  summary?: string;
  statement?: string;
  education: Education[];
  experience: Experience[];
  researchInterests: ResearchInterest[];
  skills: Skill[];
  externalProfiles: ExternalProfile[];
  portfolioAssets: PortfolioAsset[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
}

export interface Experience {
  id: string;
  positionTitle: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface ResearchInterest {
  id: string;
  name: string;
  category?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiencyLevel?: string;
}

export type SkillCategory =
  | 'PROGRAMMING_LANGUAGE'
  | 'AI_TECHNOLOGY'
  | 'RESEARCH_METHODOLOGY'
  | 'FRAMEWORK'
  | 'LABORATORY'
  | 'PROFESSIONAL'
  | 'OTHER';

export interface ExternalProfile {
  id: string;
  provider: ExternalProvider;
  url: string;
  externalIdentifier?: string;
}

export type ExternalProvider =
  | 'ORCID'
  | 'GOOGLE_SCHOLAR'
  | 'SEMANTIC_SCHOLAR'
  | 'RESEARCHGATE'
  | 'GITHUB'
  | 'LINKEDIN'
  | 'PERSONAL_WEBSITE'
  | 'OTHER';

export interface PortfolioAsset {
  id: string;
  title: string;
  assetType: PortfolioAssetType;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
}

export type PortfolioAssetType =
  | 'CV'
  | 'RESUME'
  | 'PROFILE_PHOTO'
  | 'COVER_IMAGE'
  | 'RESEARCH_STATEMENT_DOC'
  | 'SUPPORTING_DOCUMENT'
  | 'OTHER';

/* ── Publications ── */

export interface Publication {
  id: string;
  profileId: string;
  title: string;
  type: string;
  status: string;
  doi?: string;
  isbn?: string;
  abstract?: string;
  keywords: string[];
  year?: number;
  url?: string;
  language?: string;
  authors: Author[];
  venue?: Venue;
  publisher?: Publisher;
  fundings: Funding[];
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  name: string;
  email?: string;
  orcid?: string;
  authorOrder: number;
  isCorresponding?: boolean;
  affiliations?: Affiliation[];
}

export interface Affiliation {
  institution: string;
  department?: string;
  location?: string;
}

export interface Venue {
  name: string;
  venueType: 'JOURNAL' | 'CONFERENCE' | 'OTHER';
  issn?: string;
  isbn?: string;
  publisherId?: string;
  url?: string;
}

export interface Publisher {
  name: string;
  location?: string;
  websiteUrl?: string;
}

export interface Funding {
  funderName: string;
  fundingIdentifier?: string;
  grantTitle?: string;
  amountCurrency?: string;
  amountValue?: number;
}

/* ── Research Projects ── */

export interface ResearchProject {
  id: string;
  profileId: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate?: string;
  grantIdentifier?: string;
  fundingAgency?: string;
  budget?: number;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  profileId?: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
}

/* ── Research Assets ── */

export interface Dataset {
  id: string;
  title: string;
  description: string;
  status: string;
  format?: string;
  size?: number;
  license?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  description?: string;
  language?: string;
  createdAt: string;
}

/* ── Academic Recognition ── */

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
  description?: string;
  createdAt: string;
}

export interface Grant {
  id: string;
  title: string;
  funder: string;
  amount?: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  status: string;
  createdAt: string;
}

export interface Patent {
  id: string;
  title: string;
  patentNumber?: string;
  status: string;
  filingDate: string;
  createdAt: string;
}

export interface ProfessionalActivity {
  id: string;
  title: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

/* ── Pagination ── */

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
