import { describe, expect, it } from 'vitest';

import {
  DiscoveryCatalog,
  InstitutionProfile,
  ProfilePublishedEvent,
  ProfileSlug,
  PublicResearchProfile,
  RankingScore,
  ResearchCategory,
  SearchDocument,
  SearchIndex,
  VisibilityLevel,
  VisibilityState,
} from '../research-discovery/index.js';

describe('Discovery & Search Domain Model', () => {
  describe('Value Objects', () => {
    it('should create valid profile slug', () => {
      const result = ProfileSlug.create(' Jane Doe AI ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('jane-doe-ai');
    });

    it('should fail on empty profile slug', () => {
      const result = ProfileSlug.create('   ');
      expect(result.isFailure).toBe(true);
    });

    it('should create ranking score', () => {
      const score = RankingScore.create(0.95);
      expect(score.isSuccess).toBe(true);
      expect(score.value.value).toBe(0.95);
    });

    it('should handle visibility levels', () => {
      const pub = VisibilityLevel.publicLevel();
      expect(pub.isPublic()).toBe(true);
      expect(pub.state).toBe(VisibilityState.PUBLIC);
    });
  });

  describe('PublicResearchProfile Aggregate Root', () => {
    it('should create and publish a profile', () => {
      const slug = ProfileSlug.create('dr-smith').value;
      const profileResult = PublicResearchProfile.create({
        userId: 'user-123',
        slug,
        title: 'Dr. Smith Research Profile',
        headline: 'AI Lead',
        researchAreas: ['Machine Learning', 'NLP'],
        visibility: VisibilityLevel.privateLevel(),
        isPublished: false,
      });

      expect(profileResult.isSuccess).toBe(true);
      const profile = profileResult.value;

      const newSlug = ProfileSlug.create('dr-smith-published').value;
      profile.publish(newSlug);

      expect(profile.isPublished).toBe(true);
      expect(profile.visibility.isPublic()).toBe(true);
      expect(profile.slug.value).toBe('dr-smith-published');

      const events = profile.domainEvents;
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toBeInstanceOf(ProfilePublishedEvent);
    });
  });

  describe('SearchIndex Aggregate Root', () => {
    it('should add and manage search documents', () => {
      const index = SearchIndex.create('global-index').value;

      const doc = SearchDocument.create({
        documentType: 'PUBLICATION',
        entityId: 'pub-456',
        title: 'Deep Learning in Medicine',
        keywords: ['ai', 'health'],
        visibility: VisibilityLevel.publicLevel(),
      }).value;

      index.addDocument(doc);
      expect(index.documentCount).toBe(1);
      expect(index.documents[0].title).toBe('Deep Learning in Medicine');

      index.removeDocument('pub-456', 'PUBLICATION');
      expect(index.documentCount).toBe(0);
    });
  });

  describe('DiscoveryCatalog Aggregate Root', () => {
    it('should manage institution profiles and categories', () => {
      const catalog = DiscoveryCatalog.create('global-catalog').value;

      const inst = InstitutionProfile.create({
        name: 'MIT Laboratory',
        normalizedName: 'mit laboratory',
        departmentCount: 12,
        researcherCount: 450,
      }).value;

      catalog.addInstitution(inst);
      expect(catalog.institutionProfiles.length).toBe(1);

      const cat = ResearchCategory.create({
        name: 'Computer Science',
        slug: 'computer-science',
      }).value;

      catalog.addCategory(cat);
      expect(catalog.researchCategories.length).toBe(1);
    });
  });
});
