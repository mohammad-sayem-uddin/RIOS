/**
 * Prisma Implementation of SearchRepository
 */

import { PrismaClient } from '@prisma/client';
import { SearchIndex, SearchOptions, SearchRepository, SearchResponse } from '@rios/domain';

import { PrismaSearchAdapter } from '../adapters/prisma-search-adapter.js';
import { SearchAdapter } from '../adapters/search-adapter.interface.js';
import { SearchIndexMapper } from '../mappers/search-index.mapper.js';

export class PrismaSearchRepository implements SearchRepository {
  private readonly adapter: SearchAdapter;

  constructor(
    private readonly prisma: PrismaClient,
    searchAdapter?: SearchAdapter,
  ) {
    this.adapter = searchAdapter ?? new PrismaSearchAdapter(prisma);
  }

  public async save(index: SearchIndex): Promise<void> {
    const rawIndex = SearchIndexMapper.toPersistence(index);

    await this.prisma.searchIndexModel.upsert({
      where: { id: rawIndex.id },
      create: rawIndex,
      update: rawIndex,
    });

    for (const doc of index.documents) {
      const rawDoc = SearchIndexMapper.documentToPersistence(doc, index.indexId.value);
      await this.prisma.searchDocumentModel.upsert({
        where: { id: rawDoc.id },
        create: rawDoc,
        update: rawDoc,
      });
    }
  }

  public async findById(id: string): Promise<SearchIndex | null> {
    const model = await this.prisma.searchIndexModel.findUnique({
      where: { id },
      include: { documents: true },
    });

    return model ? SearchIndexMapper.toDomain(model) : null;
  }

  public async findByName(name: string): Promise<SearchIndex | null> {
    const model = await this.prisma.searchIndexModel.findUnique({
      where: { name },
      include: { documents: true },
    });

    return model ? SearchIndexMapper.toDomain(model) : null;
  }

  public async search(options: SearchOptions): Promise<SearchResponse> {
    return this.adapter.search(options);
  }

  public async searchResearchers(options: SearchOptions): Promise<SearchResponse> {
    return this.adapter.search({ ...options, documentType: 'RESEARCHER' });
  }

  public async searchPublications(options: SearchOptions): Promise<SearchResponse> {
    return this.adapter.search({ ...options, documentType: 'PUBLICATION' });
  }

  public async searchProjects(options: SearchOptions): Promise<SearchResponse> {
    return this.adapter.search({ ...options, documentType: 'PROJECT' });
  }

  public async searchDatasets(options: SearchOptions): Promise<SearchResponse> {
    return this.adapter.search({ ...options, documentType: 'DATASET' });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.searchIndexModel.delete({
      where: { id },
    });
  }
}
