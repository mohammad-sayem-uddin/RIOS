/**
 * Mapper for SearchIndex Aggregate and SearchDocument Entity
 */

import { SearchDocumentModel, SearchIndexModel } from '@prisma/client';
import { DocumentType, SearchDocument, SearchIndex, VisibilityLevel } from '@rios/domain';
import { UniqueId } from '@rios/shared';

export class SearchIndexMapper {
  public static toDomain(
    model: SearchIndexModel & { documents?: SearchDocumentModel[] },
  ): SearchIndex {
    const documents: SearchDocument[] = (model.documents ?? []).map(
      (docModel) =>
        SearchDocument.create(
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
        ).value,
    );

    return SearchIndex.reconstitute(
      {
        name: model.name,
        documentCount: model.documentCount,
        documents,
        lastIndexedAt: model.lastIndexedAt,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
      UniqueId.from(model.id),
    );
  }

  public static toPersistence(
    aggregate: SearchIndex,
  ): Omit<SearchIndexModel, 'createdAt' | 'updatedAt'> {
    return {
      id: aggregate.indexId.value,
      name: aggregate.name,
      documentCount: aggregate.documentCount,
      lastIndexedAt: aggregate.lastIndexedAt,
    };
  }

  public static documentToPersistence(
    document: SearchDocument,
    indexId?: string,
  ): Omit<SearchDocumentModel, 'createdAt' | 'updatedAt'> {
    return {
      id: document.id.value,
      indexId: indexId ?? null,
      documentType: document.documentType,
      entityId: document.entityId,
      title: document.title,
      description: document.description ?? null,
      keywords: document.keywords.join(','),
      category: document.category ?? null,
      institution: document.institution ?? null,
      authorName: document.authorName ?? null,
      visibility: document.visibility.state,
      metadataJson: document.metadataJson ?? null,
    };
  }
}
