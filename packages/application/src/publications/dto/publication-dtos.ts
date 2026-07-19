/**
 * Publications Application DTOs
 */

export interface AuthorInputDto {
  name: string;
  email?: string;
  orcid?: string;
  authorOrder: number;
  isCorresponding?: boolean;
  affiliations?: {
    institution: string;
    department?: string;
    location?: string;
  }[];
}

export interface AuthorOutputDto {
  id: string;
  name: string;
  email?: string;
  orcid?: string;
  authorOrder: number;
  isCorresponding: boolean;
  affiliations: {
    institution: string;
    department?: string;
    location?: string;
  }[];
}

export interface VenueInputDto {
  name: string;
  venueType: 'JOURNAL' | 'CONFERENCE' | 'OTHER';
  issn?: string;
  isbn?: string;
  publisherId?: string;
  url?: string;
}

export interface VenueOutputDto {
  id: string;
  name: string;
  venueType: 'JOURNAL' | 'CONFERENCE' | 'OTHER';
  issn?: string;
  isbn?: string;
  publisherId?: string;
  url?: string;
}

export interface PublisherInputDto {
  name: string;
  location?: string;
  websiteUrl?: string;
}

export interface PublisherOutputDto {
  id: string;
  name: string;
  location?: string;
  websiteUrl?: string;
}

export interface FundingInputDto {
  funderName: string;
  fundingIdentifier?: string;
  grantTitle?: string;
  amountCurrency?: string;
  amountValue?: number;
}

export interface FundingOutputDto {
  id: string;
  funderName: string;
  fundingIdentifier?: string;
  grantTitle?: string;
  amountCurrency?: string;
  amountValue?: number;
}

export interface CreatePublicationDto {
  profileId: string;
  title: string;
  type: string;
  status?: string;
  doi?: string;
  isbn?: string;
  abstract?: string;
  keywords?: string[];
  year?: number;
  url?: string;
  language?: string;
  authors?: AuthorInputDto[];
  venue?: VenueInputDto;
  publisher?: PublisherInputDto;
  fundings?: FundingInputDto[];
}

export interface UpdatePublicationDto {
  id: string;
  title?: string;
  abstract?: string;
  keywords?: string[];
  year?: number;
  url?: string;
  doi?: string;
  isbn?: string;
}

export interface PublicationOutputDto {
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
  citationCount: number;
  url?: string;
  language?: string;
  authors: AuthorOutputDto[];
  venue?: VenueOutputDto;
  publisher?: PublisherOutputDto;
  fundings: FundingOutputDto[];
  submittedDate?: string;
  acceptedDate?: string;
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMemberInputDto {
  profileId?: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectMemberOutputDto {
  id: string;
  profileId?: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
}

export interface CreateResearchProjectDto {
  profileId: string;
  title: string;
  description: string;
  status?: string;
  startDate: string;
  endDate?: string;
  grantIdentifier?: string;
  fundingAgency?: string;
  budget?: number;
  members: ProjectMemberInputDto[];
}

export interface UpdateResearchProjectDto {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  grantIdentifier?: string;
  fundingAgency?: string;
  budget?: number;
}

export interface ResearchProjectOutputDto {
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
  members: ProjectMemberOutputDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicationStatisticsDto {
  totalPublications: number;
  publishedCount: number;
  underReviewCount: number;
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  byType: Record<string, number>;
  byYear: Record<number, number>;
}
