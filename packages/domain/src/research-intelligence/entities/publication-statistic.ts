/**
 * PublicationStatistic Entity (Sprint 11)
 *
 * Represents publication statistics for a specific year.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface PublicationStatisticProps {
  year: number;
  count: number;
  firstAuthorCount: number;
  correspondingAuthorCount: number;
}

export class PublicationStatistic extends Entity<PublicationStatisticProps> {
  private constructor(props: PublicationStatisticProps, id?: UniqueId) {
    super(props, id);
  }

  public get year(): number {
    return this.props.year;
  }

  public get count(): number {
    return this.props.count;
  }

  public get publicationCount(): number {
    return this.props.count;
  }

  public get firstAuthorCount(): number {
    return this.props.firstAuthorCount;
  }

  public get correspondingAuthorCount(): number {
    return this.props.correspondingAuthorCount;
  }

  public static create(
    props: {
      year: number;
      count: number;
      firstAuthorCount?: number;
      correspondingAuthorCount?: number;
    },
    id?: UniqueId,
  ): Result<PublicationStatistic> {
    if (props.year < 1900 || props.year > 2100) {
      return Result.fail<PublicationStatistic>('Year must be between 1900 and 2100');
    }
    if (props.count < 0) {
      return Result.fail<PublicationStatistic>('Publication count cannot be negative');
    }

    return Result.ok<PublicationStatistic>(
      new PublicationStatistic(
        {
          year: props.year,
          count: props.count,
          firstAuthorCount: props.firstAuthorCount ?? 0,
          correspondingAuthorCount: props.correspondingAuthorCount ?? 0,
        },
        id,
      ),
    );
  }
}
