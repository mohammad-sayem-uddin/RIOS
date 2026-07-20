/**
 * Discovery & Search Bounded Context — Application DTOs
 */

export interface PublicProfileDTO {
  id: string;
  userId: string;
  slug: string;
  title: string;
  headline?: string;
  biography?: string;
  institution?: string;
  researchAreas: string[];
  visibility: string;
  isPublished: boolean;
  featuredPortfolioId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchDocumentDTO {
  id: string;
  documentType: string;
  entityId: string;
  title: string;
  description?: string;
  keywords: string[];
  category?: string;
  institution?: string;
  authorName?: string;
  visibility: string;
  metadataJson?: string;
  createdAt: string;
}

export interface SearchResultDTO {
  document: SearchDocumentDTO;
  score: number;
  highlights: string[];
}

export interface SearchFacetDTO {
  name: string;
  field: string;
  count: number;
}

export interface SearchResponseDTO {
  results: SearchResultDTO[];
  total: number;
  facets: SearchFacetDTO[];
  page: number;
  limit: number;
}

export interface PortfolioDTO {
  id: string;
  profileId: string;
  slug: string;
  title: string;
  summary?: string;
  featuredPublicationIds: string[];
  featuredProjectIds: string[];
  featuredDatasetIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionProfileDTO {
  id: string;
  name: string;
  normalizedName: string;
  country?: string;
  departmentCount: number;
  researcherCount: number;
  websiteUrl?: string;
}

export interface KeywordClusterDTO {
  id: string;
  keyword: string;
  popularityScore: number;
  relatedKeywords: string[];
  category?: string;
}

export interface ResearchCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
}

export interface TrendingResearchDTO {
  id: string;
  entityId: string;
  documentType: string;
  title: string;
  viewCount: number;
  citationCount: number;
  trendingScore: number;
  period: string;
}
