'use client';

/**
 * RIOS — Domain Query Hooks
 *
 * TanStack Query hooks over the domain services. Every data-backed page uses
 * these so caching, retries, and list normalization are consistent. Query keys
 * are centralized in `queryKeys` for predictable invalidation.
 *
 * These hooks return the raw useQuery result plus a normalized `items`/`total`
 * for list endpoints (the backend may return arrays or paginated objects).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  publicationsService,
  projectsService,
  assetsService,
  recognitionService,
  intelligenceService,
  discoveryService,
  aiService,
  profileService,
  normalizeList,
  extractTotal,
  type ListParams,
  type ListPayload,
  type Publication,
  type ResearchProject,
  type Dataset,
  type Repository,
  type Award,
  type Grant,
  type Patent,
  type ProfessionalActivity,
  type TimelineEvent,
  type Collaboration,
  type AnalyticsOverview,
  type ImpactOverview,
} from '@/lib/services';
import { useAuth } from '@/providers/auth-provider';

/** Centralized query keys for cache management. */
export const queryKeys = {
  profile: (userId?: string) => ['profile', userId] as const,
  publications: (params?: ListParams) => ['publications', params ?? {}] as const,
  publication: (id: string) => ['publication', id] as const,
  publicationStats: () => ['publication-stats'] as const,
  projects: (profileId?: string) => ['projects', profileId] as const,
  project: (id: string) => ['project', id] as const,
  datasets: (params?: ListParams) => ['datasets', params ?? {}] as const,
  repositories: (params?: ListParams) => ['repositories', params ?? {}] as const,
  awards: (params?: ListParams) => ['awards', params ?? {}] as const,
  grants: (params?: ListParams) => ['grants', params ?? {}] as const,
  patents: (params?: ListParams) => ['patents', params ?? {}] as const,
  activities: (params?: ListParams) => ['activities', params ?? {}] as const,
  analytics: () => ['analytics'] as const,
  impact: () => ['impact'] as const,
  timeline: (params?: ListParams) => ['timeline', params ?? {}] as const,
  collaborations: (params?: ListParams) => ['collaborations', params ?? {}] as const,
  search: (kind: string, query: string) => ['search', kind, query] as const,
  recommendations: () => ['ai-recommendations'] as const,
  knowledgeGraph: () => ['knowledge-graph'] as const,
  publicProfile: (slug: string) => ['public-profile', slug] as const,
};

/** Helper: adapt a list query into { items, total, ...query }. */
function useListQuery<T>(key: readonly unknown[], fetcher: () => Promise<unknown>) {
  const query = useQuery({ queryKey: key, queryFn: fetcher });
  return {
    ...query,
    items: normalizeList<T>(query.data as ListPayload<T>),
    total: extractTotal(query.data as ListPayload<unknown>),
  };
}

/* ── Profile ── */
export function useMyProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.profile(user?.id),
    queryFn: () => profileService.byUserId(user!.id),
    enabled: Boolean(user?.id),
    retry: false, // a missing profile (404) is an expected "not yet created" state
  });
}

/* ── Publications ── */
export function usePublications(params?: ListParams) {
  return useListQuery<Publication>(queryKeys.publications(params), () =>
    publicationsService.list(params),
  );
}
export function usePublication(id: string) {
  return useQuery({
    queryKey: queryKeys.publication(id),
    queryFn: () => publicationsService.byId(id),
    enabled: Boolean(id),
  });
}
export function usePublicationStats() {
  return useQuery({
    queryKey: queryKeys.publicationStats(),
    queryFn: () => publicationsService.stats(),
  });
}

/* ── Projects ── */
export function useProjects(profileId?: string) {
  return useListQuery<ResearchProject>(queryKeys.projects(profileId), () =>
    profileId ? projectsService.byProfile(profileId) : Promise.resolve([]),
  );
}
export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => projectsService.byId(id),
    enabled: Boolean(id),
  });
}

/* ── Assets ── */
export function useDatasets(params?: ListParams) {
  return useListQuery<Dataset>(queryKeys.datasets(params), () => assetsService.datasets(params));
}
export function useRepositories(params?: ListParams) {
  return useListQuery<Repository>(queryKeys.repositories(params), () =>
    assetsService.repositories(params),
  );
}

/* ── Recognition ── */
export function useAwards(params?: ListParams) {
  return useListQuery<Award>(queryKeys.awards(params), () => recognitionService.awards(params));
}
export function useGrants(params?: ListParams) {
  return useListQuery<Grant>(queryKeys.grants(params), () => recognitionService.grants(params));
}
export function usePatents(params?: ListParams) {
  return useListQuery<Patent>(queryKeys.patents(params), () => recognitionService.patents(params));
}
export function useActivities(params?: ListParams) {
  return useListQuery<ProfessionalActivity>(queryKeys.activities(params), () =>
    recognitionService.activities(params),
  );
}

/* ── Intelligence ── */
export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics(),
    queryFn: async (): Promise<AnalyticsOverview> => {
      const res = await intelligenceService.analytics();
      return res;
    },
  });
}
export function useResearchImpact() {
  return useQuery({
    queryKey: queryKeys.impact(),
    queryFn: async (): Promise<ImpactOverview> => {
      const res = await intelligenceService.impact();
      return res;
    },
  });
}
export function useTimeline(params?: ListParams) {
  return useListQuery<TimelineEvent>(queryKeys.timeline(params), () =>
    intelligenceService.timeline(params),
  );
}
export function useCollaborations(params?: ListParams) {
  return useListQuery<Collaboration>(queryKeys.collaborations(params), () =>
    intelligenceService.collaborations(params),
  );
}

/* ── Discovery / Search ── */
export function useSearch(
  kind: 'all' | 'publications' | 'projects' | 'datasets' | 'researchers',
  query: string,
) {
  const fetcher = () => {
    switch (kind) {
      case 'publications':
        return discoveryService.searchPublications(query);
      case 'projects':
        return discoveryService.searchProjects(query);
      case 'datasets':
        return discoveryService.searchDatasets(query);
      case 'researchers':
        return discoveryService.searchResearchers(query);
      default:
        return discoveryService.globalSearch(query);
    }
  };
  const q = useQuery({
    queryKey: queryKeys.search(kind, query),
    queryFn: fetcher,
    enabled: query.trim().length > 0,
  });
  return { ...q, items: normalizeList(q.data as never), total: extractTotal(q.data as never) };
}

export function usePublicProfile(slug: string) {
  return useQuery({
    queryKey: queryKeys.publicProfile(slug),
    queryFn: () => discoveryService.publicProfile(slug),
    enabled: Boolean(slug),
  });
}

/* ── AI ── */
export function useRecommendations() {
  return useListQuery(queryKeys.recommendations(), () => aiService.recommendations());
}
export function useKnowledgeGraph() {
  return useQuery({
    queryKey: queryKeys.knowledgeGraph(),
    queryFn: () => aiService.knowledgeGraph(),
  });
}

/* ── Generic mutation helper with cache invalidation ── */
export function useInvalidateOnSuccess(keys: readonly unknown[][]) {
  const qc = useQueryClient();
  return () => {
    for (const key of keys) void qc.invalidateQueries({ queryKey: key });
  };
}

export { useMutation };
