import { describe, it, expect } from 'vitest';

import {
  ResearchStage,
  ResearchFocus,
  CollaborationType,
  ResearchStatus,
  ConfidenceLevel,
  ResearchVisionStatement,
  ResearchIdentitySummary,
} from '../domain/value-objects/identity-value-objects.js';

// ─────────────────────────────────────────────────────────────────────────────
// ResearchStage
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchStage', () => {
  describe('valid construction', () => {
    it('should create with valid stage "Undergraduate"', () => {
      const result = ResearchStage.create('Undergraduate');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Undergraduate');
    });

    it('should create with valid stage "Masters"', () => {
      const result = ResearchStage.create('Masters');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Masters');
    });

    it('should create with valid stage "PhD"', () => {
      const result = ResearchStage.create('PhD');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('PhD');
    });

    it('should create with valid stage "Research Scientist"', () => {
      const result = ResearchStage.create('Research Scientist');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Research Scientist');
    });

    it('should trim whitespace', () => {
      const result = ResearchStage.create('  PhD  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('PhD');
    });
  });

  describe('invalid construction', () => {
    it('should fail with invalid stage', () => {
      const result = ResearchStage.create('PostDoc');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Research Stage');
    });

    it('should fail with empty string', () => {
      const result = ResearchStage.create('');
      expect(result.isFailure).toBe(true);
    });

    it('should fail with case-sensitive mismatch', () => {
      const result = ResearchStage.create('phd');
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = ResearchStage.create('PhD').value;
      const b = ResearchStage.create('PhD').value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = ResearchStage.create('PhD').value;
      const b = ResearchStage.create('Masters').value;
      expect(a.equals(b)).toBe(false);
    });

    it('should not be equal to null', () => {
      const a = ResearchStage.create('PhD').value;
      expect(a.equals(null as never)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have frozen props', () => {
      const stage = ResearchStage.create('PhD').value;
      expect(Object.isFrozen(stage)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('toString should return the string value', () => {
      const stage = ResearchStage.create('PhD').value;
      expect(stage.toString()).toBe('PhD');
    });

    it('toJSON should return a plain object', () => {
      const stage = ResearchStage.create('PhD').value;
      expect(stage.toJSON()).toEqual({ value: 'PhD' });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchFocus
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchFocus', () => {
  describe('valid construction', () => {
    it('should create with valid string', () => {
      const result = ResearchFocus.create('Trustworthy AI');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Trustworthy AI');
    });

    it('should trim leading and trailing whitespace', () => {
      const result = ResearchFocus.create('  Trustworthy AI  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Trustworthy AI');
    });

    it('should accept single character', () => {
      const result = ResearchFocus.create('A');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('A');
    });

    it('should accept exactly 200 characters', () => {
      const value = 'A'.repeat(200);
      const result = ResearchFocus.create(value);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(value);
    });
  });

  describe('invalid construction', () => {
    it('should fail with null', () => {
      const result = ResearchFocus.create(null as never);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('null or undefined');
    });

    it('should fail with undefined', () => {
      const result = ResearchFocus.create(undefined as never);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('null or undefined');
    });

    it('should fail with empty string', () => {
      const result = ResearchFocus.create('');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should fail with whitespace-only string', () => {
      const result = ResearchFocus.create('   ');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should fail exceeding max length', () => {
      const result = ResearchFocus.create('A'.repeat(201));
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('maximum length');
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = ResearchFocus.create('Trustworthy AI').value;
      const b = ResearchFocus.create('Trustworthy AI').value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = ResearchFocus.create('Trustworthy AI').value;
      const b = ResearchFocus.create('Computer Vision').value;
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have frozen props', () => {
      const focus = ResearchFocus.create('Trustworthy AI').value;
      expect(Object.isFrozen(focus)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('toString should return the string value', () => {
      const focus = ResearchFocus.create('Trustworthy AI').value;
      expect(focus.toString()).toBe('Trustworthy AI');
    });

    it('toJSON should return a plain object', () => {
      const focus = ResearchFocus.create('Trustworthy AI').value;
      expect(focus.toJSON()).toEqual({ value: 'Trustworthy AI' });
    });
  });

  describe('normalization', () => {
    it('should collapse internal whitespace only via trim', () => {
      const result = ResearchFocus.create('  Trustworthy   AI  ');
      expect(result.isSuccess).toBe(true);
      // trim() only removes leading/trailing
      expect(result.value.value).toBe('Trustworthy   AI');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CollaborationType
// ─────────────────────────────────────────────────────────────────────────────

describe('CollaborationType', () => {
  describe('valid construction', () => {
    it('should create with "Individual"', () => {
      const result = CollaborationType.create('Individual');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Individual');
    });

    it('should create with "Academic"', () => {
      const result = CollaborationType.create('Academic');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Academic');
    });

    it('should create with "Industry"', () => {
      const result = CollaborationType.create('Industry');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Industry');
    });

    it('should trim whitespace', () => {
      const result = CollaborationType.create('  Academic  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Academic');
    });
  });

  describe('invalid construction', () => {
    it('should fail with invalid type', () => {
      const result = CollaborationType.create('Government');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Collaboration Type');
    });

    it('should fail with empty string', () => {
      const result = CollaborationType.create('');
      expect(result.isFailure).toBe(true);
    });

    it('should fail with case-sensitive mismatch', () => {
      const result = CollaborationType.create('individual');
      expect(result.isFailure).toBe(true);
    });
  });

  describe('convenience getters', () => {
    it('isIndividual should return true for Individual', () => {
      const ct = CollaborationType.create('Individual').value;
      expect(ct.isIndividual).toBe(true);
      expect(ct.isAcademic).toBe(false);
      expect(ct.isIndustry).toBe(false);
    });

    it('isAcademic should return true for Academic', () => {
      const ct = CollaborationType.create('Academic').value;
      expect(ct.isAcademic).toBe(true);
      expect(ct.isIndividual).toBe(false);
      expect(ct.isIndustry).toBe(false);
    });

    it('isIndustry should return true for Industry', () => {
      const ct = CollaborationType.create('Industry').value;
      expect(ct.isIndustry).toBe(true);
      expect(ct.isIndividual).toBe(false);
      expect(ct.isAcademic).toBe(false);
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = CollaborationType.create('Academic').value;
      const b = CollaborationType.create('Academic').value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = CollaborationType.create('Academic').value;
      const b = CollaborationType.create('Industry').value;
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have frozen props', () => {
      const ct = CollaborationType.create('Academic').value;
      expect(Object.isFrozen(ct)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('toString should return the string value', () => {
      const ct = CollaborationType.create('Academic').value;
      expect(ct.toString()).toBe('Academic');
    });

    it('toJSON should return a plain object', () => {
      const ct = CollaborationType.create('Academic').value;
      expect(ct.toJSON()).toEqual({ value: 'Academic' });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchStatus', () => {
  describe('valid construction', () => {
    it('should create with "Active"', () => {
      const result = ResearchStatus.create('Active');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Active');
    });

    it('should create with "Exploratory"', () => {
      const result = ResearchStatus.create('Exploratory');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Exploratory');
    });

    it('should create with "Archived"', () => {
      const result = ResearchStatus.create('Archived');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Archived');
    });

    it('should trim whitespace', () => {
      const result = ResearchStatus.create('  Active  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Active');
    });
  });

  describe('invalid construction', () => {
    it('should fail with invalid status', () => {
      const result = ResearchStatus.create('Inactive');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Research Status');
    });

    it('should fail with empty string', () => {
      const result = ResearchStatus.create('');
      expect(result.isFailure).toBe(true);
    });

    it('should fail with case-sensitive mismatch', () => {
      const result = ResearchStatus.create('active');
      expect(result.isFailure).toBe(true);
    });
  });

  describe('convenience getters', () => {
    it('isActive should return true for Active', () => {
      const status = ResearchStatus.create('Active').value;
      expect(status.isActive).toBe(true);
      expect(status.isExploratory).toBe(false);
      expect(status.isArchived).toBe(false);
    });

    it('isExploratory should return true for Exploratory', () => {
      const status = ResearchStatus.create('Exploratory').value;
      expect(status.isExploratory).toBe(true);
      expect(status.isActive).toBe(false);
      expect(status.isArchived).toBe(false);
    });

    it('isArchived should return true for Archived', () => {
      const status = ResearchStatus.create('Archived').value;
      expect(status.isArchived).toBe(true);
      expect(status.isActive).toBe(false);
      expect(status.isExploratory).toBe(false);
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = ResearchStatus.create('Active').value;
      const b = ResearchStatus.create('Active').value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = ResearchStatus.create('Active').value;
      const b = ResearchStatus.create('Archived').value;
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have frozen props', () => {
      const status = ResearchStatus.create('Active').value;
      expect(Object.isFrozen(status)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('toString should return the string value', () => {
      const status = ResearchStatus.create('Active').value;
      expect(status.toString()).toBe('Active');
    });

    it('toJSON should return a plain object', () => {
      const status = ResearchStatus.create('Active').value;
      expect(status.toJSON()).toEqual({ value: 'Active' });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ConfidenceLevel
// ─────────────────────────────────────────────────────────────────────────────

describe('ConfidenceLevel', () => {
  describe('valid construction', () => {
    it('should create with minimum value 1', () => {
      const result = ConfidenceLevel.create(1);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(1);
    });

    it('should create with maximum value 5', () => {
      const result = ConfidenceLevel.create(5);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(5);
    });

    it('should create with mid-range value 3', () => {
      const result = ConfidenceLevel.create(3);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(3);
    });
  });

  describe('invalid construction', () => {
    it('should fail with value below minimum', () => {
      const result = ConfidenceLevel.create(0);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Confidence Level');
    });

    it('should fail with negative value', () => {
      const result = ConfidenceLevel.create(-1);
      expect(result.isFailure).toBe(true);
    });

    it('should fail with value above maximum', () => {
      const result = ConfidenceLevel.create(6);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Confidence Level');
    });

    it('should fail with floating point value', () => {
      const result = ConfidenceLevel.create(3.5);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Confidence Level');
    });

    it('should fail with NaN', () => {
      const result = ConfidenceLevel.create(Number.NaN);
      expect(result.isFailure).toBe(true);
    });

    it('should fail with Infinity', () => {
      const result = ConfidenceLevel.create(Number.POSITIVE_INFINITY);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = ConfidenceLevel.create(3).value;
      const b = ConfidenceLevel.create(3).value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = ConfidenceLevel.create(3).value;
      const b = ConfidenceLevel.create(4).value;
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have frozen props', () => {
      const cl = ConfidenceLevel.create(3).value;
      expect(Object.isFrozen(cl)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('toString should return the string representation', () => {
      const cl = ConfidenceLevel.create(3).value;
      expect(cl.toString()).toBe('3');
    });

    it('toJSON should return a plain object', () => {
      const cl = ConfidenceLevel.create(3).value;
      expect(cl.toJSON()).toEqual({ value: 3 });
    });
  });

  describe('edge cases', () => {
    it('should accept boundary value 1', () => {
      const result = ConfidenceLevel.create(1);
      expect(result.isSuccess).toBe(true);
    });

    it('should reject boundary value 0', () => {
      const result = ConfidenceLevel.create(0);
      expect(result.isFailure).toBe(true);
    });

    it('should accept boundary value 5', () => {
      const result = ConfidenceLevel.create(5);
      expect(result.isSuccess).toBe(true);
    });

    it('should reject boundary value 6', () => {
      const result = ConfidenceLevel.create(6);
      expect(result.isFailure).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchVision
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchVisionStatement', () => {
  describe('valid construction', () => {
    it('should create with valid string', () => {
      const result = ResearchVisionStatement.create(
        'Advancing trustworthy AI through rigorous formal verification.',
      );
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(
        'Advancing trustworthy AI through rigorous formal verification.',
      );
    });

    it('should trim leading and trailing whitespace', () => {
      const result = ResearchVisionStatement.create('  Advancing trustworthy AI  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Advancing trustworthy AI');
    });

    it('should accept single character', () => {
      const result = ResearchVisionStatement.create('A');
      expect(result.isSuccess).toBe(true);
    });

    it('should accept exactly 2000 characters', () => {
      const value = 'A'.repeat(2000);
      const result = ResearchVisionStatement.create(value);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(value);
    });
  });

  describe('invalid construction', () => {
    it('should fail with null', () => {
      const result = ResearchVisionStatement.create(null as never);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('null or undefined');
    });

    it('should fail with undefined', () => {
      const result = ResearchVisionStatement.create(undefined as never);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('null or undefined');
    });

    it('should fail with empty string', () => {
      const result = ResearchVisionStatement.create('');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should fail with whitespace-only string', () => {
      const result = ResearchVisionStatement.create('   ');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should fail exceeding max length', () => {
      const result = ResearchVisionStatement.create('A'.repeat(2001));
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('maximum length');
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = ResearchVisionStatement.create('Advancing trustworthy AI.').value;
      const b = ResearchVisionStatement.create('Advancing trustworthy AI.').value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = ResearchVisionStatement.create('Advancing trustworthy AI.').value;
      const b = ResearchVisionStatement.create('Improving medical imaging.').value;
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have frozen props', () => {
      const vision = ResearchVisionStatement.create('Advancing trustworthy AI.').value;
      expect(Object.isFrozen(vision)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('toString should return the string value', () => {
      const vision = ResearchVisionStatement.create('Advancing trustworthy AI.').value;
      expect(vision.toString()).toBe('Advancing trustworthy AI.');
    });

    it('toJSON should return a plain object', () => {
      const vision = ResearchVisionStatement.create('Advancing trustworthy AI.').value;
      expect(vision.toJSON()).toEqual({ value: 'Advancing trustworthy AI.' });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchIdentitySummary
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchIdentitySummary', () => {
  describe('valid construction', () => {
    it('should create with valid string', () => {
      const result = ResearchIdentitySummary.create(
        'A researcher specializing in trustworthy AI and formal verification.',
      );
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(
        'A researcher specializing in trustworthy AI and formal verification.',
      );
    });

    it('should trim leading and trailing whitespace', () => {
      const result = ResearchIdentitySummary.create('  Summary of research  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Summary of research');
    });

    it('should accept single character', () => {
      const result = ResearchIdentitySummary.create('A');
      expect(result.isSuccess).toBe(true);
    });

    it('should accept exactly 500 characters', () => {
      const value = 'A'.repeat(500);
      const result = ResearchIdentitySummary.create(value);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(value);
    });
  });

  describe('invalid construction', () => {
    it('should fail with null', () => {
      const result = ResearchIdentitySummary.create(null as never);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('null or undefined');
    });

    it('should fail with undefined', () => {
      const result = ResearchIdentitySummary.create(undefined as never);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('null or undefined');
    });

    it('should fail with empty string', () => {
      const result = ResearchIdentitySummary.create('');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should fail with whitespace-only string', () => {
      const result = ResearchIdentitySummary.create('   ');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should fail exceeding max length', () => {
      const result = ResearchIdentitySummary.create('A'.repeat(501));
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('maximum length');
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = ResearchIdentitySummary.create('Summary text.').value;
      const b = ResearchIdentitySummary.create('Summary text.').value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = ResearchIdentitySummary.create('Summary A.').value;
      const b = ResearchIdentitySummary.create('Summary B.').value;
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should have frozen props', () => {
      const summary = ResearchIdentitySummary.create('Summary text.').value;
      expect(Object.isFrozen(summary)).toBe(true);
    });
  });

  describe('serialization', () => {
    it('toString should return the string value', () => {
      const summary = ResearchIdentitySummary.create('Summary text.').value;
      expect(summary.toString()).toBe('Summary text.');
    });

    it('toJSON should return a plain object', () => {
      const summary = ResearchIdentitySummary.create('Summary text.').value;
      expect(summary.toJSON()).toEqual({ value: 'Summary text.' });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-cutting: Value Object principles
// ─────────────────────────────────────────────────────────────────────────────

describe('Value Object principles', () => {
  it('should use structural equality, not reference equality', () => {
    const a = ResearchStage.create('PhD').value;
    const b = ResearchStage.create('PhD').value;
    expect(a === b).toBe(false); // different references
    expect(a.equals(b)).toBe(true); // structural equality
  });

  it('all VOs should be serializable via JSON.stringify', () => {
    const stage = ResearchStage.create('PhD').value;
    const focus = ResearchFocus.create('AI').value;
    const collab = CollaborationType.create('Academic').value;
    const status = ResearchStatus.create('Active').value;
    const confidence = ConfidenceLevel.create(3).value;
    const vision = ResearchVisionStatement.create('Long-term direction.').value;
    const summary = ResearchIdentitySummary.create('Identity summary.').value;

    expect(() => JSON.stringify(stage.toJSON())).not.toThrow();
    expect(() => JSON.stringify(focus.toJSON())).not.toThrow();
    expect(() => JSON.stringify(collab.toJSON())).not.toThrow();
    expect(() => JSON.stringify(status.toJSON())).not.toThrow();
    expect(() => JSON.stringify(confidence.toJSON())).not.toThrow();
    expect(() => JSON.stringify(vision.toJSON())).not.toThrow();
    expect(() => JSON.stringify(summary.toJSON())).not.toThrow();
  });

  it('equality should be symmetric', () => {
    const a = ResearchFocus.create('AI Safety').value;
    const b = ResearchFocus.create('AI Safety').value;
    expect(a.equals(b)).toBe(b.equals(a));
  });

  it('equality should be reflexive', () => {
    const a = ResearchFocus.create('AI Safety').value;
    expect(a.equals(a)).toBe(true);
  });

  it('equality should be transitive', () => {
    const a = ResearchFocus.create('AI Safety').value;
    const b = ResearchFocus.create('AI Safety').value;
    const c = ResearchFocus.create('AI Safety').value;
    expect(a.equals(b)).toBe(true);
    expect(b.equals(c)).toBe(true);
    expect(a.equals(c)).toBe(true);
  });

  it('equality should fail gracefully across different VO types', () => {
    const stage = ResearchStage.create('PhD').value;
    const focus = ResearchFocus.create('PhD').value;
    // Different constructor names, should not be equal
    expect(stage.equals(focus as never)).toBe(false);
  });
});
