/**
 * Discovery & Search Bounded Context — Entities
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { PortfolioId, RankingScore, VisibilityLevel } from '../value-objects/index.js';

export type DocumentType = 'RESEARCHER' | 'PUBLICATION' | 'PROJECT' | 'DATASET' | 'INSTITUTION';

export interface SearchDocumentProps {
  documentType: DocumentType;
  entityId: string;
  title: string;
  description?: string;
  keywords: string[];
  category?: string;
  institution?: string;
  authorName?: string;
  visibility: VisibilityLevel;
  metadataJson?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SearchDocument extends Entity<SearchDocumentProps> {
  private constructor(props: SearchDocumentProps, id?: UniqueId) {
    super(props, id);
  }

  public get documentType(): DocumentType {
    return this.props.documentType;
  }

  public get entityId(): string {
    return this.props.entityId;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get keywords(): string[] {
    return [...this.props.keywords];
  }

  public get category(): string | undefined {
    return this.props.category;
  }

  public get institution(): string | undefined {
    return this.props.institution;
  }

  public get authorName(): string | undefined {
    return this.props.authorName;
  }

  public get visibility(): VisibilityLevel {
    return this.props.visibility;
  }

  public get metadataJson(): string | undefined {
    return this.props.metadataJson;
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  public static create(props: SearchDocumentProps, id?: UniqueId): Result<SearchDocument> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<SearchDocument>('Search document title cannot be empty');
    }
    if (!props.entityId || !props.entityId.trim()) {
      return Result.fail<SearchDocument>('Search document entityId cannot be empty');
    }
    return Result.ok<SearchDocument>(
      new SearchDocument(
        {
          ...props,
          title: props.title.trim(),
          keywords: props.keywords.map((k) => k.trim().toLowerCase()),
          createdAt: props.createdAt ?? new Date(),
          updatedAt: props.updatedAt ?? new Date(),
        },
        id,
      ),
    );
  }
}

export interface SearchResultProps {
  document: SearchDocument;
  score: RankingScore;
  highlights?: string[];
}

export class SearchResult extends Entity<SearchResultProps> {
  private constructor(props: SearchResultProps, id?: UniqueId) {
    super(props, id);
  }

  public get document(): SearchDocument {
    return this.props.document;
  }

  public get score(): RankingScore {
    return this.props.score;
  }

  public get highlights(): string[] {
    return this.props.highlights ?? [];
  }

  public static create(props: SearchResultProps, id?: UniqueId): Result<SearchResult> {
    return Result.ok<SearchResult>(new SearchResult(props, id));
  }
}

export interface SearchFacetProps {
  name: string;
  field: string;
  count: number;
}

export class SearchFacet extends Entity<SearchFacetProps> {
  private constructor(props: SearchFacetProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get field(): string {
    return this.props.field;
  }

  public get count(): number {
    return this.props.count;
  }

  public static create(props: SearchFacetProps, id?: UniqueId): Result<SearchFacet> {
    if (!props.name || !props.field) {
      return Result.fail<SearchFacet>('Search facet name and field are required');
    }
    return Result.ok<SearchFacet>(new SearchFacet(props, id));
  }
}

export interface InstitutionProfileProps {
  name: string;
  normalizedName: string;
  country?: string;
  departmentCount: number;
  researcherCount: number;
  websiteUrl?: string;
  createdAt?: Date;
}

export class InstitutionProfile extends Entity<InstitutionProfileProps> {
  private constructor(props: InstitutionProfileProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get normalizedName(): string {
    return this.props.normalizedName;
  }

  public get country(): string | undefined {
    return this.props.country;
  }

  public get departmentCount(): number {
    return this.props.departmentCount;
  }

  public get researcherCount(): number {
    return this.props.researcherCount;
  }

  public get websiteUrl(): string | undefined {
    return this.props.websiteUrl;
  }

  public static create(props: InstitutionProfileProps, id?: UniqueId): Result<InstitutionProfile> {
    if (!props.name || !props.name.trim()) {
      return Result.fail<InstitutionProfile>('Institution profile name cannot be empty');
    }
    const normalizedName = props.name.trim().toLowerCase().replace(/\s+/g, ' ');
    return Result.ok<InstitutionProfile>(
      new InstitutionProfile(
        {
          ...props,
          name: props.name.trim(),
          normalizedName,
          createdAt: props.createdAt ?? new Date(),
        },
        id,
      ),
    );
  }
}

export interface KeywordClusterProps {
  keyword: string;
  popularityScore: number;
  relatedKeywords: string[];
  category?: string;
}

export class KeywordCluster extends Entity<KeywordClusterProps> {
  private constructor(props: KeywordClusterProps, id?: UniqueId) {
    super(props, id);
  }

  public get keyword(): string {
    return this.props.keyword;
  }

  public get popularityScore(): number {
    return this.props.popularityScore;
  }

  public get relatedKeywords(): string[] {
    return [...this.props.relatedKeywords];
  }

  public get category(): string | undefined {
    return this.props.category;
  }

  public static create(props: KeywordClusterProps, id?: UniqueId): Result<KeywordCluster> {
    if (!props.keyword || !props.keyword.trim()) {
      return Result.fail<KeywordCluster>('Keyword cluster keyword cannot be empty');
    }
    return Result.ok<KeywordCluster>(
      new KeywordCluster(
        {
          ...props,
          keyword: props.keyword.trim().toLowerCase(),
          relatedKeywords: props.relatedKeywords.map((k) => k.trim().toLowerCase()),
        },
        id,
      ),
    );
  }
}

export interface ResearchCategoryProps {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
}

export class ResearchCategory extends Entity<ResearchCategoryProps> {
  private constructor(props: ResearchCategoryProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get slug(): string {
    return this.props.slug;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get parentCategoryId(): string | undefined {
    return this.props.parentCategoryId;
  }

  public static create(props: ResearchCategoryProps, id?: UniqueId): Result<ResearchCategory> {
    if (!props.name || !props.name.trim()) {
      return Result.fail<ResearchCategory>('Research category name cannot be empty');
    }
    const slug =
      props.slug ||
      props.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
    return Result.ok<ResearchCategory>(
      new ResearchCategory(
        {
          ...props,
          name: props.name.trim(),
          slug,
        },
        id,
      ),
    );
  }
}

export interface ResearchPortfolioProps {
  portfolioId: PortfolioId;
  profileId: string;
  slug: string;
  title: string;
  summary?: string;
  featuredPublicationIds: string[];
  featuredProjectIds: string[];
  featuredDatasetIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class ResearchPortfolio extends Entity<ResearchPortfolioProps> {
  private constructor(props: ResearchPortfolioProps, id?: UniqueId) {
    super(props, id);
  }

  public get portfolioId(): PortfolioId {
    return this.props.portfolioId;
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get slug(): string {
    return this.props.slug;
  }

  public get title(): string {
    return this.props.title;
  }

  public get summary(): string | undefined {
    return this.props.summary;
  }

  public get featuredPublicationIds(): string[] {
    return [...this.props.featuredPublicationIds];
  }

  public get featuredProjectIds(): string[] {
    return [...this.props.featuredProjectIds];
  }

  public get featuredDatasetIds(): string[] {
    return [...this.props.featuredDatasetIds];
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  public static create(props: ResearchPortfolioProps, id?: UniqueId): Result<ResearchPortfolio> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<ResearchPortfolio>('Research portfolio title cannot be empty');
    }
    if (!props.slug || !props.slug.trim()) {
      return Result.fail<ResearchPortfolio>('Research portfolio slug cannot be empty');
    }
    return Result.ok<ResearchPortfolio>(
      new ResearchPortfolio(
        {
          ...props,
          title: props.title.trim(),
          slug: props.slug.trim().toLowerCase(),
          createdAt: props.createdAt ?? new Date(),
          updatedAt: props.updatedAt ?? new Date(),
        },
        id,
      ),
    );
  }
}

export interface TrendingResearchProps {
  entityId: string;
  documentType: DocumentType;
  title: string;
  viewCount: number;
  citationCount: number;
  trendingScore: number;
  period: string;
}

export class TrendingResearch extends Entity<TrendingResearchProps> {
  private constructor(props: TrendingResearchProps, id?: UniqueId) {
    super(props, id);
  }

  public get entityId(): string {
    return this.props.entityId;
  }

  public get documentType(): DocumentType {
    return this.props.documentType;
  }

  public get title(): string {
    return this.props.title;
  }

  public get viewCount(): number {
    return this.props.viewCount;
  }

  public get citationCount(): number {
    return this.props.citationCount;
  }

  public get trendingScore(): number {
    return this.props.trendingScore;
  }

  public get period(): string {
    return this.props.period;
  }

  public static create(props: TrendingResearchProps, id?: UniqueId): Result<TrendingResearch> {
    if (!props.entityId || !props.title) {
      return Result.fail<TrendingResearch>('Trending research entityId and title are required');
    }
    return Result.ok<TrendingResearch>(new TrendingResearch(props, id));
  }
}
