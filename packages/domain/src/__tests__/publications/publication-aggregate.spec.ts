import { UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  Author,
  Publication,
  PublicationTitle,
  PublicationType,
  Venue,
} from '../../publications/index.js';

describe('Publication Aggregate Root Unit Tests', () => {
  const profileId = UniqueId.create();
  const validTitle = PublicationTitle.create('Deep Residual Learning for Image Recognition').value;
  const validJournalType = PublicationType.create('JOURNAL_ARTICLE').value;

  it('should instantiate publication with default DRAFT status', () => {
    const pubRes = Publication.create({
      profileId,
      title: validTitle,
      type: validJournalType,
    });

    expect(pubRes.isSuccess).toBe(true);
    const pub = pubRes.value;
    expect(pub.status.value).toBe('DRAFT');
    expect(pub.citationCount.value).toBe(0);
    expect(pub.domainEvents.length).toBe(1);
    expect(pub.domainEvents[0].eventType).toBe('PublicationCreated');
  });

  it('should enforce state transitions and accepted/published date order invariant', () => {
    const pub = Publication.create({
      profileId,
      title: validTitle,
      type: validJournalType,
    }).value;

    const acceptedDate = new Date('2026-01-01');
    const publishedDate = new Date('2026-02-01');

    expect(pub.accept(acceptedDate).isSuccess).toBe(true);
    expect(pub.publish(publishedDate).isSuccess).toBe(true);
    expect(pub.status.isPublished()).toBe(true);

    // Cannot accept date after published date
    const invalidAcceptedDate = new Date('2026-03-01');
    expect(pub.accept(invalidAcceptedDate).isFailure).toBe(true);
  });

  it('should prevent duplicate authors with same email or ORCID', () => {
    const pub = Publication.create({
      profileId,
      title: validTitle,
      type: validJournalType,
    }).value;

    const author1 = Author.create({
      name: 'Alice Smith',
      email: 'alice@example.com',
      authorOrder: 1,
    }).value;

    const author2 = Author.create({
      name: 'Alice S.',
      email: 'alice@example.com',
      authorOrder: 2,
    }).value;

    expect(pub.addAuthor(author1).isSuccess).toBe(true);
    const dupRes = pub.addAuthor(author2);
    expect(dupRes.isFailure).toBe(true);
    expect(dupRes.error).toContain('already exists');
  });

  it('should enforce type invariant: Journal Article requires Journal venue if venue is supplied', () => {
    const confVenue = Venue.create({
      name: 'NeurIPS',
      venueType: 'CONFERENCE',
    }).value;

    const res = Publication.create({
      profileId,
      title: validTitle,
      type: validJournalType,
      venue: confVenue,
    });

    expect(res.isFailure).toBe(true);
    expect(res.error).toContain('Journal Articles require a Journal Venue');
  });
});
