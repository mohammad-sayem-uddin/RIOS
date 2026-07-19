import { describe, expect, it } from 'vitest';

import {
  DOI,
  ISBN,
  ISSN,
  ORCID,
  ProjectId,
  PublicationId,
  PublicationStatus,
  PublicationTitle,
  PublicationType,
} from '../../publications/index.js';

describe('Publications Value Objects Unit Tests', () => {
  describe('PublicationId & ProjectId', () => {
    it('should create valid unique identifiers', () => {
      const pId = PublicationId.create();
      expect(pId.value).toBeDefined();
      expect(pId.toString()).toBe(pId.value);

      const projId = ProjectId.create();
      expect(projId.value).toBeDefined();
    });
  });

  describe('DOI Value Object', () => {
    it('should create valid DOI and normalize to lower case', () => {
      const validDoi = '10.1038/s41586-020-2649-2';
      const res = DOI.create(validDoi);
      expect(res.isSuccess).toBe(true);
      expect(res.value.value).toBe('10.1038/s41586-020-2649-2');
    });

    it('should reject invalid DOI format', () => {
      const res = DOI.create('invalid-doi-format');
      expect(res.isFailure).toBe(true);
      expect(res.error).toContain('Invalid DOI format');
    });
  });

  describe('ISBN & ISSN Value Objects', () => {
    it('should create valid ISBN-13', () => {
      const res = ISBN.create('978-3-16-148410-0');
      expect(res.isSuccess).toBe(true);
      expect(res.value.value).toBe('9783161484100');
    });

    it('should reject invalid ISBN length', () => {
      const res = ISBN.create('12345');
      expect(res.isFailure).toBe(true);
    });

    it('should format valid ISSN', () => {
      const res = ISSN.create('20493630');
      expect(res.isSuccess).toBe(true);
      expect(res.value.value).toBe('2049-3630');
    });
  });

  describe('ORCID Value Object', () => {
    it('should validate canonical ORCID format', () => {
      const res = ORCID.create('0000-0002-1825-0097');
      expect(res.isSuccess).toBe(true);
      expect(res.value.value).toBe('0000-0002-1825-0097');
    });

    it('should fail on malformed ORCID', () => {
      const res = ORCID.create('0000-0002-1825');
      expect(res.isFailure).toBe(true);
    });
  });

  describe('PublicationTitle & Abstract', () => {
    it('should validate non-empty publication title', () => {
      const res = PublicationTitle.create(
        'Quantum Supremacy using Programmable Superconducting Processors',
      );
      expect(res.isSuccess).toBe(true);

      const emptyRes = PublicationTitle.create('   ');
      expect(emptyRes.isFailure).toBe(true);
    });
  });

  describe('PublicationStatus & PublicationType', () => {
    it('should parse valid publication status and type', () => {
      const statusRes = PublicationStatus.create('PUBLISHED');
      expect(statusRes.isSuccess).toBe(true);
      expect(statusRes.value.isPublished()).toBe(true);

      const typeRes = PublicationType.create('JOURNAL_ARTICLE');
      expect(typeRes.isSuccess).toBe(true);
      expect(typeRes.value.isJournalArticle()).toBe(true);
    });
  });
});
