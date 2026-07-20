/**
 * Prisma Implementation of PublicProfileRepository
 */

import { PrismaClient } from '@prisma/client';
import { PublicProfileRepository, PublicResearchProfile } from '@rios/domain';

import { PublicProfileMapper } from '../mappers/public-profile.mapper.js';

export class PrismaPublicProfileRepository implements PublicProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(profile: PublicResearchProfile): Promise<void> {
    const raw = PublicProfileMapper.toPersistence(profile);

    await this.prisma.publicResearchProfileModel.upsert({
      where: { id: raw.id },
      create: raw,
      update: raw,
    });
  }

  public async findById(id: string): Promise<PublicResearchProfile | null> {
    const model = await this.prisma.publicResearchProfileModel.findUnique({
      where: { id },
    });

    return model ? PublicProfileMapper.toDomain(model) : null;
  }

  public async findBySlug(slug: string): Promise<PublicResearchProfile | null> {
    const model = await this.prisma.publicResearchProfileModel.findUnique({
      where: { slug },
    });

    return model ? PublicProfileMapper.toDomain(model) : null;
  }

  public async findByUserId(userId: string): Promise<PublicResearchProfile | null> {
    const model = await this.prisma.publicResearchProfileModel.findFirst({
      where: { userId },
    });

    return model ? PublicProfileMapper.toDomain(model) : null;
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.publicResearchProfileModel.delete({
      where: { id },
    });
  }
}
