/**
 * Academic Recognition Bounded Context Value Objects
 *
 * Immutable domain primitives for awards, grants, patents, and professional activities.
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

export class AwardId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): AwardId {
    return new AwardId(id ?? UniqueId.create().value);
  }

  public static from(id: string): AwardId {
    return new AwardId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): AwardId {
    return new AwardId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class GrantId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): GrantId {
    return new GrantId(id ?? UniqueId.create().value);
  }

  public static from(id: string): GrantId {
    return new GrantId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): GrantId {
    return new GrantId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class PatentId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): PatentId {
    return new PatentId(id ?? UniqueId.create().value);
  }

  public static from(id: string): PatentId {
    return new PatentId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): PatentId {
    return new PatentId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ActivityId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): ActivityId {
    return new ActivityId(id ?? UniqueId.create().value);
  }

  public static from(id: string): ActivityId {
    return new ActivityId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): ActivityId {
    return new ActivityId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class AwardTitle extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(title: string): Result<AwardTitle> {
    const trimmed = title.trim();
    if (!trimmed) {
      return Result.fail<AwardTitle>('Award title cannot be empty.');
    }
    return Result.ok<AwardTitle>(new AwardTitle(trimmed));
  }

  public static from(title: string): AwardTitle {
    return new AwardTitle(title.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class GrantNumber extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(grantNum: string): Result<GrantNumber> {
    const trimmed = grantNum.trim();
    if (!trimmed) {
      return Result.fail<GrantNumber>('Grant number cannot be empty.');
    }
    return Result.ok<GrantNumber>(new GrantNumber(trimmed));
  }

  public static from(grantNum: string): GrantNumber {
    return new GrantNumber(grantNum.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class PatentNumber extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(patentNum: string): Result<PatentNumber> {
    const trimmed = patentNum.trim();
    if (!trimmed) {
      return Result.fail<PatentNumber>('Patent number cannot be empty.');
    }
    return Result.ok<PatentNumber>(new PatentNumber(trimmed));
  }

  public static from(patentNum: string): PatentNumber {
    return new PatentNumber(patentNum.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export enum PatentStatusType {
  APPLIED = 'APPLIED',
  PENDING = 'PENDING',
  GRANTED = 'GRANTED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

export class PatentStatus extends ValueObject<{ value: PatentStatusType }> {
  private constructor(value: PatentStatusType) {
    super({ value });
  }

  public get value(): PatentStatusType {
    return this.props.value;
  }

  public static create(status: PatentStatusType): PatentStatus {
    return new PatentStatus(status);
  }

  public canTransitionTo(nextStatus: PatentStatusType): boolean {
    if (this.props.value === nextStatus) return true;
    switch (this.props.value) {
      case PatentStatusType.APPLIED:
        return nextStatus === PatentStatusType.PENDING || nextStatus === PatentStatusType.REJECTED;
      case PatentStatusType.PENDING:
        return nextStatus === PatentStatusType.GRANTED || nextStatus === PatentStatusType.REJECTED;
      case PatentStatusType.GRANTED:
        return nextStatus === PatentStatusType.EXPIRED;
      default:
        return false;
    }
  }

  public override toString(): string {
    return this.props.value;
  }
}

export enum PatentTypeEnum {
  UTILITY = 'UTILITY',
  DESIGN = 'DESIGN',
  PLANT = 'PLANT',
  PROVISIONAL = 'PROVISIONAL',
  OTHER = 'OTHER',
}

export class PatentType extends ValueObject<{ value: PatentTypeEnum }> {
  private constructor(value: PatentTypeEnum) {
    super({ value });
  }

  public get value(): PatentTypeEnum {
    return this.props.value;
  }

  public static create(type: PatentTypeEnum): PatentType {
    return new PatentType(type);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class Currency extends ValueObject<{ code: string }> {
  private constructor(code: string) {
    super({ code });
  }

  public get code(): string {
    return this.props.code;
  }

  public static create(code: string): Result<Currency> {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length !== 3) {
      return Result.fail<Currency>(`Invalid ISO currency code: ${code}`);
    }
    return Result.ok<Currency>(new Currency(trimmed));
  }

  public static from(code: string): Currency {
    return new Currency(code.trim().toUpperCase());
  }

  public override toString(): string {
    return this.props.code;
  }
}

export class FundingAmount extends ValueObject<{ amount: number; currency: Currency }> {
  private constructor(amount: number, currency: Currency) {
    super({ amount, currency });
  }

  public get amount(): number {
    return this.props.amount;
  }
  public get currency(): Currency {
    return this.props.currency;
  }

  public static create(amount: number, currency: Currency): Result<FundingAmount> {
    if (amount < 0) {
      return Result.fail<FundingAmount>('Funding amount cannot be negative.');
    }
    return Result.ok<FundingAmount>(new FundingAmount(amount, currency));
  }

  public static from(amount: number, currencyCode = 'USD'): FundingAmount {
    const currency = Currency.from(currencyCode);
    return new FundingAmount(Math.max(0, amount), currency);
  }

  public override toString(): string {
    return `${this.props.amount} ${this.props.currency.code}`;
  }
}

export class OrganizationName extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<OrganizationName> {
    const trimmed = name.trim();
    if (!trimmed) {
      return Result.fail<OrganizationName>('Organization name cannot be empty.');
    }
    return Result.ok<OrganizationName>(new OrganizationName(trimmed));
  }

  public static from(name: string): OrganizationName {
    return new OrganizationName(name.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ConferenceName extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<ConferenceName> {
    const trimmed = name.trim();
    if (!trimmed) {
      return Result.fail<ConferenceName>('Conference name cannot be empty.');
    }
    return Result.ok<ConferenceName>(new ConferenceName(trimmed));
  }

  public static from(name: string): ConferenceName {
    return new ConferenceName(name.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export enum AwardCategoryType {
  HONOR = 'HONOR',
  FELLOWSHIP = 'FELLOWSHIP',
  SCHOLARSHIP = 'SCHOLARSHIP',
  GRANT = 'GRANT',
  AWARD = 'AWARD',
  KEYNOTE = 'KEYNOTE',
  OTHER = 'OTHER',
}

export class AwardCategory extends ValueObject<{ value: AwardCategoryType }> {
  private constructor(value: AwardCategoryType) {
    super({ value });
  }

  public get value(): AwardCategoryType {
    return this.props.value;
  }

  public static create(category: AwardCategoryType): AwardCategory {
    return new AwardCategory(category);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ProfessionalRole extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(role: string): Result<ProfessionalRole> {
    const trimmed = role.trim();
    if (!trimmed) {
      return Result.fail<ProfessionalRole>('Professional role cannot be empty.');
    }
    return Result.ok<ProfessionalRole>(new ProfessionalRole(trimmed));
  }

  public static from(role: string): ProfessionalRole {
    return new ProfessionalRole(role.trim());
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class ActivityDate extends ValueObject<{ date: Date }> {
  private constructor(date: Date) {
    super({ date });
  }

  public get date(): Date {
    return this.props.date;
  }

  public static create(date: Date): Result<ActivityDate> {
    if (isNaN(date.getTime())) {
      return Result.fail<ActivityDate>('Invalid activity date.');
    }
    return Result.ok<ActivityDate>(new ActivityDate(date));
  }

  public static from(dateStrOrDate: string | Date): ActivityDate {
    const date = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;
    return new ActivityDate(isNaN(date.getTime()) ? new Date() : date);
  }

  public override toString(): string {
    return this.props.date.toISOString();
  }
}

export class Country extends ValueObject<{ code: string }> {
  private constructor(code: string) {
    super({ code });
  }

  public get code(): string {
    return this.props.code;
  }

  public static create(code: string): Result<Country> {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length !== 2) {
      return Result.fail<Country>(`Invalid ISO 3166-1 alpha-2 country code: ${code}`);
    }
    return Result.ok<Country>(new Country(trimmed));
  }

  public static from(code: string): Country {
    return new Country(code.trim().toUpperCase());
  }

  public override toString(): string {
    return this.props.code;
  }
}

export enum ActivityCategoryType {
  MEMBERSHIP = 'MEMBERSHIP',
  EDITORIAL = 'EDITORIAL',
  REVIEWER = 'REVIEWER',
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  KEYNOTE = 'KEYNOTE',
  SEMINAR = 'SEMINAR',
  INVITED_TALK = 'INVITED_TALK',
  SERVICE = 'SERVICE',
}
