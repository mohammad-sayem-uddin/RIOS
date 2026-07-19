/**
 * Prisma Venue Repository
 */

import { PrismaClient } from '@prisma/client';
import { IVenueRepository, Venue } from '@rios/domain';
import { UniqueId } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { PrismaVenueRecord, VenueMapper } from '../mappers/venue-mapper.js';

export class PrismaVenueRepository implements IVenueRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async findById(id: UniqueId, context?: TransactionContext): Promise<Venue | null> {
    const client = this.getClient(context);
    const raw = (await client.venue.findUnique({
      where: { id: id.value },
    })) as PrismaVenueRecord | null;

    if (raw === null) return null;
    return VenueMapper.toDomain(raw);
  }

  public async findByName(name: string, context?: TransactionContext): Promise<Venue | null> {
    const client = this.getClient(context);
    const raw = (await client.venue.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    })) as PrismaVenueRecord | null;

    if (raw === null) return null;
    return VenueMapper.toDomain(raw);
  }

  public async search(query: string, context?: TransactionContext): Promise<Venue[]> {
    const client = this.getClient(context);
    const records = (await client.venue.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: 20,
    })) as PrismaVenueRecord[];

    return records.map((r) => VenueMapper.toDomain(r));
  }

  public async save(venue: Venue, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const data = VenueMapper.toPersistence(venue);

    await client.venue.upsert({
      where: { id: venue.id.value },
      create: data,
      update: data,
    });
  }

  public async delete(id: UniqueId, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.venue.delete({
      where: { id: id.value },
    });
  }
}
