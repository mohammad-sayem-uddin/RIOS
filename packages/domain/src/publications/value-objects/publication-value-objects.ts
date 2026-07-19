/**
 * Publications Domain Value Objects
 *
 * Immutable domain primitives for the Publications & Research Projects Bounded Context.
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

export class PublicationId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): PublicationId {
    return new PublicationId(id ?? UniqueId.create().value);
  }

  public static from(id: string): PublicationId {
    return new PublicationId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): PublicationId {
    return new PublicationId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ProjectId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): ProjectId {
    return new ProjectId(id ?? UniqueId.create().value);
  }

  public static from(id: string): ProjectId {
    return new ProjectId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): ProjectId {
    return new ProjectId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class DOI extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(doi: string): Result<DOI> {
    const trimmed = doi.trim();
    if (!trimmed) {
      return Result.fail<DOI>('DOI cannot be empty.');
    }

    // Standard DOI regex pattern matching 10.XXXX/XXXX
    const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;
    if (!doiRegex.test(trimmed)) {
      return Result.fail<DOI>(`Invalid DOI format: ${doi}`);
    }

    return Result.ok<DOI>(new DOI(trimmed.toLowerCase()));
  }

  public static from(doi: string): DOI {
    return new DOI(doi.trim().toLowerCase());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ISBN extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(isbn: string): Result<ISBN> {
    const sanitized = isbn.replace(/[- ]/g, '').trim();
    if (sanitized.length !== 10 && sanitized.length !== 13) {
      return Result.fail<ISBN>(`Invalid ISBN length. Expected 10 or 13 digits, got ${isbn}`);
    }
    return Result.ok<ISBN>(new ISBN(sanitized));
  }

  public static from(isbn: string): ISBN {
    return new ISBN(isbn.replace(/[- ]/g, '').trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ISSN extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(issn: string): Result<ISSN> {
    const sanitized = issn.replace(/[- ]/g, '').trim();
    if (sanitized.length !== 8) {
      return Result.fail<ISSN>(`Invalid ISSN format. Expected 8 characters, got ${issn}`);
    }
    const formatted = `${sanitized.slice(0, 4)}-${sanitized.slice(4)}`;
    return Result.ok<ISSN>(new ISSN(formatted));
  }

  public static from(issn: string): ISSN {
    return new ISSN(issn.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ORCID extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(orcid: string): Result<ORCID> {
    const trimmed = orcid.trim();
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
    if (!orcidRegex.test(trimmed)) {
      return Result.fail<ORCID>(`Invalid ORCID format: ${orcid}`);
    }
    return Result.ok<ORCID>(new ORCID(trimmed));
  }

  public static from(orcid: string): ORCID {
    return new ORCID(orcid.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class PublicationTitle extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(title: string): Result<PublicationTitle> {
    const trimmed = title?.trim();
    if (!trimmed || trimmed.length === 0) {
      return Result.fail<PublicationTitle>('Publication title cannot be empty.');
    }
    if (trimmed.length > 500) {
      return Result.fail<PublicationTitle>('Publication title cannot exceed 500 characters.');
    }
    return Result.ok<PublicationTitle>(new PublicationTitle(trimmed));
  }

  public static from(title: string): PublicationTitle {
    return new PublicationTitle(title.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class Abstract extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(text: string): Result<Abstract> {
    const trimmed = text?.trim() ?? '';
    return Result.ok<Abstract>(new Abstract(trimmed));
  }

  public static from(text: string): Abstract {
    return new Abstract(text.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class Keywords extends ValueObject<{ values: string[] }> {
  private constructor(values: string[]) {
    super({ values });
  }

  public get values(): string[] {
    return [...this.props.values];
  }

  public static create(keywords: string[]): Result<Keywords> {
    const sanitized = keywords.map((k) => k.trim()).filter((k) => k.length > 0);
    const unique = Array.from(new Set(sanitized));
    return Result.ok<Keywords>(new Keywords(unique));
  }

  public static from(keywords: string[]): Keywords {
    return new Keywords(keywords.map((k) => k.trim()).filter(Boolean));
  }
}

export class PublicationYear extends ValueObject<{ value: number }> {
  private constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(year: number): Result<PublicationYear> {
    const currentYear = new Date().getFullYear();
    if (year < 1500 || year > currentYear + 5) {
      return Result.fail<PublicationYear>(`Invalid publication year: ${year}`);
    }
    return Result.ok<PublicationYear>(new PublicationYear(year));
  }

  public static from(year: number): PublicationYear {
    return new PublicationYear(year);
  }

  public override toString(): string {
    return String(this.props.value);
  }
}

export class CitationCount extends ValueObject<{ value: number }> {
  private constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(count: number): Result<CitationCount> {
    if (count < 0) {
      return Result.fail<CitationCount>('Citation count cannot be negative.');
    }
    return Result.ok<CitationCount>(new CitationCount(Math.floor(count)));
  }

  public static from(count: number): CitationCount {
    return new CitationCount(Math.max(0, Math.floor(count)));
  }
}

export class FundingIdentifier extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id: string): Result<FundingIdentifier> {
    const trimmed = id?.trim();
    if (!trimmed) {
      return Result.fail<FundingIdentifier>('Funding identifier cannot be empty.');
    }
    return Result.ok<FundingIdentifier>(new FundingIdentifier(trimmed));
  }

  public static from(id: string): FundingIdentifier {
    return new FundingIdentifier(id.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export type ProjectRoleType =
  | 'PRINCIPAL_INVESTIGATOR'
  | 'CO_INVESTIGATOR'
  | 'RESEARCHER'
  | 'POSTDOC'
  | 'STUDENT_RESEARCHER'
  | 'COLLABORATOR';

export class ProjectRole extends ValueObject<{ value: ProjectRoleType }> {
  private constructor(value: ProjectRoleType) {
    super({ value });
  }

  public get value(): ProjectRoleType {
    return this.props.value;
  }

  public static create(role: string): Result<ProjectRole> {
    const validRoles: ProjectRoleType[] = [
      'PRINCIPAL_INVESTIGATOR',
      'CO_INVESTIGATOR',
      'RESEARCHER',
      'POSTDOC',
      'STUDENT_RESEARCHER',
      'COLLABORATOR',
    ];

    const normalized = role?.toUpperCase().trim() as ProjectRoleType;
    if (!validRoles.includes(normalized)) {
      return Result.fail<ProjectRole>(`Invalid project role: ${role}`);
    }
    return Result.ok<ProjectRole>(new ProjectRole(normalized));
  }

  public static from(role: ProjectRoleType): ProjectRole {
    return new ProjectRole(role);
  }

  public isPI(): boolean {
    return this.props.value === 'PRINCIPAL_INVESTIGATOR';
  }
}

export type PublicationStatusType =
  'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'PUBLISHED' | 'PREPRINT';

export class PublicationStatus extends ValueObject<{ value: PublicationStatusType }> {
  private constructor(value: PublicationStatusType) {
    super({ value });
  }

  public get value(): PublicationStatusType {
    return this.props.value;
  }

  public static create(status: string): Result<PublicationStatus> {
    const validStatuses: PublicationStatusType[] = [
      'DRAFT',
      'SUBMITTED',
      'UNDER_REVIEW',
      'ACCEPTED',
      'PUBLISHED',
      'PREPRINT',
    ];

    const normalized = status?.toUpperCase().trim() as PublicationStatusType;
    if (!validStatuses.includes(normalized)) {
      return Result.fail<PublicationStatus>(`Invalid publication status: ${status}`);
    }
    return Result.ok<PublicationStatus>(new PublicationStatus(normalized));
  }

  public static from(status: PublicationStatusType): PublicationStatus {
    return new PublicationStatus(status);
  }

  public isPublished(): boolean {
    return this.props.value === 'PUBLISHED';
  }

  public isUnderReview(): boolean {
    return this.props.value === 'UNDER_REVIEW';
  }
}

export type PublicationTypeEnum =
  | 'JOURNAL_ARTICLE'
  | 'CONFERENCE_PAPER'
  | 'BOOK'
  | 'BOOK_CHAPTER'
  | 'THESIS'
  | 'TECHNICAL_REPORT'
  | 'PREPRINT';

export class PublicationType extends ValueObject<{ value: PublicationTypeEnum }> {
  private constructor(value: PublicationTypeEnum) {
    super({ value });
  }

  public get value(): PublicationTypeEnum {
    return this.props.value;
  }

  public static create(type: string): Result<PublicationType> {
    const validTypes: PublicationTypeEnum[] = [
      'JOURNAL_ARTICLE',
      'CONFERENCE_PAPER',
      'BOOK',
      'BOOK_CHAPTER',
      'THESIS',
      'TECHNICAL_REPORT',
      'PREPRINT',
    ];

    const normalized = type?.toUpperCase().trim() as PublicationTypeEnum;
    if (!validTypes.includes(normalized)) {
      return Result.fail<PublicationType>(`Invalid publication type: ${type}`);
    }
    return Result.ok<PublicationType>(new PublicationType(normalized));
  }

  public static from(type: PublicationTypeEnum): PublicationType {
    return new PublicationType(type);
  }

  public isJournalArticle(): boolean {
    return this.props.value === 'JOURNAL_ARTICLE';
  }

  public isConferencePaper(): boolean {
    return this.props.value === 'CONFERENCE_PAPER';
  }

  public isBook(): boolean {
    return this.props.value === 'BOOK';
  }
}

export class ResearchField extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(field: string): Result<ResearchField> {
    const trimmed = field?.trim();
    if (!trimmed) {
      return Result.fail<ResearchField>('Research field cannot be empty.');
    }
    return Result.ok<ResearchField>(new ResearchField(trimmed));
  }

  public static from(field: string): ResearchField {
    return new ResearchField(field.trim());
  }
}

export class ResearchArea extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(area: string): Result<ResearchArea> {
    const trimmed = area?.trim();
    if (!trimmed) {
      return Result.fail<ResearchArea>('Research area cannot be empty.');
    }
    return Result.ok<ResearchArea>(new ResearchArea(trimmed));
  }

  public static from(area: string): ResearchArea {
    return new ResearchArea(area.trim());
  }
}

export class Language extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(lang: string): Result<Language> {
    const trimmed = lang?.trim() ?? 'en';
    return Result.ok<Language>(new Language(trimmed));
  }

  public static from(lang: string): Language {
    return new Language(lang.trim());
  }
}

export class URL extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(url: string): Result<URL> {
    const trimmed = url?.trim();
    if (!trimmed) {
      return Result.fail<URL>('URL cannot be empty.');
    }
    try {
      const parsed = new globalThis.URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return Result.fail<URL>('URL must use HTTP or HTTPS protocol.');
      }
      return Result.ok<URL>(new URL(parsed.toString()));
    } catch {
      return Result.fail<URL>(`Invalid URL format: ${url}`);
    }
  }

  public static from(url: string): URL {
    return new URL(url.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}
