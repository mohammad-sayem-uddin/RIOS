/**
 * CoAuthor Entity (Sprint 11)
 *
 * Represents a co-author relationship for a publication.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

export interface CoAuthorProps {
  id: string;
  profileId: string;
  authorName: string;
  authorEmail?: string;
  authorOrcid?: string;
  affiliation?: string;
  publicationCount: number;
  citationCount: number;
  hIndex?: number;
  isActive: boolean;
}

export class CoAuthor extends Entity<CoAuthorProps> {
  private constructor(props: CoAuthorProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get authorName(): string {
    return this.props.authorName;
  }

  public get authorEmail(): string | undefined {
    return this.props.authorEmail;
  }

  public get authorOrcid(): string | undefined {
    return this.props.authorOrcid;
  }

  public get affiliation(): string | undefined {
    return this.props.affiliation;
  }

  public get publicationCount(): number {
    return this.props.publicationCount;
  }

  public get citationCount(): number {
    return this.props.citationCount;
  }

  public get hIndex(): number | undefined {
    return this.props.hIndex;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public incrementPublicationCount(): void {
    this.props.publicationCount += 1;
  }

  public updateCitationCount(count: number): void {
    this.props.citationCount = count;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public static create(props: {
    id: string;
    profileId: string;
    authorName: string;
    authorEmail?: string;
    authorOrcid?: string;
    affiliation?: string;
    publicationCount?: number;
    citationCount?: number;
    hIndex?: number;
    isActive?: boolean;
  }): Result<CoAuthor> {
    if (props.authorName.trim().length === 0) {
      return Result.fail<CoAuthor>('Author name cannot be empty');
    }
    if (props.authorName.length > 255) {
      return Result.fail<CoAuthor>('Author name cannot exceed 255 characters');
    }
    if (props.profileId.trim().length === 0) {
      return Result.fail<CoAuthor>('Profile ID is required');
    }
    if (props.publicationCount !== undefined && props.publicationCount < 0) {
      return Result.fail<CoAuthor>('Publication count cannot be negative');
    }
    if (props.citationCount !== undefined && props.citationCount < 0) {
      return Result.fail<CoAuthor>('Citation count cannot be negative');
    }
    if (props.hIndex !== undefined && props.hIndex < 0) {
      return Result.fail<CoAuthor>('H-index cannot be negative');
    }

    return Result.ok<CoAuthor>(
      new CoAuthor({
        id: props.id,
        profileId: props.profileId.trim(),
        authorName: props.authorName.trim(),
        authorEmail: props.authorEmail,
        authorOrcid: props.authorOrcid,
        affiliation: props.affiliation,
        publicationCount: props.publicationCount ?? 0,
        citationCount: props.citationCount ?? 0,
        hIndex: props.hIndex,
        isActive: props.isActive ?? true,
      }),
    );
  }
}
