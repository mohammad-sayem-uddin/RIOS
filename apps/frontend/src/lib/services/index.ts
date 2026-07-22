/**
 * RIOS — Domain Services
 *
 * Thin, typed boundaries over the verified backend endpoints. Every path here is
 * ✅ VERIFIED against packages/presentation/src/routes/*. UI code (pages, hooks)
 * must call these services rather than apiClient directly, so a contract change
 * is a one-file edit.
 *
 * Search/list endpoints return the backend's standard envelope `data`, which for
 * collections is a paginated shape. Response shapes not yet pinned down are typed
 * defensively (optional fields) and normalized by the query hooks.
 */

import { apiClient } from '@/lib/api-client';
import type {
  Publication,
  ResearchProject,
  Dataset,
  Repository,
  Award,
  Grant,
  Patent,
  ProfessionalActivity,
  ResearchProfile,
} from '@/types/api';

export type {
  Publication,
  ResearchProject,
  Dataset,
  Repository,
  Award,
  Grant,
  Patent,
  ProfessionalActivity,
  ResearchProfile,
};

/** Common list query params accepted by the search endpoints. */
export interface ListParams {
  limit?: number;
  offset?: number;
  query?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Backend search endpoints may return either a bare array or a paginated object.
 * Services return the raw payload; `normalizeList` (in query hooks) flattens it.
 */
export type ListPayload<T> = T[] | { items?: T[]; total?: number; results?: T[] };

/* ── Publications ── */
export const publicationsService = {
  list: (params?: ListParams) =>
    apiClient.get<ListPayload<Publication>>('/api/v1/publications', { params }),
  byId: (id: string) => apiClient.get<Publication>(`/api/v1/publications/${id}`),
  byProfile: (profileId: string) =>
    apiClient.get<ListPayload<Publication>>(`/api/v1/research-profiles/${profileId}/publications`),
  stats: () => apiClient.get<PublicationStats>('/api/v1/publications/stats'),
  create: (body: unknown) => apiClient.post<Publication>('/api/v1/publications', body),
  update: (id: string, body: unknown) =>
    apiClient.patch<Publication>(`/api/v1/publications/${id}`, body),
  publish: (id: string) => apiClient.post<Publication>(`/api/v1/publications/${id}/publish`),
  submit: (id: string) => apiClient.post<Publication>(`/api/v1/publications/${id}/submit`),
  remove: (id: string) => apiClient.delete<void>(`/api/v1/publications/${id}`),
};

export interface PublicationStats {
  total?: number;
  byStatus?: Record<string, number>;
  byYear?: Record<string, number>;
  byType?: Record<string, number>;
}

/* ── Research Projects ── */
export const projectsService = {
  byId: (id: string) => apiClient.get<ResearchProject>(`/api/v1/research-projects/${id}`),
  byProfile: (profileId: string) =>
    apiClient.get<ListPayload<ResearchProject>>(
      `/api/v1/research-profiles/${profileId}/research-projects`,
    ),
  create: (body: unknown) => apiClient.post<ResearchProject>('/api/v1/research-projects', body),
  update: (id: string, body: unknown) =>
    apiClient.patch<ResearchProject>(`/api/v1/research-projects/${id}`, body),
  complete: (id: string) =>
    apiClient.post<ResearchProject>(`/api/v1/research-projects/${id}/complete`),
  remove: (id: string) => apiClient.delete<void>(`/api/v1/research-projects/${id}`),
  addMember: (id: string, body: unknown) =>
    apiClient.post<ResearchProject>(`/api/v1/research-projects/${id}/members`, body),
  removeMember: (id: string, memberId: string) =>
    apiClient.delete<ResearchProject>(`/api/v1/research-projects/${id}/members/${memberId}`),
};

/* ── Research Assets ── */
export const assetsService = {
  datasets: (params?: ListParams) =>
    apiClient.get<ListPayload<Dataset>>('/api/v1/datasets', { params }),
  datasetById: (id: string) => apiClient.get<Dataset>(`/api/v1/datasets/${id}`),
  publishDataset: (id: string) => apiClient.post<Dataset>(`/api/v1/datasets/${id}/publish`),
  createDataset: (body: unknown) => apiClient.post<Dataset>('/api/v1/datasets', body),
  removeDataset: (id: string) => apiClient.delete<void>(`/api/v1/datasets/${id}`),
  repositories: (params?: ListParams) =>
    apiClient.get<ListPayload<Repository>>('/api/v1/repositories', { params }),
  repositoryById: (id: string) => apiClient.get<Repository>(`/api/v1/repositories/${id}`),
  createRepository: (body: unknown) => apiClient.post<Repository>('/api/v1/repositories', body),
  assets: (params?: ListParams) =>
    apiClient.get<ListPayload<unknown>>('/api/v1/research-assets', { params }),
};

/* ── Academic Recognition ── */
export const recognitionService = {
  awards: (params?: ListParams) => apiClient.get<ListPayload<Award>>('/api/v1/awards', { params }),
  awardById: (id: string) => apiClient.get<Award>(`/api/v1/awards/${id}`),
  createAward: (body: unknown) => apiClient.post<Award>('/api/v1/awards', body),
  removeAward: (id: string) => apiClient.delete<void>(`/api/v1/awards/${id}`),

  grants: (params?: ListParams) => apiClient.get<ListPayload<Grant>>('/api/v1/grants', { params }),
  grantById: (id: string) => apiClient.get<Grant>(`/api/v1/grants/${id}`),
  createGrant: (body: unknown) => apiClient.post<Grant>('/api/v1/grants', body),
  completeGrant: (id: string) => apiClient.post<Grant>(`/api/v1/grants/${id}/complete`),
  removeGrant: (id: string) => apiClient.delete<void>(`/api/v1/grants/${id}`),

  patents: (params?: ListParams) =>
    apiClient.get<ListPayload<Patent>>('/api/v1/patents', { params }),
  patentById: (id: string) => apiClient.get<Patent>(`/api/v1/patents/${id}`),
  createPatent: (body: unknown) => apiClient.post<Patent>('/api/v1/patents', body),
  removePatent: (id: string) => apiClient.delete<void>(`/api/v1/patents/${id}`),

  activities: (params?: ListParams) =>
    apiClient.get<ListPayload<ProfessionalActivity>>('/api/v1/professional-activities', {
      params,
    }),
  activityById: (id: string) =>
    apiClient.get<ProfessionalActivity>(`/api/v1/professional-activities/${id}`),
  createActivity: (body: unknown) =>
    apiClient.post<ProfessionalActivity>('/api/v1/professional-activities', body),
  removeActivity: (id: string) => apiClient.delete<void>(`/api/v1/professional-activities/${id}`),
};

/* ── Research Intelligence ── */
export interface AnalyticsData {
  hIndex?: number;
  totalCitations?: number;
  i10Index?: number;
  publicationCount?: number;
  [key: string]: unknown;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  eventType?: string;
  date: string;
}

export interface Collaboration {
  id: string;
  name?: string;
  collaboratorName?: string;
  institution?: string;
  collaborationCount?: number;
  jointPublicationCount?: number;
  lastCollaboratedAt?: string;
}

export interface AnalyticsOverview {
  hIndex?: number;
  totalCitations?: number;
  i10Index?: number;
  publicationCount?: number;
  [key: string]: unknown;
}

export interface ImpactOverview {
  impactScore?: number;
  rgScore?: number;
  [key: string]: unknown;
}

export const intelligenceService = {
  analytics: async (params?: ListParams): Promise<AnalyticsOverview> => {
    const raw = await apiClient.get<Record<string, unknown>>('/api/v1/analytics', { params });
    if (!raw) return {};
    const metrics = Array.isArray(raw['metrics'])
      ? (raw['metrics'] as Array<{ metricType?: string; value?: number }>)
      : [];
    const getVal = (type: string) => metrics.find((m) => m.metricType === type)?.value;
    return {
      hIndex: (raw['hIndex'] as number) ?? getVal('h_index') ?? 0,
      totalCitations: (raw['totalCitations'] as number) ?? getVal('citation_count') ?? 0,
      i10Index: (raw['i10Index'] as number) ?? getVal('i10_index') ?? 0,
      publicationCount: (raw['publicationCount'] as number) ?? getVal('publication_count') ?? 0,
      ...raw,
    };
  },
  impact: async (params?: ListParams): Promise<ImpactOverview> => {
    const raw = await apiClient.get<Record<string, unknown>>('/api/v1/analytics/impact', {
      params,
    });
    if (!raw) return {};
    return {
      impactScore: (raw['impactScore'] as number) ?? 0,
      rgScore: (raw['rgScore'] as number) ?? 0,
      ...raw,
    };
  },
  citations: (params?: ListParams) =>
    apiClient.get<ListPayload<unknown>>('/api/v1/citations', { params }),
  timeline: (params?: ListParams) =>
    apiClient.get<ListPayload<TimelineEvent>>('/api/v1/timeline', { params }),
  collaborations: (params?: ListParams) =>
    apiClient.get<ListPayload<Collaboration>>('/api/v1/collaborations', { params }),
};

/* ── Research Discovery / Search ── */
export interface SearchResultItem {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  [key: string]: unknown;
}

export interface PublicProfile {
  slug: string;
  displayName?: string;
  title?: string;
  headline?: string;
  biography?: string;
  [key: string]: unknown;
}

export const discoveryService = {
  globalSearch: (query: string, params?: ListParams) =>
    apiClient.get<ListPayload<SearchResultItem>>('/api/v1/search', {
      params: { ...params, query },
    }),
  searchPublications: (query: string, params?: ListParams) =>
    apiClient.get<ListPayload<SearchResultItem>>('/api/v1/search/publications', {
      params: { ...params, query },
    }),
  searchProjects: (query: string, params?: ListParams) =>
    apiClient.get<ListPayload<SearchResultItem>>('/api/v1/search/projects', {
      params: { ...params, query },
    }),
  searchDatasets: (query: string, params?: ListParams) =>
    apiClient.get<ListPayload<SearchResultItem>>('/api/v1/search/datasets', {
      params: { ...params, query },
    }),
  searchResearchers: (query: string, params?: ListParams) =>
    apiClient.get<ListPayload<SearchResultItem>>('/api/v1/search/researchers', {
      params: { ...params, query },
    }),
  publicProfile: (slug: string) => apiClient.get<PublicProfile>(`/api/v1/profiles/${slug}`),
  portfolio: (slug: string) => apiClient.get<unknown>(`/api/v1/portfolio/${slug}`),
  institutions: (params?: ListParams) =>
    apiClient.get<ListPayload<SearchResultItem>>('/api/v1/institutions', { params }),
};

/* ── AI Intelligence ── */
export interface Recommendation {
  id: string;
  title?: string;
  description?: string;
  score?: number;
  type?: string;
  [key: string]: unknown;
}

export const aiService = {
  recommendations: (params?: ListParams) =>
    apiClient.get<ListPayload<Recommendation>>('/api/v1/ai/recommendations', { params }),
  generateRecommendations: (body?: unknown) =>
    apiClient.post<unknown>('/api/v1/ai/recommendations', body ?? {}),
  similarResearchers: (params?: ListParams) =>
    apiClient.get<ListPayload<SearchResultItem>>('/api/v1/ai/similar-researchers', { params }),
  researchTrends: (params?: ListParams) =>
    apiClient.get<ListPayload<unknown>>('/api/v1/ai/research-trends', { params }),
  researchGaps: (params?: ListParams) =>
    apiClient.get<ListPayload<unknown>>('/api/v1/ai/research-gaps', { params }),
  knowledgeGraph: (params?: ListParams) =>
    apiClient.get<KnowledgeGraph>('/api/v1/knowledge-graph', { params }),
};

export interface KnowledgeGraphNode {
  id: string;
  label?: string;
  type?: string;
}
export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  label?: string;
}
export interface KnowledgeGraph {
  nodes?: KnowledgeGraphNode[];
  edges?: KnowledgeGraphEdge[];
}

/* ── Research Profile (re-exported for convenience) ── */
export const profileService = {
  byUserId: (userId: string) =>
    apiClient.get<ResearchProfile>(`/api/v1/users/${userId}/research-profile`),
  byId: (id: string) => apiClient.get<ResearchProfile>(`/api/v1/research-profiles/${id}`),
};

/** Flatten any backend list payload into a plain array. */
export function normalizeList<T>(payload: ListPayload<T> | undefined | null): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj['items'])) return obj['items'] as T[];
  if (Array.isArray(obj['results'])) return obj['results'] as T[];
  if (Array.isArray(obj['events'])) return obj['events'] as T[];
  if (Array.isArray(obj['collaborations'])) return obj['collaborations'] as T[];
  if (Array.isArray(obj['recommendations'])) return obj['recommendations'] as T[];
  return [];
}

/** Extract a total count from a list payload (falls back to array length). */
export function extractTotal<T>(payload: ListPayload<T> | undefined | null): number {
  if (!payload) return 0;
  if (Array.isArray(payload)) return payload.length;
  const obj = payload as Record<string, unknown>;
  if (typeof obj['total'] === 'number') return obj['total'];
  const list = normalizeList<T>(payload);
  return list.length;
}
