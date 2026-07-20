/**
 * Application Service Contract for Research Intelligence (Sprint 11)
 */

import { Result } from '@rios/shared';

import type {
  CalculateResearchMetricsDto,
  CitationStatisticsOutputDto,
  CollaborationNetworkOutputDto,
  CreateCollaborationDto,
  CreateTimelineEventDto,
  ResearchAnalyticsOutputDto,
  ResearchImpactOutputDto,
  TimelineOutputDto,
  UpdateTimelineDto,
} from '../dtos/research-intelligence-dtos.js';

export interface ResearchIntelligenceApplicationService {
  // Commands
  createTimelineEvent(dto: CreateTimelineEventDto): Promise<Result<TimelineOutputDto>>;
  updateTimeline(dto: UpdateTimelineDto): Promise<Result<TimelineOutputDto>>;
  createCollaboration(dto: CreateCollaborationDto): Promise<Result<CollaborationNetworkOutputDto>>;
  removeCollaboration(profileId: string, collaborationId: string): Promise<Result<void>>;
  calculateResearchMetrics(
    dto: CalculateResearchMetricsDto,
  ): Promise<Result<ResearchAnalyticsOutputDto>>;

  // Queries
  getTimeline(profileId: string): Promise<Result<TimelineOutputDto>>;
  getCollaborationNetwork(profileId: string): Promise<Result<CollaborationNetworkOutputDto>>;
  getResearchAnalytics(profileId: string): Promise<Result<ResearchAnalyticsOutputDto>>;
  getCitationStatistics(profileId: string): Promise<Result<CitationStatisticsOutputDto>>;
  getResearchImpact(profileId: string): Promise<Result<ResearchImpactOutputDto>>;
}
