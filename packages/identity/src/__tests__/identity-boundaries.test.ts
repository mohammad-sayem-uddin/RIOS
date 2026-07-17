import { DomainError, ValueObject } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  ConfidenceLevel,
  CollaborationType,
  ResearchFocus,
  ResearchIdentitySummary,
  ResearchStage,
  ResearchStatus,
  ResearchVisionStatement,
  IdentityDomainError,
  InvalidResearchStageError,
  InvalidResearchFocusError,
  InvalidCollaborationTypeError,
  InvalidResearchStatusError,
  InvalidConfidenceLevelError,
  InvalidResearchVisionError,
  InvalidResearchIdentitySummaryError,
} from '../index.js';

describe('@rios/identity package boundaries', () => {
  describe('Value Objects extend shared ValueObject primitive', () => {
    it('ResearchStage extends ValueObject', () => {
      expect(ResearchStage.prototype).toBeInstanceOf(ValueObject);
    });

    it('ResearchFocus extends ValueObject', () => {
      expect(ResearchFocus.prototype).toBeInstanceOf(ValueObject);
    });

    it('CollaborationType extends ValueObject', () => {
      expect(CollaborationType.prototype).toBeInstanceOf(ValueObject);
    });

    it('ResearchStatus extends ValueObject', () => {
      expect(ResearchStatus.prototype).toBeInstanceOf(ValueObject);
    });

    it('ConfidenceLevel extends ValueObject', () => {
      expect(ConfidenceLevel.prototype).toBeInstanceOf(ValueObject);
    });

    it('ResearchVisionStatement extends ValueObject', () => {
      expect(ResearchVisionStatement.prototype).toBeInstanceOf(ValueObject);
    });

    it('ResearchIdentitySummary extends ValueObject', () => {
      expect(ResearchIdentitySummary.prototype).toBeInstanceOf(ValueObject);
    });
  });

  describe('Domain errors extend shared DomainError hierarchy', () => {
    it('IdentityDomainError extends DomainError', () => {
      expect(IdentityDomainError.prototype).toBeInstanceOf(DomainError);
    });

    it('InvalidResearchStageError extends IdentityDomainError', () => {
      expect(InvalidResearchStageError.prototype).toBeInstanceOf(IdentityDomainError);
    });

    it('InvalidResearchFocusError extends IdentityDomainError', () => {
      expect(InvalidResearchFocusError.prototype).toBeInstanceOf(IdentityDomainError);
    });

    it('InvalidCollaborationTypeError extends IdentityDomainError', () => {
      expect(InvalidCollaborationTypeError.prototype).toBeInstanceOf(IdentityDomainError);
    });

    it('InvalidResearchStatusError extends IdentityDomainError', () => {
      expect(InvalidResearchStatusError.prototype).toBeInstanceOf(IdentityDomainError);
    });

    it('InvalidConfidenceLevelError extends IdentityDomainError', () => {
      expect(InvalidConfidenceLevelError.prototype).toBeInstanceOf(IdentityDomainError);
    });

    it('InvalidResearchVisionError extends IdentityDomainError', () => {
      expect(InvalidResearchVisionError.prototype).toBeInstanceOf(IdentityDomainError);
    });

    it('InvalidResearchIdentitySummaryError extends IdentityDomainError', () => {
      expect(InvalidResearchIdentitySummaryError.prototype).toBeInstanceOf(IdentityDomainError);
    });

    it('all concrete errors extend DomainError through the hierarchy', () => {
      const errors = [
        InvalidResearchStageError,
        InvalidResearchFocusError,
        InvalidCollaborationTypeError,
        InvalidResearchStatusError,
        InvalidConfidenceLevelError,
        InvalidResearchVisionError,
        InvalidResearchIdentitySummaryError,
      ];
      for (const Err of errors) {
        expect(Err.prototype).toBeInstanceOf(DomainError);
      }
    });
  });
});
