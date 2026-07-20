/**
 * Mappers for Research Intelligence Prisma Models <-> Domain Aggregates (Sprint 11)
 */

import {
  AcademicTimelineModel as PrismaAcademicTimeline,
  CareerMilestoneModel as PrismaCareerMilestone,
  CitationStatisticModel as PrismaCitationStatistic,
  CoAuthorModel as PrismaCoAuthor,
  CollaborationModel as PrismaCollaboration,
  CollaborationNetworkModel as PrismaCollaborationNetwork,
  InstitutionHistoryModel as PrismaInstitutionHistory,
  PublicationStatisticModel as PrismaPublicationStatistic,
  ResearchAnalyticsModel as PrismaResearchAnalytics,
  ResearchInterestHistoryModel as PrismaResearchInterestHistory,
  ResearchMetricModel as PrismaResearchMetric,
  ResearchTrendModel as PrismaResearchTrend,
  TimelineEventModel as PrismaTimelineEvent,
} from '@prisma/client';
import {
  AcademicTimeline,
  CareerMilestone,
  CareerMilestoneType,
  CareerMilestoneTypeValue,
  CitationStatistic,
  CoAuthor,
  Collaboration,
  CollaborationNetwork,
  CollaborationStrength,
  CollaborationStrengthType,
  InstitutionHistory,
  PublicationStatistic,
  ResearchAnalytics,
  ResearchInterestHistory,
  ResearchMetric,
  ResearchTrend,
  TimelineEvent,
  TimelineEventType,
  TimelineEventTypeValue,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

export type AcademicTimelineWithRelations = PrismaAcademicTimeline & {
  events: PrismaTimelineEvent[];
  milestones: PrismaCareerMilestone[];
  institutionHistories: PrismaInstitutionHistory[];
  researchInterestHistories: PrismaResearchInterestHistory[];
};

export type CollaborationNetworkWithRelations = PrismaCollaborationNetwork & {
  collaborations: (PrismaCollaboration & { coAuthors: PrismaCoAuthor[] })[];
};

export type ResearchAnalyticsWithRelations = PrismaResearchAnalytics & {
  publicationStats: PrismaPublicationStatistic[];
  citationStats: PrismaCitationStatistic[];
  metrics: PrismaResearchMetric[];
  trends: PrismaResearchTrend[];
};

export class ResearchIntelligenceMapper {
  public static toTimelineDomain(raw: AcademicTimelineWithRelations): AcademicTimeline {
    const events = (raw.events ?? []).map(
      (e) =>
        TimelineEvent.create(
          {
            eventType: TimelineEventType.create(e.eventType as TimelineEventTypeValue).value,
            title: e.title,
            description: e.description ?? undefined,
            eventDate: e.eventDate,
            metadataJson: e.metadataJson ?? undefined,
          },
          UniqueId.from(e.id),
        ).value,
    );

    const milestones = (raw.milestones ?? []).map(
      (m) =>
        CareerMilestone.create(
          {
            milestoneType: CareerMilestoneType.create(m.milestoneType as CareerMilestoneTypeValue)
              .value,
            title: m.title,
            milestoneDate: m.milestoneDate,
            description: m.description ?? undefined,
          },
          UniqueId.from(m.id),
        ).value,
    );

    const institutionHistory = (raw.institutionHistories ?? []).map(
      (ih) =>
        InstitutionHistory.create(
          {
            institutionName: ih.institutionName,
            role: ih.role ?? undefined,
            startDate: ih.startDate,
            endDate: ih.endDate ?? undefined,
            isCurrent: ih.isCurrent,
          },
          UniqueId.from(ih.id),
        ).value,
    );

    const researchInterestHistory = (raw.researchInterestHistories ?? []).map(
      (ri) =>
        ResearchInterestHistory.create(
          {
            topic: ri.topic,
            startedDate: ri.startedDate,
            endedDate: ri.endedDate ?? undefined,
            isActive: ri.isActive,
          },
          UniqueId.from(ri.id),
        ).value,
    );

    return AcademicTimeline.create({
      id: raw.id,
      profileId: raw.profileId,
      events,
      milestones,
      institutionHistory,
      researchInterestHistory,
    }).value;
  }

  public static toCollaborationNetworkDomain(
    raw: CollaborationNetworkWithRelations,
  ): CollaborationNetwork {
    const collaborations = (raw.collaborations ?? []).map((c) => {
      const coAuthors = (c.coAuthors ?? []).map(
        (ca) =>
          CoAuthor.create(
            {
              authorName: ca.authorName,
              email: ca.email ?? undefined,
              orcid: ca.orcid ?? undefined,
              affiliation: ca.affiliation ?? undefined,
              paperCount: ca.paperCount,
            },
            UniqueId.from(ca.id),
          ).value,
      );

      return Collaboration.create(
        {
          collaboratorName: c.collaboratorName,
          collaboratorEmail: c.collaboratorEmail ?? undefined,
          collaboratorOrcid: c.collaboratorOrcid ?? undefined,
          institution: c.institution ?? undefined,
          strength: CollaborationStrength.create(c.strength as CollaborationStrengthType).value,
          jointPublicationCount: c.jointPublicationCount,
          firstCollabDate: c.firstCollabDate ?? undefined,
          lastCollabDate: c.lastCollabDate ?? undefined,
          coAuthors,
        },
        UniqueId.from(c.id),
      ).value;
    });

    return CollaborationNetwork.create({
      id: raw.id,
      profileId: raw.profileId,
      collaborations,
    }).value;
  }

  public static toResearchAnalyticsDomain(raw: ResearchAnalyticsWithRelations): ResearchAnalytics {
    const publicationStats = (raw.publicationStats ?? []).map(
      (ps) =>
        PublicationStatistic.create(
          {
            year: ps.year,
            count: ps.count,
            firstAuthorCount: ps.firstAuthorCount,
            correspondingAuthorCount: ps.correspondingAuthorCount,
          },
          UniqueId.from(ps.id),
        ).value,
    );

    const citationStats = (raw.citationStats ?? []).map(
      (cs) =>
        CitationStatistic.create(
          {
            year: cs.year,
            citationCount: cs.citationCount,
            citationsPerPaper: cs.citationsPerPaper,
          },
          UniqueId.from(cs.id),
        ).value,
    );

    const metrics = (raw.metrics ?? []).map(
      (m) =>
        ResearchMetric.create(
          {
            metricType: m.metricType,
            metricName: m.metricName,
            value: m.value,
            measuredAt: m.measuredAt,
          },
          UniqueId.from(m.id),
        ).value,
    );

    const trends = (raw.trends ?? []).map(
      (t) =>
        ResearchTrend.create(
          {
            topic: t.topic,
            growthRate: t.growthRate,
            publicationCount: t.publicationCount,
            period: t.period,
          },
          UniqueId.from(t.id),
        ).value,
    );

    return ResearchAnalytics.create({
      id: raw.id,
      profileId: raw.profileId,
      publicationStats,
      citationStats,
      metrics,
      trends,
    }).value;
  }
}
