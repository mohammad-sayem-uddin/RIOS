/**
 * Discovery & Search Bounded Context — Value Objects
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

export class SearchId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): SearchId {
    return new SearchId(id ?? UniqueId.create().value);
  }

  public static from(id: string): SearchId {
    return new SearchId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): SearchId {
    return new SearchId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class IndexId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): IndexId {
    return new IndexId(id ?? UniqueId.create().value);
  }

  public static from(id: string): IndexId {
    return new IndexId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): IndexId {
    return new IndexId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class PortfolioId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): PortfolioId {
    return new PortfolioId(id ?? UniqueId.create().value);
  }

  public static from(id: string): PortfolioId {
    return new PortfolioId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): PortfolioId {
    return new PortfolioId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ProfileSlug extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(slug: string): Result<ProfileSlug> {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) {
      return Result.fail<ProfileSlug>('Profile slug cannot be empty');
    }
    const sanitized = trimmed
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (!sanitized) {
      return Result.fail<ProfileSlug>('Invalid profile slug format');
    }
    return Result.ok<ProfileSlug>(new ProfileSlug(sanitized));
  }

  public static from(slug: string): ProfileSlug {
    return new ProfileSlug(slug.trim().toLowerCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class SearchQuery extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(query: string): SearchQuery {
    return new SearchQuery(query.trim());
  }

  public static empty(): SearchQuery {
    return new SearchQuery('');
  }

  public isEmpty(): boolean {
    return this.props.value === '';
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class SearchKeyword extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(keyword: string): Result<SearchKeyword> {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) {
      return Result.fail<SearchKeyword>('Search keyword cannot be empty');
    }
    return Result.ok<SearchKeyword>(new SearchKeyword(trimmed));
  }

  public static from(keyword: string): SearchKeyword {
    return new SearchKeyword(keyword.trim().toLowerCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export interface SearchFilterProps {
  key: string;
  value: string;
  operator?: 'EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN';
}

export class SearchFilter extends ValueObject<SearchFilterProps> {
  private constructor(props: SearchFilterProps) {
    super({
      key: props.key.trim(),
      value: props.value.trim(),
      operator: props.operator ?? 'EQUALS',
    });
  }

  public get key(): string {
    return this.props.key;
  }

  public get value(): string {
    return this.props.value;
  }

  public get operator(): 'EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' {
    return this.props.operator ?? 'EQUALS';
  }

  public static create(props: SearchFilterProps): Result<SearchFilter> {
    if (!props.key || !props.key.trim()) {
      return Result.fail<SearchFilter>('Filter key cannot be empty');
    }
    return Result.ok<SearchFilter>(new SearchFilter(props));
  }
}

export type SortDirection = 'ASC' | 'DESC';

export interface SortOptionProps {
  field: string;
  direction: SortDirection;
}

export class SortOption extends ValueObject<SortOptionProps> {
  private constructor(props: SortOptionProps) {
    super(props);
  }

  public get field(): string {
    return this.props.field;
  }

  public get direction(): SortDirection {
    return this.props.direction;
  }

  public static create(field: string, direction: SortDirection = 'DESC'): SortOption {
    return new SortOption({ field: field.trim(), direction });
  }
}

export class RankingScore extends ValueObject<{ value: number }> {
  private constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(score: number): Result<RankingScore> {
    if (isNaN(score) || score < 0) {
      return Result.fail<RankingScore>('Ranking score must be a non-negative number');
    }
    return Result.ok<RankingScore>(new RankingScore(score));
  }

  public static zero(): RankingScore {
    return new RankingScore(0);
  }
}

export enum VisibilityState {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED',
}

export class VisibilityLevel extends ValueObject<{ state: VisibilityState }> {
  private constructor(state: VisibilityState) {
    super({ state });
  }

  public get state(): VisibilityState {
    return this.props.state;
  }

  public isPublic(): boolean {
    return this.props.state === VisibilityState.PUBLIC;
  }

  public isPrivate(): boolean {
    return this.props.state === VisibilityState.PRIVATE;
  }

  public isUnlisted(): boolean {
    return this.props.state === VisibilityState.UNLISTED;
  }

  public static create(state: VisibilityState = VisibilityState.PUBLIC): VisibilityLevel {
    return new VisibilityLevel(state);
  }

  public static publicLevel(): VisibilityLevel {
    return new VisibilityLevel(VisibilityState.PUBLIC);
  }

  public static privateLevel(): VisibilityLevel {
    return new VisibilityLevel(VisibilityState.PRIVATE);
  }

  public static unlistedLevel(): VisibilityLevel {
    return new VisibilityLevel(VisibilityState.UNLISTED);
  }
}
