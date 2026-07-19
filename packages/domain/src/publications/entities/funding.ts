/**
 * Funding Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import type { FundingIdentifier } from '../value-objects/publication-value-objects.js';

export interface FundingProps {
  funderName: string;
  fundingIdentifier?: FundingIdentifier;
  grantTitle?: string;
  amountCurrency?: string;
  amountValue?: number;
}

export class Funding extends Entity<FundingProps> {
  private constructor(props: FundingProps, id?: UniqueId) {
    super(props, id);
  }

  public get funderName(): string {
    return this.props.funderName;
  }

  public get fundingIdentifier(): FundingIdentifier | undefined {
    return this.props.fundingIdentifier;
  }

  public get grantTitle(): string | undefined {
    return this.props.grantTitle;
  }

  public get amountCurrency(): string | undefined {
    return this.props.amountCurrency;
  }

  public get amountValue(): number | undefined {
    return this.props.amountValue;
  }

  public static create(
    props: {
      funderName: string;
      fundingIdentifier?: FundingIdentifier;
      grantTitle?: string;
      amountCurrency?: string;
      amountValue?: number;
    },
    id?: UniqueId,
  ): Result<Funding> {
    const nameTrimmed = props.funderName?.trim();
    if (!nameTrimmed) {
      return Result.fail<Funding>('Funder name cannot be empty.');
    }
    return Result.ok<Funding>(
      new Funding(
        {
          funderName: nameTrimmed,
          fundingIdentifier: props.fundingIdentifier,
          grantTitle: props.grantTitle?.trim(),
          amountCurrency: props.amountCurrency?.trim().toUpperCase(),
          amountValue: props.amountValue !== undefined ? Math.max(0, props.amountValue) : undefined,
        },
        id,
      ),
    );
  }
}
