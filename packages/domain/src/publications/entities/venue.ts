/**
 * Venue Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import type { ISBN, ISSN, URL } from '../value-objects/publication-value-objects.js';

export type VenueType = 'JOURNAL' | 'CONFERENCE' | 'OTHER';

export interface VenueProps {
  name: string;
  venueType: VenueType;
  issn?: ISSN;
  isbn?: ISBN;
  publisherId?: string;
  url?: URL;
}

export class Venue extends Entity<VenueProps> {
  private constructor(props: VenueProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get venueType(): VenueType {
    return this.props.venueType;
  }

  public get issn(): ISSN | undefined {
    return this.props.issn;
  }

  public get isbn(): ISBN | undefined {
    return this.props.isbn;
  }

  public get publisherId(): string | undefined {
    return this.props.publisherId;
  }

  public get url(): URL | undefined {
    return this.props.url;
  }

  public static create(
    props: {
      name: string;
      venueType: VenueType;
      issn?: ISSN;
      isbn?: ISBN;
      publisherId?: string;
      url?: URL;
    },
    id?: UniqueId,
  ): Result<Venue> {
    const trimmedName = props.name?.trim();
    if (!trimmedName) {
      return Result.fail<Venue>('Venue name cannot be empty.');
    }
    return Result.ok<Venue>(
      new Venue(
        {
          name: trimmedName,
          venueType: props.venueType,
          issn: props.issn,
          isbn: props.isbn,
          publisherId: props.publisherId,
          url: props.url,
        },
        id,
      ),
    );
  }
}
