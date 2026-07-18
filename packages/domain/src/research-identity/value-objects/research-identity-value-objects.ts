/**
 * Research Identity Domain Value Objects
 *
 * Immutable domain primitives for the Research Identity Bounded Context.
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

export class ResearchProfileId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): ResearchProfileId {
    return new ResearchProfileId(id ?? UniqueId.create().value);
  }

  public static from(id: string): ResearchProfileId {
    return new ResearchProfileId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): ResearchProfileId {
    return new ResearchProfileId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class EducationId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): EducationId {
    return new EducationId(id ?? UniqueId.create().value);
  }

  public static from(id: string): EducationId {
    return new EducationId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): EducationId {
    return new EducationId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ExperienceId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): ExperienceId {
    return new ExperienceId(id ?? UniqueId.create().value);
  }

  public static from(id: string): ExperienceId {
    return new ExperienceId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): ExperienceId {
    return new ExperienceId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ResearchInterestId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): ResearchInterestId {
    return new ResearchInterestId(id ?? UniqueId.create().value);
  }

  public static from(id: string): ResearchInterestId {
    return new ResearchInterestId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): ResearchInterestId {
    return new ResearchInterestId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class SkillId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): SkillId {
    return new SkillId(id ?? UniqueId.create().value);
  }

  public static from(id: string): SkillId {
    return new SkillId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): SkillId {
    return new SkillId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ExternalProfileId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): ExternalProfileId {
    return new ExternalProfileId(id ?? UniqueId.create().value);
  }

  public static from(id: string): ExternalProfileId {
    return new ExternalProfileId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): ExternalProfileId {
    return new ExternalProfileId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class PortfolioAssetId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): PortfolioAssetId {
    return new PortfolioAssetId(id ?? UniqueId.create().value);
  }

  public static from(id: string): PortfolioAssetId {
    return new PortfolioAssetId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): PortfolioAssetId {
    return new PortfolioAssetId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class Biography extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(biography: string): Result<Biography> {
    if (typeof biography !== 'string' || biography.trim().length === 0) {
      return Result.fail('Biography cannot be empty');
    }
    if (biography.length > 5000) {
      return Result.fail('Biography exceeds maximum length of 5000 characters');
    }
    return Result.ok(new Biography(biography.trim()));
  }
}

export class AcademicHeadline extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(headline: string): Result<AcademicHeadline> {
    if (typeof headline !== 'string' || headline.trim().length === 0) {
      return Result.fail('Academic headline cannot be empty');
    }
    if (headline.length > 250) {
      return Result.fail('Academic headline exceeds maximum length of 250 characters');
    }
    return Result.ok(new AcademicHeadline(headline.trim()));
  }
}

export class AcademicSummary extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(summary: string): Result<AcademicSummary> {
    if (typeof summary !== 'string' || summary.trim().length === 0) {
      return Result.fail('Academic summary cannot be empty');
    }
    if (summary.length > 2000) {
      return Result.fail('Academic summary exceeds maximum length of 2000 characters');
    }
    return Result.ok(new AcademicSummary(summary.trim()));
  }
}

export class ResearchStatement extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(statement: string): Result<ResearchStatement> {
    if (typeof statement !== 'string' || statement.trim().length === 0) {
      return Result.fail('Research statement cannot be empty');
    }
    if (statement.length > 4000) {
      return Result.fail('Research statement exceeds maximum length of 4000 characters');
    }
    return Result.ok(new ResearchStatement(statement.trim()));
  }
}

export class Mission extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(mission: string): Result<Mission> {
    if (typeof mission !== 'string' || mission.trim().length === 0) {
      return Result.fail('Mission statement cannot be empty');
    }
    return Result.ok(new Mission(mission.trim()));
  }
}

export class Vision extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(vision: string): Result<Vision> {
    if (typeof vision !== 'string' || vision.trim().length === 0) {
      return Result.fail('Vision statement cannot be empty');
    }
    return Result.ok(new Vision(vision.trim()));
  }
}

export class InstitutionName extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<InstitutionName> {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return Result.fail('Institution name cannot be empty');
    }
    return Result.ok(new InstitutionName(name.trim()));
  }
}

export class DegreeName extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<DegreeName> {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return Result.fail('Degree name cannot be empty');
    }
    return Result.ok(new DegreeName(name.trim()));
  }
}

export class SkillName extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<SkillName> {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return Result.fail('Skill name cannot be empty');
    }
    return Result.ok(new SkillName(name.trim()));
  }
}

export class ResearchInterestName extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<ResearchInterestName> {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return Result.fail('Research interest name cannot be empty');
    }
    return Result.ok(new ResearchInterestName(name.trim()));
  }
}

export class ExternalProfileUrl extends ValueObject<{ url: string }> {
  private constructor(url: string) {
    super({ url });
  }

  public get url(): string {
    return this.props.url;
  }

  public static create(rawUrl: string): Result<ExternalProfileUrl> {
    if (typeof rawUrl !== 'string' || rawUrl.trim().length === 0) {
      return Result.fail('URL cannot be empty');
    }
    try {
      const parsed = new URL(rawUrl.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return Result.fail('URL must use HTTP or HTTPS protocol');
      }
      return Result.ok(new ExternalProfileUrl(parsed.toString()));
    } catch {
      return Result.fail('Invalid URL format');
    }
  }
}

export type ProfileProviderType =
  'ORCID' | 'GOOGLE_SCHOLAR' | 'GITHUB' | 'LINKEDIN' | 'RESEARCH_GATE' | 'OTHER';
export type SkillCategoryType =
  'METHODOLOGY' | 'TECHNICAL' | 'DOMAIN_KNOWLEDGE' | 'TOOL' | 'LANGUAGE' | 'OTHER';
export type AssetTypeType =
  'PUBLICATION_PDF' | 'DATASET' | 'PRESENTATION' | 'CODE_REPOSITORY' | 'CERTIFICATE' | 'OTHER';

export interface AcademicPeriodProps {
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
}

export class AcademicPeriod extends ValueObject<AcademicPeriodProps> {
  private constructor(props: AcademicPeriodProps) {
    super(props);
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date | null {
    return this.props.endDate;
  }

  public get isCurrent(): boolean {
    return this.props.isCurrent;
  }

  public static create(
    startDate: Date,
    endDate: Date | null = null,
    isCurrent = false,
  ): Result<AcademicPeriod> {
    if (isNaN(startDate.getTime())) {
      return Result.fail('Start date is required and must be valid');
    }
    if (!isCurrent && endDate !== null && endDate < startDate) {
      return Result.fail('End date cannot be prior to start date');
    }
    return Result.ok(
      new AcademicPeriod({ startDate, endDate: isCurrent ? null : endDate, isCurrent }),
    );
  }
}
