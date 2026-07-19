/**
 * Publication Mapper
 */

import {
  Abstract,
  AffiliationSnapshot,
  Author,
  CitationCount,
  DOI,
  Funding,
  FundingIdentifier,
  ISBN,
  ISSN,
  Keywords,
  Language,
  ORCID,
  Publication,
  PublicationStatus,
  PublicationStatusType,
  PublicationTitle,
  PublicationType,
  PublicationTypeEnum,
  PublicationYear,
  Publisher,
  URL,
  Venue,
  VenueType,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

export interface PrismaPublicationFull {
  id: string;
  profileId: string;
  title: string;
  type: string;
  status: string;
  doi: string | null;
  isbn: string | null;
  abstract: string | null;
  keywords: string | null;
  year: number | null;
  citationCount: number;
  url: string | null;
  language: string | null;
  venueId: string | null;
  publisherId: string | null;
  submittedDate: Date | null;
  acceptedDate: Date | null;
  publishedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  venue?: {
    id: string;
    name: string;
    venueType: string;
    issn: string | null;
    isbn: string | null;
    publisherId: string | null;
    url: string | null;
  } | null;
  publisher?: {
    id: string;
    name: string;
    location: string | null;
    websiteUrl: string | null;
  } | null;
  authors?: Array<{
    id: string;
    publicationId: string;
    name: string;
    email: string | null;
    orcid: string | null;
    authorOrder: number;
    isCorresponding: boolean;
    affiliations?: Array<{
      id: string;
      authorId: string;
      institution: string;
      department: string | null;
      location: string | null;
    }>;
  }>;
  fundings?: Array<{
    id: string;
    publicationId: string;
    funderName: string;
    fundingIdentifier: string | null;
    grantTitle: string | null;
    amountCurrency: string | null;
    amountValue: number | null;
  }>;
}

export class PublicationMapper {
  public static toDomain(raw: PrismaPublicationFull): Publication {
    const profileId = UniqueId.from(raw.profileId);
    const title = PublicationTitle.from(raw.title);
    const type = PublicationType.from(raw.type as PublicationTypeEnum);
    const status = PublicationStatus.from(raw.status as PublicationStatusType);

    const doi = typeof raw.doi === 'string' && raw.doi.length > 0 ? DOI.from(raw.doi) : undefined;
    const isbn =
      typeof raw.isbn === 'string' && raw.isbn.length > 0 ? ISBN.from(raw.isbn) : undefined;
    const abstractVal =
      typeof raw.abstract === 'string' && raw.abstract.length > 0
        ? Abstract.from(raw.abstract)
        : undefined;
    const keywordsVal =
      typeof raw.keywords === 'string' && raw.keywords.length > 0
        ? Keywords.from(raw.keywords.split(', '))
        : undefined;
    const yearVal = raw.year !== null ? PublicationYear.from(raw.year) : undefined;
    const citationCount = CitationCount.from(raw.citationCount);
    const urlVal =
      typeof raw.url === 'string' && raw.url.length > 0 ? URL.from(raw.url) : undefined;
    const languageVal =
      typeof raw.language === 'string' && raw.language.length > 0
        ? Language.from(raw.language)
        : undefined;

    // Map Authors
    const authors: Author[] = [];
    if (raw.authors) {
      for (const a of raw.authors) {
        const affiliations: AffiliationSnapshot[] = [];
        if (a.affiliations) {
          for (const aff of a.affiliations) {
            const affRes = AffiliationSnapshot.create(
              {
                institution: aff.institution,
                department:
                  typeof aff.department === 'string' && aff.department.length > 0
                    ? aff.department
                    : undefined,
                location:
                  typeof aff.location === 'string' && aff.location.length > 0
                    ? aff.location
                    : undefined,
              },
              UniqueId.from(aff.id),
            );
            if (affRes.isSuccess) affiliations.push(affRes.value);
          }
        }

        const authorRes = Author.create(
          {
            name: a.name,
            email: typeof a.email === 'string' && a.email.length > 0 ? a.email : undefined,
            orcid:
              typeof a.orcid === 'string' && a.orcid.length > 0 ? ORCID.from(a.orcid) : undefined,
            authorOrder: a.authorOrder,
            isCorresponding: a.isCorresponding,
            affiliations,
          },
          UniqueId.from(a.id),
        );

        if (authorRes.isSuccess) {
          authors.push(authorRes.value);
        }
      }
    }

    // Map Venue
    let venue: Venue | undefined;
    if (raw.venue) {
      const vRes = Venue.create(
        {
          name: raw.venue.name,
          venueType: raw.venue.venueType as VenueType,
          issn:
            typeof raw.venue.issn === 'string' && raw.venue.issn.length > 0
              ? ISSN.from(raw.venue.issn)
              : undefined,
          isbn:
            typeof raw.venue.isbn === 'string' && raw.venue.isbn.length > 0
              ? ISBN.from(raw.venue.isbn)
              : undefined,
          publisherId: raw.venue.publisherId ?? undefined,
          url:
            typeof raw.venue.url === 'string' && raw.venue.url.length > 0
              ? URL.from(raw.venue.url)
              : undefined,
        },
        UniqueId.from(raw.venue.id),
      );
      if (vRes.isSuccess) venue = vRes.value;
    }

    // Map Publisher
    let publisher: Publisher | undefined;
    if (raw.publisher) {
      const pRes = Publisher.create(
        {
          name: raw.publisher.name,
          location:
            typeof raw.publisher.location === 'string' && raw.publisher.location.length > 0
              ? raw.publisher.location
              : undefined,
          websiteUrl:
            typeof raw.publisher.websiteUrl === 'string' && raw.publisher.websiteUrl.length > 0
              ? URL.from(raw.publisher.websiteUrl)
              : undefined,
        },
        UniqueId.from(raw.publisher.id),
      );
      if (pRes.isSuccess) publisher = pRes.value;
    }

    // Map Fundings
    const fundings: Funding[] = [];
    if (raw.fundings) {
      for (const f of raw.fundings) {
        const fRes = Funding.create(
          {
            funderName: f.funderName,
            fundingIdentifier:
              typeof f.fundingIdentifier === 'string' && f.fundingIdentifier.length > 0
                ? FundingIdentifier.from(f.fundingIdentifier)
                : undefined,
            grantTitle:
              typeof f.grantTitle === 'string' && f.grantTitle.length > 0
                ? f.grantTitle
                : undefined,
            amountCurrency:
              typeof f.amountCurrency === 'string' && f.amountCurrency.length > 0
                ? f.amountCurrency
                : undefined,
            amountValue: f.amountValue ?? undefined,
          },
          UniqueId.from(f.id),
        );
        if (fRes.isSuccess) fundings.push(fRes.value);
      }
    }

    const pubRes = Publication.create(
      {
        profileId,
        title,
        type,
        status,
        doi,
        isbn,
        abstract: abstractVal,
        keywords: keywordsVal,
        year: yearVal,
        citationCount,
        url: urlVal,
        language: languageVal,
        authors,
        venue,
        publisher,
        fundings,
        submittedDate: raw.submittedDate ?? undefined,
        acceptedDate: raw.acceptedDate ?? undefined,
        publishedDate: raw.publishedDate ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      UniqueId.from(raw.id),
    );

    if (pubRes.isFailure) {
      throw new Error(`Failed to map Publication from persistence: ${pubRes.error}`);
    }

    return pubRes.value;
  }

  public static toPersistence(pub: Publication): {
    id: string;
    profileId: string;
    title: string;
    type: PublicationTypeEnum;
    status: PublicationStatusType;
    doi: string | null;
    isbn: string | null;
    abstract: string | null;
    keywords: string | null;
    year: number | null;
    citationCount: number;
    url: string | null;
    language: string | null;
    venueId: string | null;
    publisherId: string | null;
    submittedDate: Date | null;
    acceptedDate: Date | null;
    publishedDate: Date | null;
  } {
    return {
      id: pub.id.value,
      profileId: pub.profileId.value,
      title: pub.title.value,
      type: pub.type.value,
      status: pub.status.value,
      doi: pub.doi?.value ?? null,
      isbn: pub.isbn?.value ?? null,
      abstract: pub.abstract?.value ?? null,
      keywords: pub.keywords ? pub.keywords.values.join(', ') : null,
      year: pub.year?.value ?? null,
      citationCount: pub.citationCount.value,
      url: pub.url?.value ?? null,
      language: pub.language?.value ?? null,
      venueId: pub.venue?.id.value ?? null,
      publisherId: pub.publisher?.id.value ?? null,
      submittedDate: pub.submittedDate ?? null,
      acceptedDate: pub.acceptedDate ?? null,
      publishedDate: pub.publishedDate ?? null,
    };
  }
}
