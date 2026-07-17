import { describe, expect, it } from 'vitest';

import {
  // Value Objects
  ResearchStage,
  ResearchFocus,
  TimeHorizon,
  CollaborationType,
  ResearchStatus,
  ConfidenceLevel,
  ResearchVisionStatement,
  ResearchIdentitySummary,
  // Errors
  IdentityDomainError,
  IdentityInvariantViolationError,
  DuplicateEntityItemError,
  EntityItemNotFoundError,
  InvalidTimeHorizonError,
  InvalidResearchStageError,
  InvalidResearchFocusError,
  InvalidCollaborationTypeError,
  InvalidResearchStatusError,
  InvalidConfidenceLevelError,
  InvalidResearchVisionError,
  InvalidResearchIdentitySummaryError,
  // Entities
  ResearchVision,
  ResearchAgenda,
  ResearchArea,
  ResearchQuestion,
  ResearchPhilosophy,
  ResearchValues,
  ResearchEvolution,
  ResearchMilestone,
  ResearchGoal,
  ResearchContribution,
} from '../index.js';

describe('@rios/identity exports', () => {
  describe('Value Object exports', () => {
    it('exports ResearchStage', () => {
      expect(ResearchStage).toBeDefined();
      expect(typeof ResearchStage.create).toBe('function');
    });

    it('exports ResearchFocus', () => {
      expect(ResearchFocus).toBeDefined();
      expect(typeof ResearchFocus.create).toBe('function');
    });

    it('exports TimeHorizon', () => {
      expect(TimeHorizon).toBeDefined();
      expect(typeof TimeHorizon.create).toBe('function');
    });

    it('exports CollaborationType', () => {
      expect(CollaborationType).toBeDefined();
      expect(typeof CollaborationType.create).toBe('function');
    });

    it('exports ResearchStatus', () => {
      expect(ResearchStatus).toBeDefined();
      expect(typeof ResearchStatus.create).toBe('function');
    });

    it('exports ConfidenceLevel', () => {
      expect(ConfidenceLevel).toBeDefined();
      expect(typeof ConfidenceLevel.create).toBe('function');
    });

    it('exports ResearchVisionStatement', () => {
      expect(ResearchVisionStatement).toBeDefined();
      expect(typeof ResearchVisionStatement.create).toBe('function');
    });

    it('exports ResearchIdentitySummary', () => {
      expect(ResearchIdentitySummary).toBeDefined();
      expect(typeof ResearchIdentitySummary.create).toBe('function');
    });
  });

  describe('Error exports', () => {
    it('exports abstract IdentityDomainError', () => {
      expect(IdentityDomainError).toBeDefined();
    });

    it('exports IdentityInvariantViolationError', () => {
      expect(IdentityInvariantViolationError).toBeDefined();
    });

    it('exports DuplicateEntityItemError', () => {
      expect(DuplicateEntityItemError).toBeDefined();
    });

    it('exports EntityItemNotFoundError', () => {
      expect(EntityItemNotFoundError).toBeDefined();
    });

    it('exports InvalidTimeHorizonError', () => {
      expect(InvalidTimeHorizonError).toBeDefined();
    });

    it('exports InvalidResearchStageError', () => {
      expect(InvalidResearchStageError).toBeDefined();
    });

    it('exports InvalidResearchFocusError', () => {
      expect(InvalidResearchFocusError).toBeDefined();
    });

    it('exports InvalidCollaborationTypeError', () => {
      expect(InvalidCollaborationTypeError).toBeDefined();
    });

    it('exports InvalidResearchStatusError', () => {
      expect(InvalidResearchStatusError).toBeDefined();
    });

    it('exports InvalidConfidenceLevelError', () => {
      expect(InvalidConfidenceLevelError).toBeDefined();
    });

    it('exports InvalidResearchVisionError', () => {
      expect(InvalidResearchVisionError).toBeDefined();
    });

    it('exports InvalidResearchIdentitySummaryError', () => {
      expect(InvalidResearchIdentitySummaryError).toBeDefined();
    });
  });

  describe('Entity exports', () => {
    it('exports ResearchVision entity', () => {
      expect(ResearchVision).toBeDefined();
      expect(typeof ResearchVision.create).toBe('function');
      expect(typeof ResearchVision.reconstitute).toBe('function');
    });

    it('exports ResearchAgenda entity', () => {
      expect(ResearchAgenda).toBeDefined();
      expect(typeof ResearchAgenda.create).toBe('function');
      expect(typeof ResearchAgenda.reconstitute).toBe('function');
    });

    it('exports ResearchArea entity', () => {
      expect(ResearchArea).toBeDefined();
      expect(typeof ResearchArea.create).toBe('function');
    });

    it('exports ResearchQuestion entity', () => {
      expect(ResearchQuestion).toBeDefined();
      expect(typeof ResearchQuestion.create).toBe('function');
    });

    it('exports ResearchPhilosophy entity', () => {
      expect(ResearchPhilosophy).toBeDefined();
      expect(typeof ResearchPhilosophy.create).toBe('function');
    });

    it('exports ResearchValues entity', () => {
      expect(ResearchValues).toBeDefined();
      expect(typeof ResearchValues.create).toBe('function');
    });

    it('exports ResearchEvolution entity', () => {
      expect(ResearchEvolution).toBeDefined();
      expect(typeof ResearchEvolution.create).toBe('function');
    });

    it('exports ResearchMilestone entity', () => {
      expect(ResearchMilestone).toBeDefined();
      expect(typeof ResearchMilestone.create).toBe('function');
    });

    it('exports ResearchGoal entity', () => {
      expect(ResearchGoal).toBeDefined();
      expect(typeof ResearchGoal.create).toBe('function');
    });

    it('exports ResearchContribution entity', () => {
      expect(ResearchContribution).toBeDefined();
      expect(typeof ResearchContribution.create).toBe('function');
    });
  });
});
