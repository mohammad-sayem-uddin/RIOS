/**
 * CitationStatistic Entity (Sprint 11)
 *
 * Represents citation statistics for a specific time period.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

export interface CitationStatisticProps {
  id: string;
  profileId: string;
  year: number;
  citationCount: number;
  selfCitationCount: number;
  hIndex: number;
  i10Index: number;
  h5Index?: number;
}

export class CitationStatistic extends Entity<CitationStatisticProps> {
  private constructor(props: CitationStatisticProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get year(): number {
    return this.props.year;
  }

  public get citationCount(): number {
    return this.props.citationCount;
  }

  public get selfCitationCount(): number {
    return this.props.selfCitationCount;
  }

  public get hIndex(): number {
    return this.props.hIndex;
  }

  public get i10Index(): number {
    return this.props.i10Index;
  }

  public get h5Index(): number | undefined {
    return this.props.h5Index;
  }

  public get netCitations(): number {
    return this.props.citationCount - this.props.selfCitationCount;
  }

  public static create(props: {
    id: string;
    profileId: string;
    year: number;
    citationCount: number;
    selfCitationCount: number;
    hIndex: number;
    i10Index: number;
    h5Index?: number;
  }): Result<CitationStatistic> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<CitationStatistic>('Profile ID is required');
    }
    if (props.year < 1900 || props.year > 2100) {
      return Result.fail<CitationStatistic>('Year must be between 1900 and 2100');
    }
    if (props.citationCount < 0) {
      return Result.fail<CitationStatistic>('Citation count cannot be negative');
    }
    if (props.selfCitationCount < 0) {
      return Result.fail<CitationStatistic>('Self-citation count cannot be negative');
    }
    if (props.selfCitationCount > props.citationCount) {
      return Result.fail<CitationStatistic>(
        'Self-citation count cannot exceed total citation count',
      );
    }
    if (props.hIndex < 0) {
      return Result.fail<CitationStatistic>('H-index cannot be negative');
    }
    if (props.i10Index < 0) {
      return Result.fail<CitationStatistic>('i10-index cannot be negative');
    }

    return Result.ok<CitationStatistic>(
      new CitationStatistic({
        id: props.id,
        profileId: props.profileId.trim(),
        year: props.year,
        citationCount: props.citationCount,
        selfCitationCount: props.selfCitationCount,
        hIndex: props.hIndex,
        i10Index: props.i10Index,
        h5Index: props.h5Index,
      }),
    );
  }
}
