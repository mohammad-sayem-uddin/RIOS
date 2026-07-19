/**
 * Author Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import type { ORCID } from '../value-objects/publication-value-objects.js';

import type { AffiliationSnapshot } from './affiliation-snapshot.js';

export interface AuthorProps {
  name: string;
  email?: string;
  orcid?: ORCID;
  authorOrder: number;
  isCorresponding: boolean;
  affiliations: AffiliationSnapshot[];
}

export class Author extends Entity<AuthorProps> {
  private constructor(props: AuthorProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get email(): string | undefined {
    return this.props.email;
  }

  public get orcid(): ORCID | undefined {
    return this.props.orcid;
  }

  public get authorOrder(): number {
    return this.props.authorOrder;
  }

  public get isCorresponding(): boolean {
    return this.props.isCorresponding;
  }

  public get affiliations(): AffiliationSnapshot[] {
    return [...this.props.affiliations];
  }

  public static create(
    props: {
      name: string;
      email?: string;
      orcid?: ORCID;
      authorOrder: number;
      isCorresponding?: boolean;
      affiliations?: AffiliationSnapshot[];
    },
    id?: UniqueId,
  ): Result<Author> {
    const nameTrimmed = props.name?.trim();
    if (!nameTrimmed) {
      return Result.fail<Author>('Author name cannot be empty.');
    }
    if (props.authorOrder < 1) {
      return Result.fail<Author>('Author order must be at least 1.');
    }

    return Result.ok<Author>(
      new Author(
        {
          name: nameTrimmed,
          email: props.email?.trim().toLowerCase(),
          orcid: props.orcid,
          authorOrder: Math.floor(props.authorOrder),
          isCorresponding: props.isCorresponding ?? false,
          affiliations: props.affiliations ?? [],
        },
        id,
      ),
    );
  }
}
