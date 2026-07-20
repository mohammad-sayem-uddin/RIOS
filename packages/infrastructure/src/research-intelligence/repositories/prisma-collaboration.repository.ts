/**
 * Prisma Collaboration Repository (Sprint 11)
 */

import { PrismaClient } from '@prisma/client';
import { CollaborationNetwork, ICollaborationRepository } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchIntelligenceMapper } from '../mappers/research-intelligence.mapper.js';

export class PrismaCollaborationRepository implements ICollaborationRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(network: CollaborationNetwork, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = network.id.value;

    await client.collaborationNetworkModel.upsert({
      where: { id },
      create: {
        id,
        profileId: network.profileId,
      },
      update: {
        updatedAt: network.updatedAt,
      },
    });

    for (const collab of network.collaborations) {
      await client.collaborationModel.upsert({
        where: { id: collab.id.value },
        create: {
          id: collab.id.value,
          networkId: id,
          collaboratorName: collab.collaboratorName,
          collaboratorEmail: collab.collaboratorEmail,
          collaboratorOrcid: collab.collaboratorOrcid,
          institution: collab.institution,
          strength: collab.strength.value,
          jointPublicationCount: collab.jointPublicationCount,
          firstCollabDate: collab.firstCollabDate,
          lastCollabDate: collab.lastCollabDate,
        },
        update: {
          collaboratorName: collab.collaboratorName,
          collaboratorEmail: collab.collaboratorEmail,
          collaboratorOrcid: collab.collaboratorOrcid,
          institution: collab.institution,
          strength: collab.strength.value,
          jointPublicationCount: collab.jointPublicationCount,
          firstCollabDate: collab.firstCollabDate,
          lastCollabDate: collab.lastCollabDate,
        },
      });

      for (const coAuthor of collab.coAuthors) {
        await client.coAuthorModel.upsert({
          where: { id: coAuthor.id.value },
          create: {
            id: coAuthor.id.value,
            collaborationId: collab.id.value,
            authorName: coAuthor.authorName,
            email: coAuthor.email,
            orcid: coAuthor.orcid,
            affiliation: coAuthor.affiliation,
            paperCount: coAuthor.paperCount,
          },
          update: {
            authorName: coAuthor.authorName,
            email: coAuthor.email,
            orcid: coAuthor.orcid,
            affiliation: coAuthor.affiliation,
            paperCount: coAuthor.paperCount,
          },
        });
      }
    }
  }

  public async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<CollaborationNetwork | null> {
    const client = this.getClient(context);
    const raw = await client.collaborationNetworkModel.findUnique({
      where: { id },
      include: {
        collaborations: {
          include: {
            coAuthors: true,
          },
        },
      },
    });

    if (!raw) return null;
    return ResearchIntelligenceMapper.toCollaborationNetworkDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<CollaborationNetwork | null> {
    const client = this.getClient(context);
    const raw = await client.collaborationNetworkModel.findFirst({
      where: { profileId },
      include: {
        collaborations: {
          include: {
            coAuthors: true,
          },
        },
      },
    });

    if (!raw) return null;
    return ResearchIntelligenceMapper.toCollaborationNetworkDomain(raw);
  }

  public async search(
    query: string,
    context?: TransactionContext,
  ): Promise<CollaborationNetwork[]> {
    const client = this.getClient(context);
    const list = await client.collaborationNetworkModel.findMany({
      where: {
        collaborations: {
          some: {
            OR: [
              { collaboratorName: { contains: query, mode: 'insensitive' } },
              { institution: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      },
      include: {
        collaborations: {
          include: {
            coAuthors: true,
          },
        },
      },
    });

    return list.map((raw) => ResearchIntelligenceMapper.toCollaborationNetworkDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.collaborationNetworkModel.delete({ where: { id } });
  }
}
