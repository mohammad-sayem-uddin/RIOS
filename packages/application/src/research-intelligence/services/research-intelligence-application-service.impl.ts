/**
 * Implementation of ResearchIntelligenceApplicationService (Sprint 11)
 */

import {
  AcademicTimeline,
  Collaboration,
  CollaborationNetwork,
  CollaborationStrength,
  CollaborationStrengthType,
  IAcademicTimelineRepository,
  ICollaborationRepository,
  IResearchAnalyticsRepository,
  ResearchAnalytics,
  ResearchMetric,
  TimelineEvent,
  TimelineEventType,
  TimelineEventTypeValue,
} from '@rios/domain';
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

import type { ResearchIntelligenceApplicationService } from './research-intelligence-application-service.js';

export class ResearchIntelligenceApplicationServiceImpl implements ResearchIntelligenceApplicationService {
  constructor(
    private readonly timelineRepo: IAcademicTimelineRepository,
    private readonly collaborationRepo: ICollaborationRepository,
    private readonly analyticsRepo: IResearchAnalyticsRepository,
  ) {}

  public async createTimelineEvent(
    dto: CreateTimelineEventDto,
  ): Promise<Result<TimelineOutputDto>> {
    try {
      let timeline = await this.timelineRepo.findByResearchProfile(dto.profileId);
      if (!timeline) {
        const createRes = AcademicTimeline.create({ profileId: dto.profileId });
        if (createRes.isFailure) return Result.fail<TimelineOutputDto>(createRes.error);
        timeline = createRes.value;
      }

      const typeRes = TimelineEventType.create(dto.eventType as TimelineEventTypeValue);
      if (typeRes.isFailure) return Result.fail<TimelineOutputDto>(typeRes.error);

      const eventRes = TimelineEvent.create({
        eventType: typeRes.value,
        title: dto.title,
        description: dto.description,
        eventDate: new Date(dto.eventDate),
        metadataJson: dto.metadataJson,
      });

      if (eventRes.isFailure) return Result.fail<TimelineOutputDto>(eventRes.error);

      timeline.addEvent(eventRes.value);
      await this.timelineRepo.save(timeline);

      return Result.ok<TimelineOutputDto>(this.mapTimelineToDto(timeline));
    } catch (err: unknown) {
      return Result.fail<TimelineOutputDto>((err as Error).message);
    }
  }

  public async updateTimeline(dto: UpdateTimelineDto): Promise<Result<TimelineOutputDto>> {
    try {
      const timeline = await this.timelineRepo.findByResearchProfile(dto.profileId);
      if (!timeline) {
        return Result.fail<TimelineOutputDto>('Academic timeline not found');
      }

      await this.timelineRepo.save(timeline);
      return Result.ok<TimelineOutputDto>(this.mapTimelineToDto(timeline));
    } catch (err: unknown) {
      return Result.fail<TimelineOutputDto>((err as Error).message);
    }
  }

  public async createCollaboration(
    dto: CreateCollaborationDto,
  ): Promise<Result<CollaborationNetworkOutputDto>> {
    try {
      let network = await this.collaborationRepo.findByResearchProfile(dto.profileId);
      if (!network) {
        const createRes = CollaborationNetwork.create({ profileId: dto.profileId });
        if (createRes.isFailure) return Result.fail<CollaborationNetworkOutputDto>(createRes.error);
        network = createRes.value;
      }

      const strengthType = (dto.strength ?? 'weak') as CollaborationStrengthType;
      const strengthRes = CollaborationStrength.create(strengthType);
      if (strengthRes.isFailure)
        return Result.fail<CollaborationNetworkOutputDto>(strengthRes.error);

      const collabRes = Collaboration.create({
        collaboratorName: dto.collaboratorName,
        collaboratorEmail: dto.collaboratorEmail,
        collaboratorOrcid: dto.collaboratorOrcid,
        institution: dto.institution,
        strength: strengthRes.value,
        jointPublicationCount: dto.jointPublicationCount ?? 1,
        firstCollabDate:
          dto.firstCollabDate !== undefined && dto.firstCollabDate.trim() !== ''
            ? new Date(dto.firstCollabDate)
            : undefined,
        lastCollabDate:
          dto.lastCollabDate !== undefined && dto.lastCollabDate.trim() !== ''
            ? new Date(dto.lastCollabDate)
            : undefined,
      });

      if (collabRes.isFailure) return Result.fail<CollaborationNetworkOutputDto>(collabRes.error);

      const addRes = network.addCollaboration(collabRes.value);
      if (addRes.isFailure) return Result.fail<CollaborationNetworkOutputDto>(addRes.error);

      await this.collaborationRepo.save(network);
      return Result.ok<CollaborationNetworkOutputDto>(this.mapCollaborationNetworkToDto(network));
    } catch (err: unknown) {
      return Result.fail<CollaborationNetworkOutputDto>((err as Error).message);
    }
  }

  public async removeCollaboration(
    profileId: string,
    collaborationId: string,
  ): Promise<Result<void>> {
    try {
      const network = await this.collaborationRepo.findByResearchProfile(profileId);
      if (!network) {
        return Result.fail<void>('Collaboration network not found');
      }

      const removeRes = network.removeCollaboration(collaborationId);
      if (removeRes.isFailure) return Result.fail<void>(removeRes.error);

      await this.collaborationRepo.save(network);
      return Result.ok<void>(undefined);
    } catch (err: unknown) {
      return Result.fail<void>((err as Error).message);
    }
  }

  public async calculateResearchMetrics(
    dto: CalculateResearchMetricsDto,
  ): Promise<Result<ResearchAnalyticsOutputDto>> {
    try {
      let analytics = await this.analyticsRepo.findByResearchProfile(dto.profileId);
      if (!analytics) {
        const createRes = ResearchAnalytics.create({ profileId: dto.profileId });
        if (createRes.isFailure) return Result.fail<ResearchAnalyticsOutputDto>(createRes.error);
        analytics = createRes.value;
      }

      if (dto.hIndex !== undefined) {
        const metric = ResearchMetric.create({
          metricType: 'h_index',
          metricName: 'H-Index',
          value: dto.hIndex,
        }).value;
        const res = analytics.addResearchMetric(metric);
        if (res.isFailure) return Result.fail<ResearchAnalyticsOutputDto>(res.error);
      }

      if (dto.i10Index !== undefined) {
        const metric = ResearchMetric.create({
          metricType: 'i10_index',
          metricName: 'i10-Index',
          value: dto.i10Index,
        }).value;
        analytics.addResearchMetric(metric);
      }

      if (dto.citationCount !== undefined) {
        const metric = ResearchMetric.create({
          metricType: 'citation_count',
          metricName: 'Total Citations',
          value: dto.citationCount,
        }).value;
        analytics.addResearchMetric(metric);
      }

      if (dto.rgScore !== undefined) {
        const metric = ResearchMetric.create({
          metricType: 'rg_score',
          metricName: 'ResearchGate Score',
          value: dto.rgScore,
        }).value;
        analytics.addResearchMetric(metric);
      }

      if (dto.impactScore !== undefined) {
        const metric = ResearchMetric.create({
          metricType: 'impact_factor',
          metricName: 'Impact Factor',
          value: dto.impactScore,
        }).value;
        analytics.addResearchMetric(metric);
      }

      await this.analyticsRepo.save(analytics);
      return Result.ok<ResearchAnalyticsOutputDto>(this.mapResearchAnalyticsToDto(analytics));
    } catch (err: unknown) {
      return Result.fail<ResearchAnalyticsOutputDto>((err as Error).message);
    }
  }

  private resolveProfileId(profileId: string): string {
    const trimmed = profileId.trim();
    if (
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmed)
    ) {
      return trimmed;
    }
    return '00000000-0000-0000-0000-000000000000';
  }

  public async getTimeline(profileId: string): Promise<Result<TimelineOutputDto>> {
    try {
      const pid = this.resolveProfileId(profileId);
      const timeline = await this.timelineRepo.findByResearchProfile(pid);
      if (!timeline) {
        const createRes = AcademicTimeline.create({ profileId: pid });
        if (createRes.isFailure) return Result.fail<TimelineOutputDto>(createRes.error);
        return Result.ok<TimelineOutputDto>(this.mapTimelineToDto(createRes.value));
      }
      return Result.ok<TimelineOutputDto>(this.mapTimelineToDto(timeline));
    } catch (err: unknown) {
      return Result.fail<TimelineOutputDto>((err as Error).message);
    }
  }

  public async getCollaborationNetwork(
    profileId: string,
  ): Promise<Result<CollaborationNetworkOutputDto>> {
    try {
      const pid = this.resolveProfileId(profileId);
      const network = await this.collaborationRepo.findByResearchProfile(pid);
      if (!network) {
        const createRes = CollaborationNetwork.create({ profileId: pid });
        if (createRes.isFailure) return Result.fail<CollaborationNetworkOutputDto>(createRes.error);
        return Result.ok<CollaborationNetworkOutputDto>(
          this.mapCollaborationNetworkToDto(createRes.value),
        );
      }
      return Result.ok<CollaborationNetworkOutputDto>(this.mapCollaborationNetworkToDto(network));
    } catch (err: unknown) {
      return Result.fail<CollaborationNetworkOutputDto>((err as Error).message);
    }
  }

  public async getResearchAnalytics(
    profileId: string,
  ): Promise<Result<ResearchAnalyticsOutputDto>> {
    try {
      const pid = this.resolveProfileId(profileId);
      const analytics = await this.analyticsRepo.findByResearchProfile(pid);
      if (!analytics) {
        const createRes = ResearchAnalytics.create({ profileId: pid });
        if (createRes.isFailure) return Result.fail<ResearchAnalyticsOutputDto>(createRes.error);
        return Result.ok<ResearchAnalyticsOutputDto>(
          this.mapResearchAnalyticsToDto(createRes.value),
        );
      }
      return Result.ok<ResearchAnalyticsOutputDto>(this.mapResearchAnalyticsToDto(analytics));
    } catch (err: unknown) {
      return Result.fail<ResearchAnalyticsOutputDto>((err as Error).message);
    }
  }

  public async getCitationStatistics(
    profileId: string,
  ): Promise<Result<CitationStatisticsOutputDto>> {
    try {
      const analytics = await this.analyticsRepo.findByResearchProfile(profileId);
      const totalCitations = analytics ? analytics.getMetricValue('citation_count') : 0;
      const hIndex = analytics ? analytics.getMetricValue('h_index') : 0;
      const i10Index = analytics ? analytics.getMetricValue('i10_index') : 0;

      const citationHistory = analytics
        ? analytics.citationStats.map((cs) => ({
            year: cs.year,
            citationCount: cs.citationCount,
            citationsPerPaper: cs.citationsPerPaper,
          }))
        : [];

      return Result.ok<CitationStatisticsOutputDto>({
        profileId,
        totalCitations,
        hIndex,
        i10Index,
        citationHistory,
      });
    } catch (err: unknown) {
      return Result.fail<CitationStatisticsOutputDto>((err as Error).message);
    }
  }

  public async getResearchImpact(profileId: string): Promise<Result<ResearchImpactOutputDto>> {
    try {
      const analytics = await this.analyticsRepo.findByResearchProfile(profileId);
      const impactScore = analytics ? analytics.getMetricValue('impact_factor') : 0;
      const rgScore = analytics ? analytics.getMetricValue('rg_score') : 0;

      const metrics = analytics
        ? analytics.metrics.map((m) => ({
            metricType: m.metricType.value,
            metricName: m.metricName,
            value: m.value.value,
          }))
        : [];

      return Result.ok<ResearchImpactOutputDto>({
        profileId,
        impactScore,
        rgScore,
        metrics,
      });
    } catch (err: unknown) {
      return Result.fail<ResearchImpactOutputDto>((err as Error).message);
    }
  }

  private mapTimelineToDto(timeline: AcademicTimeline): TimelineOutputDto {
    return {
      id: timeline.id.value,
      profileId: timeline.profileId,
      events: timeline.events.map((e) => ({
        id: e.id.value,
        eventType: e.eventType.value,
        title: e.title,
        description: e.description,
        eventDate: e.eventDate.value.toISOString(),
        metadataJson: e.metadataJson,
      })),
      milestones: timeline.milestones.map((m) => ({
        id: m.id.value,
        milestoneType: m.milestoneType.value,
        title: m.title,
        milestoneDate: m.milestoneDate.value.toISOString(),
        description: m.description,
      })),
      institutionHistory: timeline.institutionHistory.map((ih) => ({
        id: ih.id.value,
        institutionName: ih.institutionName,
        role: ih.role,
        startDate: ih.startDate.toISOString(),
        endDate: ih.endDate?.toISOString(),
        isCurrent: ih.isCurrent,
      })),
      createdAt: timeline.createdAt.toISOString(),
      updatedAt: timeline.updatedAt.toISOString(),
    };
  }

  private mapCollaborationNetworkToDto(
    network: CollaborationNetwork,
  ): CollaborationNetworkOutputDto {
    return {
      id: network.id.value,
      profileId: network.profileId,
      collaborations: network.collaborations.map((c) => ({
        id: c.id.value,
        collaboratorName: c.collaboratorName,
        collaboratorEmail: c.collaboratorEmail,
        collaboratorOrcid: c.collaboratorOrcid,
        institution: c.institution,
        strength: c.strength.value,
        jointPublicationCount: c.jointPublicationCount,
        firstCollabDate: c.firstCollabDate?.toISOString(),
        lastCollabDate: c.lastCollabDate?.toISOString(),
      })),
      createdAt: network.createdAt.toISOString(),
      updatedAt: network.updatedAt.toISOString(),
    };
  }

  private mapResearchAnalyticsToDto(analytics: ResearchAnalytics): ResearchAnalyticsOutputDto {
    return {
      id: analytics.id.value,
      profileId: analytics.profileId,
      publicationStats: analytics.publicationStats.map((ps) => ({
        id: ps.id.value,
        year: ps.year,
        count: ps.count,
        firstAuthorCount: ps.firstAuthorCount,
        correspondingAuthorCount: ps.correspondingAuthorCount,
      })),
      citationStats: analytics.citationStats.map((cs) => ({
        id: cs.id.value,
        year: cs.year,
        citationCount: cs.citationCount,
        citationsPerPaper: cs.citationsPerPaper,
      })),
      metrics: analytics.metrics.map((m) => ({
        id: m.id.value,
        metricType: m.metricType.value,
        metricName: m.metricName,
        value: m.value.value,
        measuredAt: m.measuredAt.toISOString(),
      })),
      trends: analytics.trends.map((t) => ({
        id: t.id.value,
        topic: t.topic,
        growthRate: t.growthRate,
        publicationCount: t.publicationCount,
        period: t.period,
      })),
      createdAt: analytics.createdAt.toISOString(),
      updatedAt: analytics.updatedAt.toISOString(),
    };
  }
}
