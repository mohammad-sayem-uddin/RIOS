/**
 * Discovery & Search Bounded Context — Aggregate Roots
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import {
  InstitutionProfile,
  KeywordCluster,
  ResearchCategory,
  SearchDocument,
  TrendingResearch,
} from '../entities/index.js';
import {
  ProfilePublishedEvent,
  ProfileVisibilityChangedEvent,
  ResearchIndexedEvent,
  SearchIndexUpdatedEvent,
} from '../events/index.js';
import {
  IndexId,
  PortfolioId,
  ProfileSlug,
  VisibilityLevel,
  VisibilityState,
} from '../value-objects/index.js';

// ─── PublicResearchProfile Aggregate Root ─────────────────────────────────────

export interface PublicResearchProfileProps {
  userId: string;
  slug: ProfileSlug;
  title: string;
  headline?: string;
  biography?: string;
  institution?: string;
  researchAreas: string[];
  visibility: VisibilityLevel;
  isPublished: boolean;
  featuredPortfolioId?: PortfolioId;
  createdAt: Date;
  updatedAt: Date;
}

export class PublicResearchProfile extends AggregateRoot<PublicResearchProfileProps> {
  private constructor(props: PublicResearchProfileProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this._id.value;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get slug(): ProfileSlug {
    return this.props.slug;
  }

  public get title(): string {
    return this.props.title;
  }

  public get headline(): string | undefined {
    return this.props.headline;
  }

  public get biography(): string | undefined {
    return this.props.biography;
  }

  public get institution(): string | undefined {
    return this.props.institution;
  }

  public get researchAreas(): string[] {
    return [...this.props.researchAreas];
  }

  public get visibility(): VisibilityLevel {
    return this.props.visibility;
  }

  public get isPublished(): boolean {
    return this.props.isPublished;
  }

  public get featuredPortfolioId(): PortfolioId | undefined {
    return this.props.featuredPortfolioId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public publish(slug: ProfileSlug): Result<void> {
    this.props.slug = slug;
    this.props.isPublished = true;
    this.props.visibility = VisibilityLevel.publicLevel();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ProfilePublishedEvent(this.profileId, this.userId, slug.value, this.title),
    );

    return Result.ok<void>(undefined);
  }

  public unpublish(): Result<void> {
    this.props.isPublished = false;
    this.props.visibility = VisibilityLevel.privateLevel();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ProfileVisibilityChangedEvent(
        this.profileId,
        VisibilityState.PUBLIC,
        VisibilityState.PRIVATE,
      ),
    );

    return Result.ok<void>(undefined);
  }

  public changeVisibility(visibility: VisibilityLevel): Result<void> {
    const prev = this.props.visibility.state;
    this.props.visibility = visibility;
    this.props.isPublished = visibility.isPublic();
    this.props.updatedAt = new Date();

    this.addDomainEvent(new ProfileVisibilityChangedEvent(this.profileId, prev, visibility.state));

    return Result.ok<void>(undefined);
  }

  public setFeaturedPortfolio(portfolioId: PortfolioId): void {
    this.props.featuredPortfolioId = portfolioId;
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<PublicResearchProfileProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueId,
  ): Result<PublicResearchProfile> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<PublicResearchProfile>('Public research profile title cannot be empty');
    }
    if (!props.userId || !props.userId.trim()) {
      return Result.fail<PublicResearchProfile>('Public research profile userId cannot be empty');
    }

    const profile = new PublicResearchProfile(
      {
        ...props,
        title: props.title.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );

    if (props.isPublished) {
      profile.addDomainEvent(
        new ProfilePublishedEvent(profile.profileId, props.userId, props.slug.value, props.title),
      );
    }

    return Result.ok<PublicResearchProfile>(profile);
  }

  public static reconstitute(
    props: PublicResearchProfileProps,
    id: UniqueId,
  ): PublicResearchProfile {
    return new PublicResearchProfile(props, id);
  }
}

// ─── SearchIndex Aggregate Root ──────────────────────────────────────────────

export interface SearchIndexProps {
  name: string;
  documentCount: number;
  documents: SearchDocument[];
  lastIndexedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SearchIndex extends AggregateRoot<SearchIndexProps> {
  private constructor(props: SearchIndexProps, id?: UniqueId) {
    super(props, id);
  }

  public get indexId(): IndexId {
    return IndexId.fromUniqueId(this._id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get documentCount(): number {
    return this.props.documents.length;
  }

  public get documents(): SearchDocument[] {
    return [...this.props.documents];
  }

  public get lastIndexedAt(): Date {
    return this.props.lastIndexedAt;
  }

  public addDocument(document: SearchDocument): Result<void> {
    const existingIndex = this.props.documents.findIndex(
      (d) => d.entityId === document.entityId && d.documentType === document.documentType,
    );

    if (existingIndex >= 0) {
      this.props.documents[existingIndex] = document;
    } else {
      this.props.documents.push(document);
    }

    this.props.documentCount = this.props.documents.length;
    this.props.lastIndexedAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ResearchIndexedEvent(
        document.id.value,
        document.documentType,
        document.entityId,
        document.title,
      ),
    );

    return Result.ok<void>(undefined);
  }

  public removeDocument(entityId: string, documentType: string): Result<void> {
    this.props.documents = this.props.documents.filter(
      (d) => !(d.entityId === entityId && d.documentType === documentType),
    );
    this.props.documentCount = this.props.documents.length;
    this.props.updatedAt = new Date();

    return Result.ok<void>(undefined);
  }

  public updateIndex(): Result<void> {
    this.props.lastIndexedAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new SearchIndexUpdatedEvent(
        this.indexId.value,
        this.documentCount,
        this.props.documents.map((d) => d.entityId),
      ),
    );

    return Result.ok<void>(undefined);
  }

  public static create(
    name: string,
    documents: SearchDocument[] = [],
    id?: UniqueId,
  ): Result<SearchIndex> {
    if (!name || !name.trim()) {
      return Result.fail<SearchIndex>('Search index name cannot be empty');
    }

    const index = new SearchIndex(
      {
        name: name.trim(),
        documentCount: documents.length,
        documents,
        lastIndexedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );

    return Result.ok<SearchIndex>(index);
  }

  public static reconstitute(props: SearchIndexProps, id: UniqueId): SearchIndex {
    return new SearchIndex(props, id);
  }
}

// ─── DiscoveryCatalog Aggregate Root ─────────────────────────────────────────

export interface DiscoveryCatalogProps {
  name: string;
  institutionProfiles: InstitutionProfile[];
  keywordClusters: KeywordCluster[];
  researchCategories: ResearchCategory[];
  trendingResearch: TrendingResearch[];
  createdAt: Date;
  updatedAt: Date;
}

export class DiscoveryCatalog extends AggregateRoot<DiscoveryCatalogProps> {
  private constructor(props: DiscoveryCatalogProps, id?: UniqueId) {
    super(props, id);
  }

  public get catalogId(): string {
    return this._id.value;
  }

  public get name(): string {
    return this.props.name;
  }

  public get institutionProfiles(): InstitutionProfile[] {
    return [...this.props.institutionProfiles];
  }

  public get keywordClusters(): KeywordCluster[] {
    return [...this.props.keywordClusters];
  }

  public get researchCategories(): ResearchCategory[] {
    return [...this.props.researchCategories];
  }

  public get trendingResearch(): TrendingResearch[] {
    return [...this.props.trendingResearch];
  }

  public addInstitution(institution: InstitutionProfile): void {
    const existingIndex = this.props.institutionProfiles.findIndex(
      (inst) => inst.normalizedName === institution.normalizedName,
    );
    if (existingIndex >= 0) {
      this.props.institutionProfiles[existingIndex] = institution;
    } else {
      this.props.institutionProfiles.push(institution);
    }
    this.props.updatedAt = new Date();
  }

  public addKeywordCluster(cluster: KeywordCluster): void {
    const existingIndex = this.props.keywordClusters.findIndex(
      (kc) => kc.keyword === cluster.keyword,
    );
    if (existingIndex >= 0) {
      this.props.keywordClusters[existingIndex] = cluster;
    } else {
      this.props.keywordClusters.push(cluster);
    }
    this.props.updatedAt = new Date();
  }

  public addCategory(category: ResearchCategory): void {
    const existingIndex = this.props.researchCategories.findIndex(
      (rc) => rc.slug === category.slug,
    );
    if (existingIndex >= 0) {
      this.props.researchCategories[existingIndex] = category;
    } else {
      this.props.researchCategories.push(category);
    }
    this.props.updatedAt = new Date();
  }

  public setTrendingResearch(items: TrendingResearch[]): void {
    this.props.trendingResearch = items;
    this.props.updatedAt = new Date();
  }

  public static create(name: string, id?: UniqueId): Result<DiscoveryCatalog> {
    if (!name || !name.trim()) {
      return Result.fail<DiscoveryCatalog>('Discovery catalog name cannot be empty');
    }
    return Result.ok<DiscoveryCatalog>(
      new DiscoveryCatalog(
        {
          name: name.trim(),
          institutionProfiles: [],
          keywordClusters: [],
          researchCategories: [],
          trendingResearch: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        id,
      ),
    );
  }

  public static reconstitute(props: DiscoveryCatalogProps, id: UniqueId): DiscoveryCatalog {
    return new DiscoveryCatalog(props, id);
  }
}
