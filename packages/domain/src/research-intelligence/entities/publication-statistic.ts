/**
 * PublicationStatistic Entity (Sprint 11)
 *
 * Represents publication statistics for a specific time period.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

export interface PublicationStatisticProps {
  id: string;
  profileId: string;
  year: number;
  publicationCount: number;
  journalArticleCount: number;
  conferencePaperCount: number;
  bookCount: number;
  chapterCount: number;
  thesisCount: number;
  preprintCount: number;
  technicalReportCount: number;
  openAccessCount: number;
  peerReviewedCount: number;
}

export class PublicationStatistic extends Entity<PublicationStatisticProps> {
  private constructor(props: PublicationStatisticProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get year(): number {
    return this.props.year;
  }

  public get publicationCount(): number {
    return this.props.publicationCount;
  }

  public get journalArticleCount(): number {
    return this.props.journalArticleCount;
  }

  public get conferencePaperCount(): number {
    return this.props.conferencePaperCount;
  }

  public get bookCount(): number {
    return this.props.bookCount;
  }

  public get chapterCount(): number {
    return this.props.chapterCount;
  }

  public get thesisCount(): number {
    return this.props.thesisCount;
  }

  public get preprintCount(): number {
    return this.props.preprintCount;
  }

  public get technicalReportCount(): number {
    return this.props.technicalReportCount;
  }

  public get openAccessCount(): number {
    return this.props.openAccessCount;
  }

  public get peerReviewedCount(): number {
    return this.props.peerReviewedCount;
  }

  public static create(props: {
    id: string;
    profileId: string;
    year: number;
    publicationCount: number;
    journalArticleCount: number;
    conferencePaperCount: number;
    bookCount: number;
    chapterCount: number;
    thesisCount: number;
    preprintCount: number;
    technicalReportCount: number;
    openAccessCount: number;
    peerReviewedCount: number;
  }): Result<PublicationStatistic> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<PublicationStatistic>('Profile ID is required');
    }
    if (props.year < 1900 || props.year > 2100) {
      return Result.fail<PublicationStatistic>('Year must be between 1900 and 2100');
    }
    if (props.publicationCount < 0) {
      return Result.fail<PublicationStatistic>('Publication count cannot be negative');
    }

    return Result.ok<PublicationStatistic>(
      new PublicationStatistic({
        id: props.id,
        profileId: props.profileId.trim(),
        year: props.year,
        publicationCount: props.publicationCount,
        journalArticleCount: props.journalArticleCount,
        conferencePaperCount: props.conferencePaperCount,
        bookCount: props.bookCount,
        chapterCount: props.chapterCount,
        thesisCount: props.thesisCount,
        preprintCount: props.preprintCount,
        technicalReportCount: props.technicalReportCount,
        openAccessCount: props.openAccessCount,
        peerReviewedCount: props.peerReviewedCount,
      }),
    );
  }
}
