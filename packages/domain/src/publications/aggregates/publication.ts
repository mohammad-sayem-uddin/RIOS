/**
 * Publication Aggregate Root
 *
 * Central aggregate root of the Publications bounded context.
 * Manages academic publications and enforces invariants across authors, venues, and status transitions.
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import type { Author } from '../entities/author.js';
import type { Funding } from '../entities/funding.js';
import type { Publisher } from '../entities/publisher.js';
import type { Venue } from '../entities/venue.js';
import {
  PublicationCreated,
  PublicationPublished,
  PublicationSubmitted,
  PublicationUpdated,
} from '../events/publications-events.js';
import {
  Abstract,
  CitationCount,
  DOI,
  ISBN,
  Keywords,
  Language,
  PublicationId,
  PublicationStatus,
  PublicationTitle,
  PublicationType,
  PublicationYear,
  URL,
} from '../value-objects/publication-value-objects.js';

export interface PublicationProps {
  profileId: UniqueId;
  title: PublicationTitle;
  type: PublicationType;
  status: PublicationStatus;
  doi?: DOI;
  isbn?: ISBN;
  abstract?: Abstract;
  keywords?: Keywords;
  year?: PublicationYear;
  citationCount: CitationCount;
  url?: URL;
  language?: Language;
  authors: Author[];
  venue?: Venue;
  publisher?: Publisher;
  fundings: Funding[];
  submittedDate?: Date;
  acceptedDate?: Date;
  publishedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Publication extends AggregateRoot<PublicationProps> {
  private constructor(props: PublicationProps, id: UniqueId) {
    super(props, id);
  }

  public get publicationId(): PublicationId {
    return PublicationId.from(this._id.value);
  }

  public get profileId(): UniqueId {
    return this.props.profileId;
  }

  public get title(): PublicationTitle {
    return this.props.title;
  }

  public get type(): PublicationType {
    return this.props.type;
  }

  public get status(): PublicationStatus {
    return this.props.status;
  }

  public get doi(): DOI | undefined {
    return this.props.doi;
  }

  public get isbn(): ISBN | undefined {
    return this.props.isbn;
  }

  public get abstract(): Abstract | undefined {
    return this.props.abstract;
  }

  public get keywords(): Keywords | undefined {
    return this.props.keywords;
  }

  public get year(): PublicationYear | undefined {
    return this.props.year;
  }

  public get citationCount(): CitationCount {
    return this.props.citationCount;
  }

  public get url(): URL | undefined {
    return this.props.url;
  }

  public get language(): Language | undefined {
    return this.props.language;
  }

  public get authors(): Author[] {
    return [...this.props.authors].sort((a, b) => a.authorOrder - b.authorOrder);
  }

  public get venue(): Venue | undefined {
    return this.props.venue;
  }

  public get publisher(): Publisher | undefined {
    return this.props.publisher;
  }

  public get fundings(): Funding[] {
    return [...this.props.fundings];
  }

  public get submittedDate(): Date | undefined {
    return this.props.submittedDate;
  }

  public get acceptedDate(): Date | undefined {
    return this.props.acceptedDate;
  }

  public get publishedDate(): Date | undefined {
    return this.props.publishedDate;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static create(
    props: {
      profileId: UniqueId;
      title: PublicationTitle;
      type: PublicationType;
      status?: PublicationStatus;
      doi?: DOI;
      isbn?: ISBN;
      abstract?: Abstract;
      keywords?: Keywords;
      year?: PublicationYear;
      citationCount?: CitationCount;
      url?: URL;
      language?: Language;
      authors?: Author[];
      venue?: Venue;
      publisher?: Publisher;
      fundings?: Funding[];
      submittedDate?: Date;
      acceptedDate?: Date;
      publishedDate?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: UniqueId,
  ): Result<Publication> {
    const publicationId = id ?? UniqueId.create();
    const status = props.status ?? PublicationStatus.from('DRAFT');
    const citationCount = props.citationCount ?? CitationCount.from(0);
    const now = new Date();
    const createdAt = props.createdAt ?? now;
    const updatedAt = props.updatedAt ?? now;

    // Validate type specific invariants
    if (props.type.isJournalArticle() && props.venue && props.venue.venueType !== 'JOURNAL') {
      return Result.fail<Publication>('Journal Articles require a Journal Venue.');
    }
    if (props.type.isConferencePaper() && props.venue && props.venue.venueType !== 'CONFERENCE') {
      return Result.fail<Publication>('Conference Papers require a Conference Venue.');
    }
    if (props.type.isBook() && !props.isbn && !props.publisher && !props.venue) {
      return Result.fail<Publication>('Books require an ISBN, Publisher, or Venue.');
    }

    // Validate state dates invariant
    if (props.acceptedDate && props.publishedDate && props.acceptedDate > props.publishedDate) {
      return Result.fail<Publication>(
        'Accepted date must occur before or equal to Published date.',
      );
    }

    // Validate status invariant (Cannot be both Published and Under Review)
    if (status.isPublished() && status.isUnderReview()) {
      return Result.fail<Publication>('A publication cannot be both Published and Under Review.');
    }

    const publication = new Publication(
      {
        profileId: props.profileId,
        title: props.title,
        type: props.type,
        status,
        doi: props.doi,
        isbn: props.isbn,
        abstract: props.abstract,
        keywords: props.keywords,
        year: props.year,
        citationCount,
        url: props.url,
        language: props.language,
        authors: props.authors ?? [],
        venue: props.venue,
        publisher: props.publisher,
        fundings: props.fundings ?? [],
        submittedDate: props.submittedDate,
        acceptedDate: props.acceptedDate,
        publishedDate: props.publishedDate,
        createdAt,
        updatedAt,
      },
      publicationId,
    );

    if (!id) {
      publication.addDomainEvent(
        new PublicationCreated(
          publicationId.value,
          props.profileId.value,
          props.title.value,
          props.type.value,
        ),
      );
    }

    return Result.ok<Publication>(publication);
  }

  public updateTitle(title: PublicationTitle): Result<void> {
    this.props.title = title;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new PublicationUpdated(this._id.value, title.value));
    return Result.ok<void>();
  }

  public submit(submittedDate: Date): Result<void> {
    if (this.props.status.isPublished()) {
      return Result.fail<void>('Cannot submit an already published publication.');
    }
    this.props.status = PublicationStatus.from('SUBMITTED');
    this.props.submittedDate = submittedDate;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new PublicationSubmitted(this._id.value, submittedDate));
    return Result.ok<void>();
  }

  public accept(acceptedDate: Date): Result<void> {
    if (this.props.publishedDate && acceptedDate > this.props.publishedDate) {
      return Result.fail<void>('Accepted date cannot be after published date.');
    }
    this.props.status = PublicationStatus.from('ACCEPTED');
    this.props.acceptedDate = acceptedDate;
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public publish(publishedDate: Date): Result<void> {
    if (this.props.acceptedDate && publishedDate < this.props.acceptedDate) {
      return Result.fail<void>('Published date cannot be before accepted date.');
    }
    this.props.status = PublicationStatus.from('PUBLISHED');
    this.props.publishedDate = publishedDate;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new PublicationPublished(this._id.value, publishedDate));
    return Result.ok<void>();
  }

  public addAuthor(author: Author): Result<void> {
    // Check duplicate author email or ORCID
    if (typeof author.email === 'string' && author.email.length > 0) {
      const emailToMatch = author.email;
      const exists = this.props.authors.some((a) => a.email === emailToMatch);
      if (exists) {
        return Result.fail<void>(`Author with email ${author.email} already exists.`);
      }
    }
    if (author.orcid) {
      const exists = this.props.authors.some((a) => a.orcid?.value === author.orcid?.value);
      if (exists) {
        return Result.fail<void>(`Author with ORCID ${author.orcid.value} already exists.`);
      }
    }

    this.props.authors.push(author);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public removeAuthor(authorId: string): Result<void> {
    this.props.authors = this.props.authors.filter((a) => a.id.value !== authorId);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public addFunding(funding: Funding): Result<void> {
    this.props.fundings.push(funding);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }
}
