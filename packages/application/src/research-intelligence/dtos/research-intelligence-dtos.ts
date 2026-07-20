/**
 * DTOs for Research Intelligence (Sprint 11)
 */

export interface CreateTimelineEventDto {
  profileId: string;
  eventType: string;
  title: string;
  description?: string;
  eventDate: string;
  metadataJson?: string;
}

export interface UpdateTimelineDto {
  timelineId: string;
  profileId: string;
  title?: string;
  description?: string;
}

export interface CreateCollaborationDto {
  profileId: string;
  collaboratorName: string;
  collaboratorEmail?: string;
  collaboratorOrcid?: string;
  institution?: string;
  strength?: string;
  jointPublicationCount?: number;
  firstCollabDate?: string;
  lastCollabDate?: string;
}

export interface CalculateResearchMetricsDto {
  profileId: string;
  hIndex?: number;
  i10Index?: number;
  citationCount?: number;
  publicationCount?: number;
  rgScore?: number;
  impactScore?: number;
}

export interface TimelineOutputDto {
  id: string;
  profileId: string;
  events: Array<{
    id: string;
    eventType: string;
    title: string;
    description?: string;
    eventDate: string;
    metadataJson?: string;
  }>;
  milestones: Array<{
    id: string;
    milestoneType: string;
    title: string;
    milestoneDate: string;
    description?: string;
  }>;
  institutionHistory: Array<{
    id: string;
    institutionName: string;
    role?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationNetworkOutputDto {
  id: string;
  profileId: string;
  collaborations: Array<{
    id: string;
    collaboratorName: string;
    collaboratorEmail?: string;
    collaboratorOrcid?: string;
    institution?: string;
    strength: string;
    jointPublicationCount: number;
    firstCollabDate?: string;
    lastCollabDate?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchAnalyticsOutputDto {
  id: string;
  profileId: string;
  publicationStats: Array<{
    id: string;
    year: number;
    count: number;
    firstAuthorCount: number;
    correspondingAuthorCount: number;
  }>;
  citationStats: Array<{
    id: string;
    year: number;
    citationCount: number;
    citationsPerPaper: number;
  }>;
  metrics: Array<{
    id: string;
    metricType: string;
    metricName: string;
    value: number;
    measuredAt: string;
  }>;
  trends: Array<{
    id: string;
    topic: string;
    growthRate: number;
    publicationCount: number;
    period: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CitationStatisticsOutputDto {
  profileId: string;
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  citationHistory: Array<{
    year: number;
    citationCount: number;
    citationsPerPaper: number;
  }>;
}

export interface ResearchImpactOutputDto {
  profileId: string;
  impactScore: number;
  rgScore: number;
  metrics: Array<{
    metricType: string;
    metricName: string;
    value: number;
  }>;
}
