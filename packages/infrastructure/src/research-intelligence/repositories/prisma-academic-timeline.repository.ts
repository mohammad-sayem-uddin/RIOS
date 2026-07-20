/**
 * Prisma Academic Timeline Repository (Sprint 11)
 */

import { PrismaClient } from '@prisma/client';
import { AcademicTimeline, IAcademicTimelineRepository } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchIntelligenceMapper } from '../mappers/research-intelligence.mapper.js';

export class PrismaAcademicTimelineRepository implements IAcademicTimelineRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(timeline: AcademicTimeline, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = timeline.id.value;

    await client.academicTimelineModel.upsert({
      where: { id },
      create: {
        id,
        profileId: timeline.profileId,
      },
      update: {
        updatedAt: timeline.updatedAt,
      },
    });

    // Sync sub-entities
    for (const event of timeline.events) {
      await client.timelineEventModel.upsert({
        where: { id: event.id.value },
        create: {
          id: event.id.value,
          timelineId: id,
          eventType: event.eventType.value,
          title: event.title,
          description: event.description,
          eventDate: event.eventDate.value,
          metadataJson: event.metadataJson,
        },
        update: {
          eventType: event.eventType.value,
          title: event.title,
          description: event.description,
          eventDate: event.eventDate.value,
          metadataJson: event.metadataJson,
        },
      });
    }

    for (const milestone of timeline.milestones) {
      await client.careerMilestoneModel.upsert({
        where: { id: milestone.id.value },
        create: {
          id: milestone.id.value,
          timelineId: id,
          milestoneType: milestone.milestoneType.value,
          title: milestone.title,
          milestoneDate: milestone.milestoneDate.value,
          description: milestone.description,
        },
        update: {
          milestoneType: milestone.milestoneType.value,
          title: milestone.title,
          milestoneDate: milestone.milestoneDate.value,
          description: milestone.description,
        },
      });
    }

    for (const inst of timeline.institutionHistory) {
      await client.institutionHistoryModel.upsert({
        where: { id: inst.id.value },
        create: {
          id: inst.id.value,
          timelineId: id,
          institutionName: inst.institutionName,
          role: inst.role,
          startDate: inst.startDate,
          endDate: inst.endDate,
          isCurrent: inst.isCurrent,
        },
        update: {
          institutionName: inst.institutionName,
          role: inst.role,
          startDate: inst.startDate,
          endDate: inst.endDate,
          isCurrent: inst.isCurrent,
        },
      });
    }

    for (const ri of timeline.researchInterestHistory) {
      await client.researchInterestHistoryModel.upsert({
        where: { id: ri.id.value },
        create: {
          id: ri.id.value,
          timelineId: id,
          topic: ri.topic,
          startedDate: ri.startedDate,
          endedDate: ri.endedDate,
          isActive: ri.isActive,
        },
        update: {
          topic: ri.topic,
          startedDate: ri.startedDate,
          endedDate: ri.endedDate,
          isActive: ri.isActive,
        },
      });
    }
  }

  public async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<AcademicTimeline | null> {
    const client = this.getClient(context);
    const raw = await client.academicTimelineModel.findUnique({
      where: { id },
      include: {
        events: true,
        milestones: true,
        institutionHistories: true,
        researchInterestHistories: true,
      },
    });

    if (!raw) return null;
    return ResearchIntelligenceMapper.toTimelineDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<AcademicTimeline | null> {
    const client = this.getClient(context);
    const raw = await client.academicTimelineModel.findFirst({
      where: { profileId },
      include: {
        events: true,
        milestones: true,
        institutionHistories: true,
        researchInterestHistories: true,
      },
    });

    if (!raw) return null;
    return ResearchIntelligenceMapper.toTimelineDomain(raw);
  }

  public async search(query: string, context?: TransactionContext): Promise<AcademicTimeline[]> {
    const client = this.getClient(context);
    const list = await client.academicTimelineModel.findMany({
      where: {
        events: {
          some: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      },
      include: {
        events: true,
        milestones: true,
        institutionHistories: true,
        researchInterestHistories: true,
      },
    });

    return list.map((raw) => ResearchIntelligenceMapper.toTimelineDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.academicTimelineModel.delete({ where: { id } });
  }
}
