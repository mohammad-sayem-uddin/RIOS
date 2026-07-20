/**
 * Prisma Implementation of SearchAdapter
 */

import { PrismaClient } from '@prisma/client';
import {
  DocumentType,
  RankingScore,
  SearchDocument,
  SearchFacet,
  SearchResult,
  VisibilityLevel,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

import {
  SearchAdapter,
  SearchAdapterOptions,
  SearchAdapterResponse,
} from './search-adapter.interface.js';

export class PrismaSearchAdapter implements SearchAdapter {
  constructor(private readonly prisma: PrismaClient) {}

  public async search(options: SearchAdapterOptions): Promise<SearchAdapterResponse> {
    const { query, documentType, filters, sort, limit = 20, offset = 0 } = options;

    const whereClause: Record<string, unknown> = {
      visibility: 'PUBLIC',
    };

    if (documentType) {
      whereClause['documentType'] = documentType;
    }

    if (!query.isEmpty()) {
      whereClause['OR'] = [
        { title: { contains: query.value, mode: 'insensitive' } },
        { description: { contains: query.value, mode: 'insensitive' } },
        { keywords: { contains: query.value, mode: 'insensitive' } },
        { authorName: { contains: query.value, mode: 'insensitive' } },
        { institution: { contains: query.value, mode: 'insensitive' } },
      ];
    }

    if (filters !== undefined && filters.length > 0) {
      for (const filter of filters) {
        if (filter.key === 'category') {
          whereClause['category'] = { contains: filter.value, mode: 'insensitive' };
        } else if (filter.key === 'institution') {
          whereClause['institution'] = { contains: filter.value, mode: 'insensitive' };
        } else if (filter.key === 'authorName') {
          whereClause['authorName'] = { contains: filter.value, mode: 'insensitive' };
        }
      }
    }

    const orderBy: Record<string, 'asc' | 'desc'>[] = [];
    if (sort) {
      orderBy.push({ [sort.field]: sort.direction.toLowerCase() as 'asc' | 'desc' });
    } else {
      orderBy.push({ createdAt: 'desc' });
    }

    const [documents, total] = await Promise.all([
      this.prisma.searchDocumentModel.findMany({
        where: whereClause,
        orderBy,
        skip: offset,
        take: limit,
      }),
      this.prisma.searchDocumentModel.count({ where: whereClause }),
    ]);

    const results: SearchResult[] = documents.map((docModel) => {
      const docRes = SearchDocument.create(
        {
          documentType: docModel.documentType as DocumentType,
          entityId: docModel.entityId,
          title: docModel.title,
          description: docModel.description ?? undefined,
          keywords:
            docModel.keywords !== null && docModel.keywords !== ''
              ? docModel.keywords.split(',')
              : [],
          category: docModel.category ?? undefined,
          institution: docModel.institution ?? undefined,
          authorName: docModel.authorName ?? undefined,
          visibility: VisibilityLevel.publicLevel(),
          metadataJson: docModel.metadataJson ?? undefined,
          createdAt: docModel.createdAt,
          updatedAt: docModel.updatedAt,
        },
        UniqueId.from(docModel.id),
      );

      const score = RankingScore.create(1.0).value;
      const highlights: string[] = [];

      if (!query.isEmpty() && docModel.title.toLowerCase().includes(query.value.toLowerCase())) {
        highlights.push(`Title match: ${docModel.title}`);
      }

      return SearchResult.create(
        {
          document: docRes.value,
          score,
          highlights,
        },
        UniqueId.from(docModel.id),
      ).value;
    });

    const categoryFacetMap = new Map<string, number>();
    documents.forEach((d) => {
      if (d.category !== null && d.category !== undefined && d.category !== '') {
        categoryFacetMap.set(d.category, (categoryFacetMap.get(d.category) ?? 0) + 1);
      }
    });

    const facets: SearchFacet[] = Array.from(categoryFacetMap.entries()).map(
      ([cat, count]) =>
        SearchFacet.create({
          name: cat,
          field: 'category',
          count,
        }).value,
    );

    return { results, total, facets };
  }
}
