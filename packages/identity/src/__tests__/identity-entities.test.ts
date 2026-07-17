/**
 * Comprehensive unit tests for Identity Domain Entities.
 *
 * Tests verify:
 * - Creation (valid and invalid)
 * - Identity equality
 * - State transitions
 * - Valid mutations
 * - Invalid mutations
 * - Relationship management
 * - Collection encapsulation
 * - Invariant protection
 * - Boundary conditions
 * - Error handling
 */

import { UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import { ResearchAgenda } from '../domain/entities/research-agenda.js';
import { ResearchArea } from '../domain/entities/research-area.js';
import { ResearchContribution } from '../domain/entities/research-contribution.js';
import { ResearchEvolution } from '../domain/entities/research-evolution.js';
import { ResearchGoal } from '../domain/entities/research-goal.js';
import { ResearchMilestone } from '../domain/entities/research-milestone.js';
import { ResearchPhilosophy } from '../domain/entities/research-philosophy.js';
import { ResearchQuestion } from '../domain/entities/research-question.js';
import { ResearchValues } from '../domain/entities/research-values.js';
import { ResearchVision } from '../domain/entities/research-vision.js';
import {
  ResearchVisionStatement,
  ResearchFocus,
  TimeHorizon,
  ConfidenceLevel,
  ResearchStatus,
} from '../domain/value-objects/identity-value-objects.js';

// ─── Helpers ───────────────────────────────────────────────────────────

const NOW = '2025-01-15T10:00:00Z';
const LATER = '2025-06-15T10:00:00Z';

function createVisionVO(text = 'Advancing autonomous systems'): ResearchVisionStatement {
  return ResearchVisionStatement.create(text).value;
}

function createFocusVO(text = 'Computer Vision'): ResearchFocus {
  return ResearchFocus.create(text).value;
}

function createTimeHorizonVO(horizon = '10-20 years'): TimeHorizon {
  return TimeHorizon.create(horizon).value;
}

// ConfidenceLevel takes a number 1-5
function createConfidenceVO(level: number = 4): ConfidenceLevel {
  return ConfidenceLevel.create(level).value;
}

function createStatusVO(status: 'Active' | 'Exploratory' | 'Archived' = 'Active'): ResearchStatus {
  return ResearchStatus.create(status).value;
}

// ─── ResearchVision Entity ─────────────────────────────────────────────

describe('ResearchVision Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchVision', () => {
      const result = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      const entity = result.value;
      expect(entity.vision.value).toBe('Advancing autonomous systems');
      expect(entity.timeHorizon.value).toBe('10-20 years');
      expect(entity.createdAt).toBe(NOW);
      expect(entity.lastRefinedAt).toBe(NOW);
    });

    it('should fail with empty createdAt', () => {
      const result = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: '',
      });
      expect(result.isFailure).toBe(true);
    });

    it('should have a unique identity', () => {
      const entity1 = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: NOW,
      }).value;
      const entity2 = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: NOW,
      }).value;
      expect(entity1.id.equals(entity2.id)).toBe(false);
    });
  });

  describe('Identity Equality', () => {
    it('should be equal when reconstituted with same ID', () => {
      const id = UniqueId.create();
      const entity1 = ResearchVision.reconstitute({
        id,
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        lastRefinedAt: NOW,
        createdAt: NOW,
      });
      const entity2 = ResearchVision.reconstitute({
        id,
        vision: createVisionVO('Different vision'),
        timeHorizon: createTimeHorizonVO('5-10 years'),
        lastRefinedAt: LATER,
        createdAt: NOW,
      });
      expect(entity1.equals(entity2)).toBe(true);
    });

    it('should not be equal when different IDs', () => {
      const entity1 = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: NOW,
      }).value;
      const entity2 = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: NOW,
      }).value;
      expect(entity1.equals(entity2)).toBe(false);
    });
  });

  describe('Behavior', () => {
    it('should refine the vision', () => {
      const entity = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: NOW,
      }).value;
      const newVision = createVisionVO('New refined vision');
      entity.refine(newVision, LATER);
      expect(entity.vision.value).toBe('New refined vision');
      expect(entity.lastRefinedAt).toBe(LATER);
    });

    it('should update time horizon', () => {
      const entity = ResearchVision.create({
        vision: createVisionVO(),
        timeHorizon: createTimeHorizonVO(),
        createdAt: NOW,
      }).value;
      const newHorizon = createTimeHorizonVO('5-10 years');
      entity.updateTimeHorizon(newHorizon);
      expect(entity.timeHorizon.value).toBe('5-10 years');
    });
  });
});

// ─── ResearchAgenda Entity ─────────────────────────────────────────────

describe('ResearchAgenda Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchAgenda', () => {
      const result = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.focus.value).toBe('Computer Vision');
      expect(result.value.status.value).toBe('Active');
      expect(result.value.areaIds).toHaveLength(0);
      expect(result.value.themes).toHaveLength(0);
    });

    it('should fail with empty createdAt', () => {
      const result = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Area Management', () => {
    it('should add a research area', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      const areaId = UniqueId.create();
      const result = agenda.addArea(areaId, LATER);
      expect(result.isSuccess).toBe(true);
      expect(agenda.areaIds).toHaveLength(1);
      expect(agenda.hasArea(areaId)).toBe(true);
    });

    it('should prevent duplicate area IDs', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      const areaId = UniqueId.create();
      agenda.addArea(areaId, LATER);
      const result = agenda.addArea(areaId, LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate');
    });

    it('should remove a research area', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      const areaId = UniqueId.create();
      agenda.addArea(areaId, LATER);
      const result = agenda.removeArea(areaId, LATER);
      expect(result.isSuccess).toBe(true);
      expect(agenda.areaIds).toHaveLength(0);
      expect(agenda.hasArea(areaId)).toBe(false);
    });

    it('should fail to remove non-existent area', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      const result = agenda.removeArea(UniqueId.create(), LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not found');
    });
  });

  describe('Theme Management', () => {
    it('should add a theme', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      const result = agenda.addTheme('Explainability', LATER);
      expect(result.isSuccess).toBe(true);
      expect(agenda.themes).toContain('Explainability');
    });

    it('should prevent duplicate themes (case-insensitive)', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      agenda.addTheme('Explainability', LATER);
      const result = agenda.addTheme('explainability', LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate');
    });

    it('should reject empty themes', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      const result = agenda.addTheme('', LATER);
      expect(result.isFailure).toBe(true);
    });

    it('should remove a theme', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      agenda.addTheme('Explainability', LATER);
      const result = agenda.removeTheme('Explainability', LATER);
      expect(result.isSuccess).toBe(true);
      expect(agenda.hasTheme('Explainability')).toBe(false);
    });

    it('should fail to remove non-existent theme', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      const result = agenda.removeTheme('NonExistent', LATER);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('State Transitions', () => {
    it('should update focus', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      agenda.updateFocus(createFocusVO('Robotics'), LATER);
      expect(agenda.focus.value).toBe('Robotics');
      expect(agenda.updatedAt).toBe(LATER);
    });

    it('should update status', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      agenda.updateStatus(createStatusVO('Exploratory'), LATER);
      expect(agenda.status.value).toBe('Exploratory');
    });
  });

  describe('Collection Encapsulation', () => {
    it('should return readonly area IDs', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      agenda.addArea(UniqueId.create(), LATER);
      const ids = agenda.areaIds;
      // Object.freeze prevents push on the returned copy
      expect(() => {
        (ids as unknown as UniqueId[]).push(UniqueId.create());
      }).toThrow();
    });

    it('should return readonly themes', () => {
      const agenda = ResearchAgenda.create({
        focus: createFocusVO(),
        status: createStatusVO(),
        createdAt: NOW,
      }).value;
      agenda.addTheme('Test', LATER);
      const themes = agenda.themes;
      expect(() => {
        (themes as unknown as string[]).push('new');
      }).toThrow();
    });
  });
});

// ─── ResearchArea Entity ───────────────────────────────────────────────

describe('ResearchArea Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchArea', () => {
      const result = ResearchArea.create({
        name: createFocusVO('Computer Vision'),
        description: createFocusVO('Visual perception research'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        createdAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.name.value).toBe('Computer Vision');
      expect(result.value.description.value).toBe('Visual perception research');
      expect(result.value.questionIds).toHaveLength(0);
    });

    it('should fail with empty createdAt', () => {
      const result = ResearchArea.create({
        name: createFocusVO(),
        description: createFocusVO(),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        createdAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Question Management', () => {
    it('should add and remove questions', () => {
      const area = ResearchArea.create({
        name: createFocusVO(),
        description: createFocusVO(),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        createdAt: NOW,
      }).value;
      const qId = UniqueId.create();
      expect(area.addQuestion(qId, LATER).isSuccess).toBe(true);
      expect(area.hasQuestion(qId)).toBe(true);
      expect(area.questionIds).toHaveLength(1);

      expect(area.removeQuestion(qId, LATER).isSuccess).toBe(true);
      expect(area.hasQuestion(qId)).toBe(false);
      expect(area.questionIds).toHaveLength(0);
    });

    it('should prevent duplicate questions', () => {
      const area = ResearchArea.create({
        name: createFocusVO(),
        description: createFocusVO(),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        createdAt: NOW,
      }).value;
      const qId = UniqueId.create();
      area.addQuestion(qId, LATER);
      const result = area.addQuestion(qId, LATER);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('State Transitions', () => {
    it('should update name, description, status, confidence', () => {
      const area = ResearchArea.create({
        name: createFocusVO('CV'),
        description: createFocusVO('Desc'),
        status: createStatusVO(),
        confidence: createConfidenceVO(1),
        createdAt: NOW,
      }).value;

      area.updateName(createFocusVO('Computer Vision'), LATER);
      expect(area.name.value).toBe('Computer Vision');

      area.updateDescription(createFocusVO('New description'), LATER);
      expect(area.description.value).toBe('New description');

      area.updateStatus(createStatusVO('Archived'), LATER);
      expect(area.status.value).toBe('Archived');

      area.updateConfidence(createConfidenceVO(5), LATER);
      expect(area.confidence.value).toBe(5);
    });
  });
});

// ─── ResearchQuestion Entity ───────────────────────────────────────────

describe('ResearchQuestion Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchQuestion', () => {
      const result = ResearchQuestion.create({
        question: createFocusVO('How do neural networks generalize?'),
        motivation: createFocusVO('Understanding generalization'),
        status: createStatusVO(),
        confidence: createConfidenceVO(3),
        createdAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.question.value).toBe('How do neural networks generalize?');
      expect(result.value.motivation.value).toBe('Understanding generalization');
    });

    it('should fail with empty createdAt', () => {
      const result = ResearchQuestion.create({
        question: createFocusVO('Q?'),
        motivation: createFocusVO('M'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        createdAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should refine question', () => {
      const q = ResearchQuestion.create({
        question: createFocusVO('Original question?'),
        motivation: createFocusVO('Motivation'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        createdAt: NOW,
      }).value;
      q.refineQuestion(createFocusVO('Refined question?'), LATER);
      expect(q.question.value).toBe('Refined question?');
      expect(q.updatedAt).toBe(LATER);
    });

    it('should update motivation', () => {
      const q = ResearchQuestion.create({
        question: createFocusVO('Q?'),
        motivation: createFocusVO('Old motivation'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        createdAt: NOW,
      }).value;
      q.updateMotivation(createFocusVO('New motivation'), LATER);
      expect(q.motivation.value).toBe('New motivation');
    });

    it('should update status and confidence', () => {
      const q = ResearchQuestion.create({
        question: createFocusVO('Q?'),
        motivation: createFocusVO('M'),
        status: createStatusVO(),
        confidence: createConfidenceVO(1),
        createdAt: NOW,
      }).value;
      q.updateStatus(createStatusVO('Archived'), LATER);
      expect(q.status.value).toBe('Archived');
      q.updateConfidence(createConfidenceVO(5), LATER);
      expect(q.confidence.value).toBe(5);
    });
  });
});

// ─── ResearchPhilosophy Entity ─────────────────────────────────────────

describe('ResearchPhilosophy Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchPhilosophy', () => {
      const result = ResearchPhilosophy.create({
        statement: createVisionVO('Science-first approach'),
        createdAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.statement.value).toBe('Science-first approach');
      expect(result.value.principles).toHaveLength(0);
    });

    it('should fail with empty createdAt', () => {
      const result = ResearchPhilosophy.create({
        statement: createVisionVO('Test'),
        createdAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Principle Management', () => {
    it('should add and remove principles', () => {
      const phil = ResearchPhilosophy.create({
        statement: createVisionVO('Test'),
        createdAt: NOW,
      }).value;
      expect(phil.addPrinciple('Simplicity', LATER).isSuccess).toBe(true);
      expect(phil.hasPrinciple('simplicity')).toBe(true);
      expect(phil.principles).toHaveLength(1);

      expect(phil.removePrinciple('Simplicity', LATER).isSuccess).toBe(true);
      expect(phil.hasPrinciple('Simplicity')).toBe(false);
    });

    it('should prevent duplicate principles (case-insensitive)', () => {
      const phil = ResearchPhilosophy.create({
        statement: createVisionVO('Test'),
        createdAt: NOW,
      }).value;
      phil.addPrinciple('Simplicity', LATER);
      const result = phil.addPrinciple('simplicity', LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate');
    });

    it('should reject empty principles', () => {
      const phil = ResearchPhilosophy.create({
        statement: createVisionVO('Test'),
        createdAt: NOW,
      }).value;
      expect(phil.addPrinciple('', LATER).isFailure).toBe(true);
    });

    it('should fail to remove non-existent principle', () => {
      const phil = ResearchPhilosophy.create({
        statement: createVisionVO('Test'),
        createdAt: NOW,
      }).value;
      expect(phil.removePrinciple('NonExistent', LATER).isFailure).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should refine statement', () => {
      const phil = ResearchPhilosophy.create({
        statement: createVisionVO('Original'),
        createdAt: NOW,
      }).value;
      phil.refineStatement(createVisionVO('Refined'), LATER);
      expect(phil.statement.value).toBe('Refined');
      expect(phil.updatedAt).toBe(LATER);
    });
  });
});

// ─── ResearchValues Entity ─────────────────────────────────────────────

describe('ResearchValues Entity', () => {
  describe('Creation', () => {
    it('should create valid ResearchValues', () => {
      const result = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity', 'Openness'],
        createdAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.values).toHaveLength(2);
      expect(result.value.values).toContain('Integrity');
      expect(result.value.values).toContain('Openness');
    });

    it('should fail with empty values array', () => {
      const result = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: [],
        createdAt: NOW,
      });
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('At least one value');
    });

    it('should fail with empty string in values', () => {
      const result = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity', ''],
        createdAt: NOW,
      });
      expect(result.isFailure).toBe(true);
    });

    it('should fail with empty createdAt', () => {
      const result = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity'],
        createdAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Value Management', () => {
    it('should add a value', () => {
      const rv = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity'],
        createdAt: NOW,
      }).value;
      expect(rv.addValue('Transparency', LATER).isSuccess).toBe(true);
      expect(rv.hasValue('Transparency')).toBe(true);
    });

    it('should prevent duplicate values (case-insensitive)', () => {
      const rv = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity'],
        createdAt: NOW,
      }).value;
      const result = rv.addValue('integrity', LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate');
    });

    it('should remove a value', () => {
      const rv = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity', 'Openness'],
        createdAt: NOW,
      }).value;
      expect(rv.removeValue('Integrity', LATER).isSuccess).toBe(true);
      expect(rv.values).toHaveLength(1);
    });

    it('should not remove the last value', () => {
      const rv = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity'],
        createdAt: NOW,
      }).value;
      const result = rv.removeValue('Integrity', LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('last value');
    });

    it('should fail to remove non-existent value', () => {
      const rv = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity'],
        createdAt: NOW,
      }).value;
      expect(rv.removeValue('NonExistent', LATER).isFailure).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should refine statement', () => {
      const rv = ResearchValues.create({
        statement: createVisionVO('Original'),
        values: ['V1'],
        createdAt: NOW,
      }).value;
      rv.refineStatement(createVisionVO('Refined'), LATER);
      expect(rv.statement.value).toBe('Refined');
    });
  });

  describe('Collection Encapsulation', () => {
    it('should return readonly values', () => {
      const rv = ResearchValues.create({
        statement: createVisionVO('Core values'),
        values: ['Integrity'],
        createdAt: NOW,
      }).value;
      const vals = rv.values;
      expect(() => {
        (vals as unknown as string[]).push('new');
      }).toThrow();
    });
  });
});

// ─── ResearchEvolution Entity ──────────────────────────────────────────

describe('ResearchEvolution Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchEvolution', () => {
      const result = ResearchEvolution.create({
        description: createFocusVO('Shifted from NLP to CV'),
        status: createStatusVO('Active'),
        confidence: createConfidenceVO(5),
        recordedAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.description.value).toBe('Shifted from NLP to CV');
      expect(result.value.milestoneIds).toHaveLength(0);
    });

    it('should fail with empty recordedAt', () => {
      const result = ResearchEvolution.create({
        description: createFocusVO('Test'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        recordedAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Milestone Management', () => {
    it('should add and remove milestones', () => {
      const evo = ResearchEvolution.create({
        description: createFocusVO('Evolution'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        recordedAt: NOW,
      }).value;
      const mId = UniqueId.create();
      expect(evo.addMilestone(mId).isSuccess).toBe(true);
      expect(evo.hasMilestone(mId)).toBe(true);
      expect(evo.milestoneIds).toHaveLength(1);

      expect(evo.removeMilestone(mId).isSuccess).toBe(true);
      expect(evo.hasMilestone(mId)).toBe(false);
    });

    it('should prevent duplicate milestones', () => {
      const evo = ResearchEvolution.create({
        description: createFocusVO('Evolution'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        recordedAt: NOW,
      }).value;
      const mId = UniqueId.create();
      evo.addMilestone(mId);
      const result = evo.addMilestone(mId);
      expect(result.isFailure).toBe(true);
    });

    it('should fail to remove non-existent milestone', () => {
      const evo = ResearchEvolution.create({
        description: createFocusVO('Evolution'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        recordedAt: NOW,
      }).value;
      expect(evo.removeMilestone(UniqueId.create()).isFailure).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should update description and confidence', () => {
      const evo = ResearchEvolution.create({
        description: createFocusVO('Old description'),
        status: createStatusVO(),
        confidence: createConfidenceVO(1),
        recordedAt: NOW,
      }).value;
      evo.updateDescription(createFocusVO('New description'), LATER);
      expect(evo.description.value).toBe('New description');
      evo.updateConfidence(createConfidenceVO(5));
      expect(evo.confidence.value).toBe(5);
    });
  });
});

// ─── ResearchMilestone Entity ──────────────────────────────────────────

describe('ResearchMilestone Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchMilestone', () => {
      const result = ResearchMilestone.create({
        description: createFocusVO('First paper published'),
        confidence: createConfidenceVO(5),
        occurredAt: '2024-06-15',
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.description.value).toBe('First paper published');
      expect(result.value.occurredAt).toBe('2024-06-15');
    });

    it('should fail with empty occurredAt', () => {
      const result = ResearchMilestone.create({
        description: createFocusVO('Test'),
        confidence: createConfidenceVO(),
        occurredAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should reassess confidence', () => {
      const ms = ResearchMilestone.create({
        description: createFocusVO('Milestone'),
        confidence: createConfidenceVO(3),
        occurredAt: '2024-01-01',
      }).value;
      ms.reassessConfidence(createConfidenceVO(5));
      expect(ms.confidence.value).toBe(5);
    });
  });
});

// ─── ResearchGoal Entity ───────────────────────────────────────────────

describe('ResearchGoal Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchGoal', () => {
      const result = ResearchGoal.create({
        description: createFocusVO('Publish 3 papers'),
        status: createStatusVO('Active'),
        confidence: createConfidenceVO(3),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.description.value).toBe('Publish 3 papers');
      expect(result.value.isCompleted).toBe(false);
      expect(result.value.completedAt).toBeNull();
    });

    it('should fail with empty deadlineAt', () => {
      const result = ResearchGoal.create({
        description: createFocusVO('Test'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '',
        createdAt: NOW,
      });
      expect(result.isFailure).toBe(true);
    });

    it('should fail with empty createdAt', () => {
      const result = ResearchGoal.create({
        description: createFocusVO('Test'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Completion Lifecycle', () => {
    it('should mark as completed', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Publish 3 papers'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      const result = goal.markCompleted(LATER);
      expect(result.isSuccess).toBe(true);
      expect(goal.isCompleted).toBe(true);
      expect(goal.completedAt).toBe(LATER);
    });

    it('should not complete an already completed goal', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Publish 3 papers'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      goal.markCompleted(LATER);
      const result = goal.markCompleted('2025-07-01T00:00:00Z');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('already completed');
    });
  });

  describe('Completed Goal Invariants', () => {
    it('should not update description of completed goal', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Publish 3 papers'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      goal.markCompleted(LATER);
      const result = goal.updateDescription(createFocusVO('New description'), LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('completed goal');
    });

    it('should not update deadline of completed goal', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Publish 3 papers'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      goal.markCompleted(LATER);
      const result = goal.updateDeadline('2026-12-31', LATER);
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('completed goal');
    });

    it('should still update status and confidence of completed goal', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Publish 3 papers'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      goal.markCompleted(LATER);
      goal.updateStatus(createStatusVO('Archived'), LATER);
      expect(goal.status.value).toBe('Archived');
      goal.updateConfidence(createConfidenceVO(5), LATER);
      expect(goal.confidence.value).toBe(5);
    });
  });

  describe('Active Goal Mutations', () => {
    it('should update description of active goal', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Old description'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      const result = goal.updateDescription(createFocusVO('New description'), LATER);
      expect(result.isSuccess).toBe(true);
      expect(goal.description.value).toBe('New description');
    });

    it('should update deadline of active goal', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Test'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      const result = goal.updateDeadline('2026-06-30', LATER);
      expect(result.isSuccess).toBe(true);
      expect(goal.deadlineAt).toBe('2026-06-30');
    });

    it('should reject empty deadline update', () => {
      const goal = ResearchGoal.create({
        description: createFocusVO('Test'),
        status: createStatusVO(),
        confidence: createConfidenceVO(),
        deadlineAt: '2025-12-31',
        createdAt: NOW,
      }).value;
      const result = goal.updateDeadline('', LATER);
      expect(result.isFailure).toBe(true);
    });
  });
});

// ─── ResearchContribution Entity ───────────────────────────────────────

describe('ResearchContribution Entity', () => {
  describe('Creation', () => {
    it('should create a valid ResearchContribution', () => {
      const result = ResearchContribution.create({
        description: createFocusVO('Published paper on CV'),
        significance: createConfidenceVO(5),
        contributedAt: '2024-06-15',
      });
      expect(result.isSuccess).toBe(true);
      expect(result.value.description.value).toBe('Published paper on CV');
      expect(result.value.significance.value).toBe(5);
      expect(result.value.contributedAt).toBe('2024-06-15');
    });

    it('should fail with empty contributedAt', () => {
      const result = ResearchContribution.create({
        description: createFocusVO('Test'),
        significance: createConfidenceVO(),
        contributedAt: '',
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('Behavior', () => {
    it('should update description', () => {
      const contrib = ResearchContribution.create({
        description: createFocusVO('Original description'),
        significance: createConfidenceVO(),
        contributedAt: '2024-01-01',
      }).value;
      contrib.updateDescription(createFocusVO('Updated description'), LATER);
      expect(contrib.description.value).toBe('Updated description');
      expect(contrib.updatedAt).toBe(LATER);
    });

    it('should reassess significance', () => {
      const contrib = ResearchContribution.create({
        description: createFocusVO('Test contribution'),
        significance: createConfidenceVO(1),
        contributedAt: '2024-01-01',
      }).value;
      contrib.reassessSignificance(createConfidenceVO(5), LATER);
      expect(contrib.significance.value).toBe(5);
      expect(contrib.updatedAt).toBe(LATER);
    });
  });

  describe('Identity Equality', () => {
    it('should be equal when reconstituted with same ID', () => {
      const id = UniqueId.create();
      const c1 = ResearchContribution.reconstitute({
        id,
        description: createFocusVO('C1'),
        significance: createConfidenceVO(),
        contributedAt: '2024-01-01',
        createdAt: NOW,
        updatedAt: NOW,
      });
      const c2 = ResearchContribution.reconstitute({
        id,
        description: createFocusVO('C2'),
        significance: createConfidenceVO(1),
        contributedAt: '2024-06-01',
        createdAt: NOW,
        updatedAt: LATER,
      });
      expect(c1.equals(c2)).toBe(true);
    });
  });
});

// ─── Reconstitution Tests ──────────────────────────────────────────────

describe('Entity Reconstitution', () => {
  it('should reconstitute ResearchAgenda with all data', () => {
    const id = UniqueId.create();
    const areaId = UniqueId.create();
    const agenda = ResearchAgenda.reconstitute({
      id,
      focus: createFocusVO('ML Research'),
      status: createStatusVO('Active'),
      areaIds: [areaId],
      themes: ['Explainability', 'Fairness'],
      createdAt: NOW,
      updatedAt: LATER,
    });
    expect(agenda.id.equals(id)).toBe(true);
    expect(agenda.focus.value).toBe('ML Research');
    expect(agenda.areaIds).toHaveLength(1);
    expect(agenda.hasArea(areaId)).toBe(true);
    expect(agenda.themes).toHaveLength(2);
    expect(agenda.hasTheme('Explainability')).toBe(true);
  });

  it('should reconstitute ResearchValues with all data', () => {
    const id = UniqueId.create();
    const rv = ResearchValues.reconstitute({
      id,
      statement: createVisionVO('Values'),
      values: ['Integrity', 'Openness'],
      createdAt: NOW,
      updatedAt: LATER,
    });
    expect(rv.id.equals(id)).toBe(true);
    expect(rv.values).toHaveLength(2);
  });

  it('should reconstitute ResearchGoal with completion', () => {
    const id = UniqueId.create();
    const goal = ResearchGoal.reconstitute({
      id,
      description: createFocusVO('Completed goal'),
      status: createStatusVO('Active'),
      confidence: createConfidenceVO(5),
      deadlineAt: '2025-12-31',
      completedAt: LATER,
      createdAt: NOW,
      updatedAt: LATER,
    });
    expect(goal.isCompleted).toBe(true);
    expect(goal.completedAt).toBe(LATER);
  });
});

// ─── Identity Exports Test ─────────────────────────────────────────────

describe('Identity Exports', () => {
  it('should export all entity classes', async () => {
    const mod = await import('../index.js');
    expect(mod.ResearchVision).toBeDefined();
    expect(mod.ResearchAgenda).toBeDefined();
    expect(mod.ResearchArea).toBeDefined();
    expect(mod.ResearchQuestion).toBeDefined();
    expect(mod.ResearchPhilosophy).toBeDefined();
    expect(mod.ResearchValues).toBeDefined();
    expect(mod.ResearchEvolution).toBeDefined();
    expect(mod.ResearchMilestone).toBeDefined();
    expect(mod.ResearchGoal).toBeDefined();
    expect(mod.ResearchContribution).toBeDefined();
  });

  it('should export all value objects', async () => {
    const mod = await import('../index.js');
    expect(mod.ResearchVisionStatement).toBeDefined();
    expect(mod.ResearchFocus).toBeDefined();
    expect(mod.TimeHorizon).toBeDefined();
    expect(mod.ConfidenceLevel).toBeDefined();
    expect(mod.ResearchStatus).toBeDefined();
  });

  it('should export all error classes', async () => {
    const mod = await import('../index.js');
    expect(mod.IdentityDomainError).toBeDefined();
    expect(mod.IdentityInvariantViolationError).toBeDefined();
    expect(mod.DuplicateEntityItemError).toBeDefined();
    expect(mod.EntityItemNotFoundError).toBeDefined();
    expect(mod.InvalidTimeHorizonError).toBeDefined();
  });
});
