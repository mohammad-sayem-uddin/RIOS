/**
 * Discovery & Search Bounded Context — Search Adapter Interface
 *
 * Pluggable Search Adapter pattern enabling Postgres, Elasticsearch,
 * OpenSearch, Meilisearch, or Algolia implementations.
 */

import {
  DocumentType,
  SearchFacet,
  SearchFilter,
  SearchQuery,
  SearchResult,
  SortOption,
} from '@rios/domain';

export interface SearchAdapterOptions {
  query: SearchQuery;
  documentType?: DocumentType;
  filters?: SearchFilter[];
  sort?: SortOption;
  limit?: number;
  offset?: number;
}

export interface SearchAdapterResponse {
  results: SearchResult[];
  total: number;
  facets: SearchFacet[];
}

export interface SearchAdapter {
  search(options: SearchAdapterOptions): Promise<SearchAdapterResponse>;
}
