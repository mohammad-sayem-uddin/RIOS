/**
 * Venue Mapper
 */

import { ISBN, ISSN, URL, Venue, VenueType } from '@rios/domain';
import { UniqueId } from '@rios/shared';

export interface PrismaVenueRecord {
  id: string;
  name: string;
  venueType: string;
  issn: string | null;
  isbn: string | null;
  publisherId: string | null;
  url: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class VenueMapper {
  public static toDomain(raw: PrismaVenueRecord): Venue {
    let issn: ISSN | undefined;
    if (typeof raw.issn === 'string' && raw.issn.length > 0) {
      issn = ISSN.from(raw.issn);
    }

    let isbn: ISBN | undefined;
    if (typeof raw.isbn === 'string' && raw.isbn.length > 0) {
      isbn = ISBN.from(raw.isbn);
    }

    let url: URL | undefined;
    if (typeof raw.url === 'string' && raw.url.length > 0) {
      url = URL.from(raw.url);
    }

    const res = Venue.create(
      {
        name: raw.name,
        venueType: raw.venueType as VenueType,
        issn,
        isbn,
        publisherId: raw.publisherId ?? undefined,
        url,
      },
      UniqueId.from(raw.id),
    );

    if (res.isFailure) {
      throw new Error(`Failed to map Venue from persistence: ${res.error}`);
    }

    return res.value;
  }

  public static toPersistence(venue: Venue): {
    id: string;
    name: string;
    venueType: 'JOURNAL' | 'CONFERENCE' | 'OTHER';
    issn: string | null;
    isbn: string | null;
    publisherId: string | null;
    url: string | null;
  } {
    return {
      id: venue.id.value,
      name: venue.name,
      venueType: venue.venueType,
      issn: venue.issn?.value ?? null,
      isbn: venue.isbn?.value ?? null,
      publisherId: venue.publisherId ?? null,
      url: venue.url?.value ?? null,
    };
  }
}
