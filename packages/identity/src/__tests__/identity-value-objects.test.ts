import { describe, it, expect } from 'vitest';

import {
  ResearchStage,
  ResearchFocus,
  CollaborationType,
  ResearchStatus,
  ConfidenceLevel,
} from '../domain/value-objects/identity-value-objects.js';

// ─────────────────────────────────────────────────────────────────────────────
// ResearchStage
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchStage', () => {
  describe('valid construction', () => {
    const validStages = ['Undergraduate', 'Masters', 'PhD', 'Research Scientist'];

    for (const stage of validStages) {
      it(`should create ResearchStage with "${stage}"`, () => {
        const result = ResearchStage.create(stage);
        expect(result.isSuccess).toBe(true);
        expect(result.value.value).toBe(stage);
      });
    }
  });

  describe('whitespace trimming', () => {
    it('should trim leading and trailing whitespace', () => {
      const result = ResearchStage.create('  PhD  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('PhD');
    });
  });

  describe('invalid construction', () => {
    it('should reject empty string', () => {
      const result = ResearchStage.create('');
      expect(result.isFailure).toBe(true);
    });

    it('should reject whitespace-only string', () => {
      const result = ResearchStage.create('   ');
      expect(result.isFailure).toBe(true);
    });

    it('should reject invalid stage value', () => {
      const result = ResearchStage.create('PostDoc');
      expect(result.isFailure).toBe(true);
    });

    it('should reject case-mismatched value', () => {
      const result = ResearchStage.create('phd');
      expect(result.isFailure).toBe(true);
    });

    it('should provide descriptive error message', () => {
      const result = ResearchStage.create('Invalid');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Research Stage');
      expect(result.error).toContain('Invalid');
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
  });

  describe('immutability', () => {
    it('should expose value via getter only', () => {
      const stage = ResearchStage.create('PhD').value;
      expect(stage.value).toBe('PhD');
      expect(typeof stage.value).toBe('string');
    });
  });

  describe('serialization', () => {
    it('toString should return canonical value', () => {
      const stage = ResearchStage.create('Research Scientist').value;
      expect(stage.toString()).toBe('Research Scientist');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchFocus
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchFocus', () => {
  describe('valid construction', () => {
    it('should create with a valid focus string', () => {
      const result = ResearchFocus.create('Machine Learning');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Machine Learning');
    });

    it('should create with minimum length (1 char)', () => {
      const result = ResearchFocus.create('A');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('A');
    });

    it('should create with maximum length (200 chars)', () => {
      const maxFocus = 'A'.repeat(200);
      const result = ResearchFocus.create(maxFocus);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(maxFocus);
    });
  });

  describe('normalization', () => {
    it('should trim leading and trailing whitespace', () => {
      const result = ResearchFocus.create('  Quantum Computing  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Quantum Computing');
    });

    it('should preserve internal whitespace', () => {
      const result = ResearchFocus.create('Machine  Learning');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Machine  Learning');
    });
  });

  describe('invalid construction', () => {
    it('should reject empty string', () => {
      const result = ResearchFocus.create('');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('must not be empty');
    });

    it('should reject whitespace-only string', () => {
      const result = ResearchFocus.create('   ');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('must not be empty');
    });

    it('should reject string exceeding 200 characters', () => {
      const tooLong = 'A'.repeat(201);
      const result = ResearchFocus.create(tooLong);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('exceeds maximum length');
    });
  });

  describe('equality', () => {
    it('should be equal for same value', () => {
      const a = ResearchFocus.create('AI').value;
      const b = ResearchFocus.create('AI').value;
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const a = ResearchFocus.create('AI').value;
      const b = ResearchFocus.create('ML').value;
      expect(a.equals(b)).toBe(false);
    });

    it('should be equal after trimming yields same value', () => {
      const a = ResearchFocus.create('AI').value;
      const b = ResearchFocus.create('  AI  ').value;
      expect(a.equals(b)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('should expose value via getter only', () => {
      const focus = ResearchFocus.create('NLP').value;
      expect(focus.value).toBe('NLP');
      expect(typeof focus.value).toBe('string');
    });
  });

  describe('serialization', () => {
    it('toString should return trimmed value', () => {
      const focus = ResearchFocus.create('  Deep Learning  ').value;
      expect(focus.toString()).toBe('Deep Learning');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CollaborationType
// ─────────────────────────────────────────────────────────────────────────────

describe('CollaborationType', () => {
  describe('valid construction', () => {
    const validTypes = ['Individual', 'Academic', 'Industry'];

    for (const collabType of validTypes) {
      it(`should create CollaborationType with "${collabType}"`, () => {
        const result = CollaborationType.create(collabType);
        expect(result.isSuccess).toBe(true);
        expect(result.value.value).toBe(collabType);
      });
    }
  });

  describe('whitespace trimming', () => {
    it('should trim leading and trailing whitespace', () => {
      const result = CollaborationType.create('  Academic  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Academic');
    });
  });

  describe('invalid construction', () => {
    it('should reject empty string', () => {
      const result = CollaborationType.create('');
      expect(result.isFailure).toBe(true);
    });

    it('should reject invalid type', () => {
      const result = CollaborationType.create('Government');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Collaboration Type');
    });

    it('should reject case-mismatched value', () => {
      const result = CollaborationType.create('individual');
      expect(result.isFailure).toBe(true);
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
    it('should expose value via getter only', () => {
      const ct = CollaborationType.create('Individual').value;
      expect(ct.value).toBe('Individual');
      expect(typeof ct.value).toBe('string');
    });
  });

  describe('serialization', () => {
    it('toString should return canonical value', () => {
      const ct = CollaborationType.create('Industry').value;
      expect(ct.toString()).toBe('Industry');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchStatus', () => {
  describe('valid construction', () => {
    const validStatuses = ['Active', 'Exploratory', 'Archived'];

    for (const status of validStatuses) {
      it(`should create ResearchStatus with "${status}"`, () => {
        const result = ResearchStatus.create(status);
        expect(result.isSuccess).toBe(true);
        expect(result.value.value).toBe(status);
      });
    }
  });

  describe('whitespace trimming', () => {
    it('should trim leading and trailing whitespace', () => {
      const result = ResearchStatus.create('  Active  ');
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe('Active');
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
      expect(status.isActive).toBe(false);
      expect(status.isExploratory).toBe(true);
      expect(status.isArchived).toBe(false);
    });

    it('isArchived should return true for Archived', () => {
      const status = ResearchStatus.create('Archived').value;
      expect(status.isActive).toBe(false);
      expect(status.isExploratory).toBe(false);
      expect(status.isArchived).toBe(true);
    });
  });

  describe('invalid construction', () => {
    it('should reject empty string', () => {
      const result = ResearchStatus.create('');
      expect(result.isFailure).toBe(true);
    });

    it('should reject invalid status', () => {
      const result = ResearchStatus.create('Inactive');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Research Status');
    });

    it('should reject case-mismatched value', () => {
      const result = ResearchStatus.create('active');
      expect(result.isFailure).toBe(true);
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
    it('should expose value via getter only', () => {
      const status = ResearchStatus.create('Active').value;
      expect(status.value).toBe('Active');
      expect(typeof status.value).toBe('string');
    });
  });

  describe('serialization', () => {
    it('toString should return canonical value', () => {
      const status = ResearchStatus.create('Exploratory').value;
      expect(status.toString()).toBe('Exploratory');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ConfidenceLevel
// ─────────────────────────────────────────────────────────────────────────────

describe('ConfidenceLevel', () => {
  describe('valid construction', () => {
    for (let level = 1; level <= 5; level++) {
      it(`should create ConfidenceLevel with ${level}`, () => {
        const result = ConfidenceLevel.create(level);
        expect(result.isSuccess).toBe(true);
        expect(result.value.value).toBe(level);
      });
    }
  });

  describe('boundary values', () => {
    it('should accept minimum value (1)', () => {
      const result = ConfidenceLevel.create(1);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(1);
    });

    it('should accept maximum value (5)', () => {
      const result = ConfidenceLevel.create(5);
      expect(result.isSuccess).toBe(true);
      expect(result.value.value).toBe(5);
    });
  });

  describe('invalid construction', () => {
    it('should reject value below minimum (0)', () => {
      const result = ConfidenceLevel.create(0);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Confidence Level');
    });

    it('should reject value above maximum (6)', () => {
      const result = ConfidenceLevel.create(6);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Confidence Level');
    });

    it('should reject negative value', () => {
      const result = ConfidenceLevel.create(-1);
      expect(result.isFailure).toBe(true);
    });

    it('should reject floating point value', () => {
      const result = ConfidenceLevel.create(3.5);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid Confidence Level');
    });

    it('should reject NaN', () => {
      const result = ConfidenceLevel.create(Number.NaN);
      expect(result.isFailure).toBe(true);
    });

    it('should reject Infinity', () => {
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
    it('should expose value via getter only', () => {
      const cl = ConfidenceLevel.create(4).value;
      expect(cl.value).toBe(4);
      expect(typeof cl.value).toBe('number');
    });
  });

  describe('serialization', () => {
    it('toString should return string representation', () => {
      const cl = ConfidenceLevel.create(3).value;
      expect(cl.toString()).toBe('3');
    });
  });
});
