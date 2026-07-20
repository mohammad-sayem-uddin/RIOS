/**
 * CoAuthor Entity (Sprint 11)
 *
 * Represents a co-author relationship for a collaboration.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface CoAuthorProps {
  authorName: string;
  email?: string;
  orcid?: string;
  affiliation?: string;
  paperCount: number;
  profileId?: string;
}

export class CoAuthor extends Entity<CoAuthorProps> {
  private constructor(props: CoAuthorProps, id?: UniqueId) {
    super(props, id);
  }

  public get authorName(): string {
    return this.props.authorName;
  }

  public get email(): string | undefined {
    return this.props.email;
  }

  public get authorEmail(): string | undefined {
    return this.props.email;
  }

  public get orcid(): string | undefined {
    return this.props.orcid;
  }

  public get authorOrcid(): string | undefined {
    return this.props.orcid;
  }

  public get affiliation(): string | undefined {
    return this.props.affiliation;
  }

  public get paperCount(): number {
    return this.props.paperCount;
  }

  public get publicationCount(): number {
    return this.props.paperCount;
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public static create(
    props: {
      authorName: string;
      email?: string;
      authorEmail?: string;
      orcid?: string;
      authorOrcid?: string;
      affiliation?: string;
      paperCount?: number;
      publicationCount?: number;
      profileId?: string;
    },
    id?: UniqueId,
  ): Result<CoAuthor> {
    if (props.authorName.trim().length === 0) {
      return Result.fail<CoAuthor>('Author name cannot be empty');
    }
    if (props.authorName.length > 255) {
      return Result.fail<CoAuthor>('Author name cannot exceed 255 characters');
    }

    const email = props.email ?? props.authorEmail;
    const orcid = props.orcid ?? props.authorOrcid;
    const paperCount = props.paperCount ?? props.publicationCount ?? 1;

    return Result.ok<CoAuthor>(
      new CoAuthor(
        {
          authorName: props.authorName.trim(),
          email,
          orcid,
          affiliation: props.affiliation,
          paperCount,
          profileId: props.profileId,
        },
        id,
      ),
    );
  }
}
