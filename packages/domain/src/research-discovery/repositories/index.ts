/**
 * Discovery & Search Bounded Context — Repository Interfaces
 */

import { DiscoveryCatalog, PublicResearchProfile, SearchIndex } from '../aggregates/index.js';
import {
  DocumentType,
  InstitutionProfile,
  ResearchPortfolio,
  SearchFacet,
  SearchResult,
} from '../entities/index.js';
import { SearchFilter, SearchQuery, SortOption } from '../value-objects/index.js';

export interface SearchOptions {
  query: SearchQuery;
  documentType?: DocumentType;
  filters?: SearchFilter[];
  sort?: SortOption;
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  facets: SearchFacet[];
}

export interface PublicProfileRepository {
  save(profile: PublicResearchProfile): Promise<void>;
  findById(id: string): Promise<PublicResearchProfile | null>;
  findBySlug(slug: string): Promise<PublicResearchProfile | null>;
  findByUserId(userId: string): Promise<PublicResearchProfile | null>;
  delete(id: string): Promise<void>;
}

export interface SearchRepository {
  save(index: SearchIndex): Promise<void>;
  findById(id: string): Promise<SearchIndex | null>;
  findByName(name: string): Promise<SearchIndex | null>;
  search(options: SearchOptions): Promise<SearchResponse>;
  searchResearchers(options: SearchOptions): Promise<SearchResponse>;
  searchPublications(options: SearchOptions): Promise<SearchResponse>;
  searchProjects(options: SearchOptions): Promise<SearchResponse>;
  searchDatasets(options: SearchOptions): Promise<SearchResponse>;
  delete(id: string): Promise<void>;
}

export interface DiscoveryRepository {
  saveCatalog(catalog: DiscoveryCatalog): Promise<void>;
  getCatalog(id?: string): Promise<DiscoveryCatalog | null>;
  searchInstitutions(query: string, limit?: number, offset?: number): Promise<InstitutionProfile[]>;
  savePortfolio(portfolio: ResearchPortfolio): Promise<void>;
  getPortfolioBySlug(slug: string): Promise<ResearchPortfolio | null>;
  getPortfolioById(id: string): Promise<ResearchPortfolio | null>;
  deletePortfolio(id: string): Promise<void>;
}
