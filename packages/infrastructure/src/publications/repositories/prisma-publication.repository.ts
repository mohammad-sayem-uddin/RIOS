/**
 * Prisma Publication Repository
 */

import { PrismaClient } from '@prisma/client';
import {
  DOI,
  IPublicationRepository,
  Publication,
  PublicationId,
  PublicationSearchFilters,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { PrismaPublicationFull, PublicationMapper } from '../mappers/publication-mapper.js';

export class PrismaPublicationRepository implements IPublicationRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  private get defaultInclude(): Record<string, unknown> {
    return {
      venue: true,
      publisher: true,
      authors: {
        include: {
          affiliations: true,
        },
        orderBy: { authorOrder: 'asc' as const },
      },
      fundings: true,
    };
  }

  public async findById(
    id: PublicationId,
    context?: TransactionContext,
  ): Promise<Publication | null> {
    const client = this.getClient(context);
    const raw = (await client.publication.findUnique({
      where: { id: id.value },
      include: this.defaultInclude,
    })) as PrismaPublicationFull | null;

    if (raw === null) return null;
    return PublicationMapper.toDomain(raw);
  }

  public async findByDOI(doi: DOI, context?: TransactionContext): Promise<Publication | null> {
    const client = this.getClient(context);
    const raw = (await client.publication.findUnique({
      where: { doi: doi.value },
      include: this.defaultInclude,
    })) as PrismaPublicationFull | null;

    if (raw === null) return null;
    return PublicationMapper.toDomain(raw);
  }

  public async findByAuthor(
    authorIdOrName: string,
    context?: TransactionContext,
  ): Promise<Publication[]> {
    const client = this.getClient(context);
    const records = (await client.publication.findMany({
      where: {
        authors: {
          some: {
            OR: [
              { id: authorIdOrName },
              { name: { contains: authorIdOrName, mode: 'insensitive' } },
            ],
          },
        },
      },
      include: this.defaultInclude,
    })) as PrismaPublicationFull[];

    return records.map((r) => PublicationMapper.toDomain(r));
  }

  public async findByResearchProfile(
    profileId: UniqueId,
    context?: TransactionContext,
  ): Promise<Publication[]> {
    const client = this.getClient(context);
    const records = (await client.publication.findMany({
      where: { profileId: profileId.value },
      include: this.defaultInclude,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    })) as PrismaPublicationFull[];

    return records.map((r) => PublicationMapper.toDomain(r));
  }

  public async search(
    query: string,
    filters?: PublicationSearchFilters,
    context?: TransactionContext,
  ): Promise<Publication[]> {
    const client = this.getClient(context);
    const whereCondition: Record<string, unknown> = {};

    if (typeof query === 'string' && query.length > 0) {
      whereCondition['OR'] = [
        { title: { contains: query, mode: 'insensitive' } },
        { abstract: { contains: query, mode: 'insensitive' } },
        { doi: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (filters?.type !== undefined) whereCondition['type'] = filters.type;
    if (filters?.status !== undefined) whereCondition['status'] = filters.status;
    if (filters?.year !== undefined) whereCondition['year'] = filters.year;

    const records = (await client.publication.findMany({
      where: whereCondition,
      include: this.defaultInclude,
      take: 50,
    })) as PrismaPublicationFull[];

    return records.map((r) => PublicationMapper.toDomain(r));
  }

  public async save(publication: Publication, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const data = PublicationMapper.toPersistence(publication);

    await client.$transaction(async (tx) => {
      await tx.publication.upsert({
        where: { id: publication.id.value },
        create: data,
        update: data,
      });

      await tx.author.deleteMany({ where: { publicationId: publication.id.value } });
      for (const author of publication.authors) {
        const authorRecord = await tx.author.create({
          data: {
            id: author.id.value,
            publicationId: publication.id.value,
            name: author.name,
            email: author.email ?? null,
            orcid: author.orcid?.value ?? null,
            authorOrder: author.authorOrder,
            isCorresponding: author.isCorresponding,
          },
        });

        for (const aff of author.affiliations) {
          await tx.affiliationSnapshot.create({
            data: {
              id: aff.id.value,
              authorId: authorRecord.id,
              institution: aff.institution,
              department: aff.department ?? null,
              location: aff.location ?? null,
            },
          });
        }
      }

      await tx.funding.deleteMany({ where: { publicationId: publication.id.value } });
      for (const f of publication.fundings) {
        await tx.funding.create({
          data: {
            id: f.id.value,
            publicationId: publication.id.value,
            funderName: f.funderName,
            fundingIdentifier: f.fundingIdentifier?.value ?? null,
            grantTitle: f.grantTitle ?? null,
            amountCurrency: f.amountCurrency ?? null,
            amountValue: f.amountValue ?? null,
          },
        });
      }
    });
  }

  public async delete(id: PublicationId, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.publication.delete({
      where: { id: id.value },
    });
  }
}
