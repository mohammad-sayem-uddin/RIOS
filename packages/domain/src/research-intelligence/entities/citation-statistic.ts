/**
 * CitationStatistic Entity (Sprint 11)
 *
 * Represents citation statistics for a specific time period/year.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface CitationStatisticProps {
  year: number;
  citationCount: number;
  citationsPerPaper: number;
  selfCitationCount?: number;
  hIndex?: number;
  i10Index?: number;
  profileId?: string;
}

export class CitationStatistic extends Entity<CitationStatisticProps> {
  private constructor(props: CitationStatisticProps, id?: UniqueId) {
    super(props, id);
  }

  public get year(): number {
    return this.props.year;
  }

  public get citationCount(): number {
    return this.props.citationCount;
  }

  public get citationsPerPaper(): number {
    return this.props.citationsPerPaper;
  }

  public get selfCitationCount(): number | undefined {
    return this.props.selfCitationCount;
  }

  public get hIndex(): number | undefined {
    return this.props.hIndex;
  }

  public get i10Index(): number | undefined {
    return this.props.i10Index;
  }

  public get profileId(): string | undefined {
    return this.props.profileId;
  }

  public static create(
    props: {
      year: number;
      citationCount: number;
      citationsPerPaper?: number;
      selfCitationCount?: number;
      hIndex?: number;
      i10Index?: number;
      profileId?: string;
    },
    id?: UniqueId,
  ): Result<CitationStatistic> {
    if (props.year < 1900 || props.year > 2100) {
      return Result.fail<CitationStatistic>('Year must be between 1900 and 2100');
    }
    if (props.citationCount < 0) {
      return Result.fail<CitationStatistic>('Citation count cannot be negative');
    }

    return Result.ok<CitationStatistic>(
      new CitationStatistic(
        {
          year: props.year,
          citationCount: props.citationCount,
          citationsPerPaper: props.citationsPerPaper ?? 0.0,
          selfCitationCount: props.selfCitationCount,
          hIndex: props.hIndex,
          i10Index: props.i10Index,
          profileId: props.profileId,
        },
        id,
      ),
    );
  }
}
