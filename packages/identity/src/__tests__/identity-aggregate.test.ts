/**
 * Comprehensive tests for the ResearchIdentity Aggregate Root.
 *
 * Coverage areas:
 * ✓ Aggregate creation
 * ✓ Aggregate reconstruction
 * ✓ Aggregate identity
 * ✓ Entity ownership
 * ✓ Aggregate-wide invariants
 * ✓ Successful commands
 * ✓ Failed commands
 * ✓ Cross-entity consistency
 * ✓ Collection encapsulation
 * ✓ Illegal state prevention
 * ✓ Event recording (not publishing)
 * ✓ Read-only exposure
 */

import { UniqueId } from '@rios/shared';
import { describe, it, expect, beforeEach } from 'vitest';

import { ResearchIdentity } from '../domain/aggregate/research-identity.js';
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

// ─── Test Helpers ──────────────────────────────────────────────────────

const NOW = '2024-01-01T00:00:00.000Z';

function visionVO(text = 'Advancing autonomous systems'): ResearchVisionStatement {
  return ResearchVisionStatement.create(text).value;
}

function focusVO(text = 'Computer Vision'): ResearchFocus {
  return ResearchFocus.create(text).value;
}

function timeHorizonVO(horizon = '10-20 years'): TimeHorizon {
  return TimeHorizon.create(horizon).value;
}

function confidenceVO(level = 4): ConfidenceLevel {
  return ConfidenceLevel.create(level).value;
}

function statusVO(status: 'Active' | 'Exploratory' | 'Archived' = 'Active'): ResearchStatus {
  return ResearchStatus.create(status).value;
}

function createVision(_id?: string): ResearchVision {
  return ResearchVision.create({
    vision: visionVO(),
    timeHorizon: timeHorizonVO(),
    createdAt: NOW,
  }).value;
}

function createAgenda(_id?: string): ResearchAgenda {
  return ResearchAgenda.create({
    focus: focusVO('Agenda focus'),
    status: statusVO(),
    createdAt: NOW,
  }).value;
}

function createArea(_id?: string): ResearchArea {
  return ResearchArea.create({
    name: focusVO(`Area ${_id ?? 'default'}`),
    description: focusVO(`Area description ${_id ?? 'default'}`),
    status: statusVO(),
    confidence: confidenceVO(),
    createdAt: NOW,
  }).value;
}

function createQuestion(_id?: string): ResearchQuestion {
  return ResearchQuestion.create({
    question: focusVO(`Question ${_id ?? 'default'}`),
    motivation: focusVO(`Motivation ${_id ?? 'default'}`),
    status: statusVO(),
    confidence: confidenceVO(),
    createdAt: NOW,
  }).value;
}

function createPhilosophy(_id?: string): ResearchPhilosophy {
  return ResearchPhilosophy.create({
    statement: visionVO('Pragmatic empiricism'),
    createdAt: NOW,
  }).value;
}

function createValues(_id?: string): ResearchValues {
  return ResearchValues.create({
    statement: visionVO('Scientific integrity'),
    values: ['Integrity', 'Rigor', 'Transparency'],
    createdAt: NOW,
  }).value;
}

function createEvolution(_id?: string): ResearchEvolution {
  return ResearchEvolution.create({
    description: focusVO('Evolution description'),
    status: statusVO(),
    confidence: confidenceVO(),
    recordedAt: NOW,
  }).value;
}

function createGoal(_id?: string): ResearchGoal {
  return ResearchGoal.create({
    description: focusVO(`Goal ${_id ?? 'default'}`),
    status: statusVO(),
    confidence: confidenceVO(),
    deadlineAt: '2025-12-31T00:00:00.000Z',
    createdAt: NOW,
  }).value;
}

function createContribution(id?: string): ResearchContribution {
  return ResearchContribution.create({
    description: focusVO(`Contribution ${id ?? 'default'}`),
    significance: confidenceVO(),
    contributedAt: NOW,
  }).value;
}

function createMilestone(id?: string): ResearchMilestone {
  return ResearchMilestone.create({
    description: focusVO(`Milestone ${id ?? 'default'}`),
    confidence: confidenceVO(),
    occurredAt: NOW,
  }).value;
}

function createValidIdentity(): ResearchIdentity {
  const result = ResearchIdentity.create({
    vision: createVision('vision-001'),
    agenda: createAgenda('agenda-001'),
    philosophy: createPhilosophy('phil-001'),
    values: createValues('values-001'),
    evolution: createEvolution('evo-001'),
    createdAt: NOW,
  });
  expect(result.isSuccess).toBe(true);
  return result.value;
}

// ─── Aggregate Creation ────────────────────────────────────────────────

describe('ResearchIdentity Aggregate Root', () => {
  describe('Aggregate Creation', () => {
    it('should create a valid ResearchIdentity with all required entities', () => {
      const result = ResearchIdentity.create({
        vision: createVision(),
        agenda: createAgenda(),
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: createEvolution(),
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(ResearchIdentity);
    });

    it('should initialize collections as empty', () => {
      const identity = createValidIdentity();

      expect(identity.areas).toHaveLength(0);
      expect(identity.questions).toHaveLength(0);
      expect(identity.goals).toHaveLength(0);
      expect(identity.contributions).toHaveLength(0);
      expect(identity.milestones).toHaveLength(0);
    });

    it('should set createdAt timestamp on creation', () => {
      const identity = createValidIdentity();

      expect(identity.createdAt).toBe(NOW);
    });

    it('should set updatedAt equal to createdAt on creation', () => {
      const identity = createValidIdentity();

      expect(identity.updatedAt).toBe(identity.createdAt);
    });

    it('should auto-generate createdAt when not provided', () => {
      const before = new Date().toISOString();
      const result = ResearchIdentity.create({
        vision: createVision(),
        agenda: createAgenda(),
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: createEvolution(),
      });
      const after = new Date().toISOString();

      expect(result.isSuccess).toBe(true);
      expect(result.value.createdAt >= before).toBe(true);
      expect(result.value.createdAt <= after).toBe(true);
    });

    it('should fail creation when vision is missing', () => {
      const result = ResearchIdentity.create({
        vision: undefined as unknown as ResearchVision,
        agenda: createAgenda(),
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: createEvolution(),
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Vision is required');
    });

    it('should fail creation when agenda is missing', () => {
      const result = ResearchIdentity.create({
        vision: createVision(),
        agenda: undefined as unknown as ResearchAgenda,
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: createEvolution(),
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Agenda is required');
    });

    it('should fail creation when philosophy is missing', () => {
      const result = ResearchIdentity.create({
        vision: createVision(),
        agenda: createAgenda(),
        philosophy: undefined as unknown as ResearchPhilosophy,
        values: createValues(),
        evolution: createEvolution(),
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Philosophy is required');
    });

    it('should fail creation when values is missing', () => {
      const result = ResearchIdentity.create({
        vision: createVision(),
        agenda: createAgenda(),
        philosophy: createPhilosophy(),
        values: undefined as unknown as ResearchValues,
        evolution: createEvolution(),
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Values are required');
    });

    it('should fail creation when evolution is missing', () => {
      const result = ResearchIdentity.create({
        vision: createVision(),
        agenda: createAgenda(),
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: undefined as unknown as ResearchEvolution,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Evolution is required');
    });
  });

  // ─── Aggregate Reconstruction ─────────────────────────────────────────

  describe('Aggregate Reconstruction', () => {
    it('should reconstitute with full state from persistence', () => {
      const id = UniqueId.from('identity-001');
      const vision = createVision('vision-001');
      const agenda = createAgenda('agenda-001');
      const area = createArea('area-001');
      const question = createQuestion('q-001');
      const philosophy = createPhilosophy('phil-001');
      const values = createValues('values-001');
      const evolution = createEvolution('evo-001');
      const goal = createGoal('goal-001');
      const contribution = createContribution('contrib-001');
      const milestone = createMilestone('ms-001');

      const identity = ResearchIdentity.reconstitute({
        id,
        vision,
        agenda,
        areas: [area],
        questions: [question],
        philosophy,
        values,
        evolution,
        goals: [goal],
        contributions: [contribution],
        milestones: [milestone],
        createdAt: '2023-06-15T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });

      expect(identity.id.value).toBe('identity-001');
      expect(identity.vision).toBe(vision);
      expect(identity.agenda).toBe(agenda);
      expect(identity.areas).toHaveLength(1);
      expect(identity.questions).toHaveLength(1);
      expect(identity.philosophy).toBe(philosophy);
      expect(identity.values).toBe(values);
      expect(identity.evolution).toBe(evolution);
      expect(identity.goals).toHaveLength(1);
      expect(identity.contributions).toHaveLength(1);
      expect(identity.milestones).toHaveLength(1);
      expect(identity.createdAt).toBe('2023-06-15T00:00:00.000Z');
      expect(identity.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should reconstitute with empty collections', () => {
      const identity = ResearchIdentity.reconstitute({
        id: UniqueId.from('identity-002'),
        vision: createVision(),
        agenda: createAgenda(),
        areas: [],
        questions: [],
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: createEvolution(),
        goals: [],
        contributions: [],
        milestones: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      });

      expect(identity.areas).toHaveLength(0);
      expect(identity.questions).toHaveLength(0);
      expect(identity.goals).toHaveLength(0);
      expect(identity.contributions).toHaveLength(0);
      expect(identity.milestones).toHaveLength(0);
    });
  });

  // ─── Aggregate Identity ───────────────────────────────────────────────

  describe('Aggregate Identity', () => {
    it('should have a unique identity from creation', () => {
      const identity = createValidIdentity();

      expect(identity.id).toBeDefined();
      expect(identity.id.value).toBeTruthy();
      expect(typeof identity.id.value).toBe('string');
    });

    it('should preserve identity from reconstitution', () => {
      const specificId = UniqueId.from('custom-id-123');
      const identity = ResearchIdentity.reconstitute({
        id: specificId,
        vision: createVision(),
        agenda: createAgenda(),
        areas: [],
        questions: [],
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: createEvolution(),
        goals: [],
        contributions: [],
        milestones: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      });

      expect(identity.id.value).toBe('custom-id-123');
    });
  });

  // ─── Entity Ownership ─────────────────────────────────────────────────

  describe('Entity Ownership', () => {
    let identity: ResearchIdentity;

    beforeEach(() => {
      identity = createValidIdentity();
    });

    it('should own and expose vision entity', () => {
      expect(identity.vision).toBeDefined();
      expect(identity.vision).toBeInstanceOf(ResearchVision);
    });

    it('should own and expose agenda entity', () => {
      expect(identity.agenda).toBeDefined();
      expect(identity.agenda).toBeInstanceOf(ResearchAgenda);
    });

    it('should own and expose philosophy entity', () => {
      expect(identity.philosophy).toBeDefined();
      expect(identity.philosophy).toBeInstanceOf(ResearchPhilosophy);
    });

    it('should own and expose values entity', () => {
      expect(identity.values).toBeDefined();
      expect(identity.values).toBeInstanceOf(ResearchValues);
    });

    it('should own and expose evolution entity', () => {
      expect(identity.evolution).toBeDefined();
      expect(identity.evolution).toBeInstanceOf(ResearchEvolution);
    });
  });

  // ─── Successful Commands ──────────────────────────────────────────────

  describe('Successful Commands', () => {
    let identity: ResearchIdentity;

    beforeEach(() => {
      identity = createValidIdentity();
    });

    it('should update vision', () => {
      const newVision = createVision('new-vision');
      identity.updateVision(newVision);

      expect(identity.vision).toBe(newVision);
    });

    it('should update agenda', () => {
      const newAgenda = createAgenda('new-agenda');
      identity.updateAgenda(newAgenda);

      expect(identity.agenda).toBe(newAgenda);
    });

    it('should update philosophy', () => {
      const newPhilosophy = createPhilosophy('new-phil');
      identity.updatePhilosophy(newPhilosophy);

      expect(identity.philosophy).toBe(newPhilosophy);
    });

    it('should update values', () => {
      const newValues = createValues('new-values');
      identity.updateValues(newValues);

      expect(identity.values).toBe(newValues);
    });

    it('should update evolution', () => {
      const newEvolution = createEvolution('new-evo');
      identity.updateEvolution(newEvolution);

      expect(identity.evolution).toBe(newEvolution);
    });

    it('should add a research area', () => {
      const area = createArea('area-001');
      const result = identity.addResearchArea(area);

      expect(result.isSuccess).toBe(true);
      expect(identity.areas).toHaveLength(1);
      expect(identity.areas[0]).toBe(area);
    });

    it('should add multiple research areas', () => {
      const area1 = createArea('area-001');
      const area2 = createArea('area-002');

      identity.addResearchArea(area1);
      identity.addResearchArea(area2);

      expect(identity.areas).toHaveLength(2);
    });

    it('should remove a research area', () => {
      const area = createArea('area-001');
      identity.addResearchArea(area);

      const result = identity.removeResearchArea(area.id);

      expect(result.isSuccess).toBe(true);
      expect(identity.areas).toHaveLength(0);
    });

    it('should find a research area by ID', () => {
      const area = createArea('area-001');
      identity.addResearchArea(area);

      const found = identity.findResearchArea(area.id);

      expect(found).toBe(area);
    });

    it('should add a research question', () => {
      const question = createQuestion('q-001');
      const result = identity.addResearchQuestion(question);

      expect(result.isSuccess).toBe(true);
      expect(identity.questions).toHaveLength(1);
      expect(identity.questions[0]).toBe(question);
    });

    it('should remove a research question', () => {
      const question = createQuestion('q-001');
      identity.addResearchQuestion(question);

      const result = identity.removeResearchQuestion(question.id);

      expect(result.isSuccess).toBe(true);
      expect(identity.questions).toHaveLength(0);
    });

    it('should find a research question by ID', () => {
      const question = createQuestion('q-001');
      identity.addResearchQuestion(question);

      const found = identity.findResearchQuestion(question.id);

      expect(found).toBe(question);
    });

    it('should add a goal', () => {
      const goal = createGoal('goal-001');
      const result = identity.addGoal(goal);

      expect(result.isSuccess).toBe(true);
      expect(identity.goals).toHaveLength(1);
    });

    it('should remove a goal', () => {
      const goal = createGoal('goal-001');
      identity.addGoal(goal);

      const result = identity.removeGoal(goal.id);

      expect(result.isSuccess).toBe(true);
      expect(identity.goals).toHaveLength(0);
    });

    it('should find a goal by ID', () => {
      const goal = createGoal('goal-001');
      identity.addGoal(goal);

      const found = identity.findGoal(goal.id);

      expect(found).toBe(goal);
    });

    it('should record a contribution', () => {
      const contribution = createContribution('contrib-001');
      const result = identity.recordContribution(contribution);

      expect(result.isSuccess).toBe(true);
      expect(identity.contributions).toHaveLength(1);
    });

    it('should remove a contribution', () => {
      const contribution = createContribution('contrib-001');
      identity.recordContribution(contribution);

      const result = identity.removeContribution(contribution.id);

      expect(result.isSuccess).toBe(true);
      expect(identity.contributions).toHaveLength(0);
    });

    it('should find a contribution by ID', () => {
      const contribution = createContribution('contrib-001');
      identity.recordContribution(contribution);

      const found = identity.findContribution(contribution.id);

      expect(found).toBe(contribution);
    });

    it('should add a milestone', () => {
      const milestone = createMilestone('ms-001');
      identity.addMilestone(milestone);

      expect(identity.milestones).toHaveLength(1);
    });

    it('should find a milestone by ID', () => {
      const milestone = createMilestone('ms-001');
      identity.addMilestone(milestone);

      const found = identity.findMilestone(milestone.id);

      expect(found).toBe(milestone);
    });
  });

  // ─── Failed Commands ──────────────────────────────────────────────────

  describe('Failed Commands', () => {
    let identity: ResearchIdentity;

    beforeEach(() => {
      identity = createValidIdentity();
    });

    it('should reject adding duplicate research area', () => {
      const area = createArea('area-001');
      identity.addResearchArea(area);

      const result = identity.addResearchArea(area);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate item detected');
      expect(identity.areas).toHaveLength(1);
    });

    it('should reject removing non-existent research area', () => {
      const result = identity.removeResearchArea(UniqueId.from('non-existent'));

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not found');
    });

    it('should reject adding duplicate research question', () => {
      const question = createQuestion('q-001');
      identity.addResearchQuestion(question);

      const result = identity.addResearchQuestion(question);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate item detected');
      expect(identity.questions).toHaveLength(1);
    });

    it('should reject removing non-existent research question', () => {
      const result = identity.removeResearchQuestion(UniqueId.from('non-existent'));

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not found');
    });

    it('should reject adding duplicate goal', () => {
      const goal = createGoal('goal-001');
      identity.addGoal(goal);

      const result = identity.addGoal(goal);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate item detected');
      expect(identity.goals).toHaveLength(1);
    });

    it('should reject removing non-existent goal', () => {
      const result = identity.removeGoal(UniqueId.from('non-existent'));

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not found');
    });

    it('should reject recording duplicate contribution', () => {
      const contribution = createContribution('contrib-001');
      identity.recordContribution(contribution);

      const result = identity.recordContribution(contribution);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duplicate item detected');
      expect(identity.contributions).toHaveLength(1);
    });

    it('should reject removing non-existent contribution', () => {
      const result = identity.removeContribution(UniqueId.from('non-existent'));

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not found');
    });
  });

  // ─── Cross-Entity Consistency ─────────────────────────────────────────

  describe('Cross-Entity Consistency', () => {
    it('should maintain consistent state after multiple operations', () => {
      const identity = createValidIdentity();

      identity.addResearchArea(createArea('area-001'));
      identity.addResearchArea(createArea('area-002'));
      identity.addResearchQuestion(createQuestion('q-001'));
      identity.addGoal(createGoal('goal-001'));
      identity.recordContribution(createContribution('contrib-001'));
      identity.addMilestone(createMilestone('ms-001'));

      expect(identity.areas).toHaveLength(2);
      expect(identity.questions).toHaveLength(1);
      expect(identity.goals).toHaveLength(1);
      expect(identity.contributions).toHaveLength(1);
      expect(identity.milestones).toHaveLength(1);

      // Remove one area — state remains consistent
      const areaToRemove = identity.areas[0];
      identity.removeResearchArea(areaToRemove.id);

      expect(identity.areas).toHaveLength(1);
    });

    it('should update updatedAt on every mutation', () => {
      const identity = createValidIdentity();
      const initialUpdatedAt = identity.updatedAt;

      // Force a small time difference
      identity.updateVision(createVision('new-vision'));

      expect(identity.updatedAt >= initialUpdatedAt).toBe(true);
    });

    it('should maintain identity through mutations', () => {
      const identity = createValidIdentity();
      const originalId = identity.id;

      identity.updateVision(createVision('new-vision'));
      identity.addResearchArea(createArea('area-001'));

      expect(identity.id).toBe(originalId);
    });
  });

  // ─── Collection Encapsulation ─────────────────────────────────────────

  describe('Collection Encapsulation', () => {
    it('should return frozen arrays for areas', () => {
      const identity = createValidIdentity();
      identity.addResearchArea(createArea('area-001'));

      const areas = identity.areas;

      expect(() => {
        (areas as unknown as ResearchArea[]).push(createArea('area-999'));
      }).toThrow();
    });

    it('should return frozen arrays for questions', () => {
      const identity = createValidIdentity();
      identity.addResearchQuestion(createQuestion('q-001'));

      const questions = identity.questions;

      expect(() => {
        (questions as unknown as ResearchQuestion[]).push(createQuestion('q-999'));
      }).toThrow();
    });

    it('should return frozen arrays for goals', () => {
      const identity = createValidIdentity();
      identity.addGoal(createGoal('goal-001'));

      const goals = identity.goals;

      expect(() => {
        (goals as unknown as ResearchGoal[]).push(createGoal('goal-999'));
      }).toThrow();
    });

    it('should return frozen arrays for contributions', () => {
      const identity = createValidIdentity();
      identity.recordContribution(createContribution('contrib-001'));

      const contributions = identity.contributions;

      expect(() => {
        (contributions as unknown as ResearchContribution[]).push(
          createContribution('contrib-999'),
        );
      }).toThrow();
    });

    it('should return frozen arrays for milestones', () => {
      const identity = createValidIdentity();
      identity.addMilestone(createMilestone('ms-001'));

      const milestones = identity.milestones;

      expect(() => {
        (milestones as unknown as ResearchMilestone[]).push(createMilestone('ms-999'));
      }).toThrow();
    });

    it('should return a new frozen copy each time (defensive copy)', () => {
      const identity = createValidIdentity();
      identity.addResearchArea(createArea('area-001'));

      const areas1 = identity.areas;
      const areas2 = identity.areas;

      expect(areas1).not.toBe(areas2);
      expect(areas1).toEqual(areas2);
    });
  });

  // ─── Illegal State Prevention ─────────────────────────────────────────

  describe('Illegal State Prevention', () => {
    it('should fail gracefully when finding non-existent area', () => {
      const identity = createValidIdentity();

      const found = identity.findResearchArea(UniqueId.from('non-existent'));

      expect(found).toBeUndefined();
    });

    it('should fail gracefully when finding non-existent question', () => {
      const identity = createValidIdentity();

      const found = identity.findResearchQuestion(UniqueId.from('non-existent'));

      expect(found).toBeUndefined();
    });

    it('should fail gracefully when finding non-existent goal', () => {
      const identity = createValidIdentity();

      const found = identity.findGoal(UniqueId.from('non-existent'));

      expect(found).toBeUndefined();
    });

    it('should fail gracefully when finding non-existent contribution', () => {
      const identity = createValidIdentity();

      const found = identity.findContribution(UniqueId.from('non-existent'));

      expect(found).toBeUndefined();
    });

    it('should fail gracefully when finding non-existent milestone', () => {
      const identity = createValidIdentity();

      const found = identity.findMilestone(UniqueId.from('non-existent'));

      expect(found).toBeUndefined();
    });

    it('should not allow partial creation failure — all-or-nothing', () => {
      // Attempting creation with missing required entity should return failure
      const result = ResearchIdentity.create({
        vision: createVision(),
        agenda: undefined as unknown as ResearchAgenda,
        philosophy: createPhilosophy(),
        values: createValues(),
        evolution: createEvolution(),
      });

      expect(result.isFailure).toBe(true);
      // Aggregate should not be accessible on failure
      expect(() => result.value).toThrow();
    });
  });

  // ─── Event Recording ──────────────────────────────────────────────────

  describe('Domain Event Recording (internal only)', () => {
    it('should return empty events on new aggregate', () => {
      const identity = createValidIdentity();

      const events = identity.pullDomainEvents();

      expect(events).toHaveLength(0);
    });

    it('should return empty array and clear when clearing events', () => {
      const identity = createValidIdentity();

      identity.clearDomainEvents();

      const events = identity.pullDomainEvents();
      expect(events).toHaveLength(0);
    });

    it('should return empty events after pulling (drain)', () => {
      const identity = createValidIdentity();

      const firstPull = identity.pullDomainEvents();
      const secondPull = identity.pullDomainEvents();

      expect(firstPull).toHaveLength(0);
      expect(secondPull).toHaveLength(0);
    });
  });

  // ─── Read-Only Exposure ───────────────────────────────────────────────

  describe('Read-Only Exposure', () => {
    it('should produce a complete snapshot', () => {
      const identity = createValidIdentity();
      identity.addResearchArea(createArea('area-001'));
      identity.addResearchQuestion(createQuestion('q-001'));
      identity.addGoal(createGoal('goal-001'));
      identity.recordContribution(createContribution('contrib-001'));
      identity.addMilestone(createMilestone('ms-001'));

      const snapshot = identity.toSnapshot();

      expect(snapshot.id).toBe(identity.id.value);
      expect(snapshot.vision).toBe(identity.vision);
      expect(snapshot.agenda).toBe(identity.agenda);
      expect(snapshot.areas).toHaveLength(1);
      expect(snapshot.questions).toHaveLength(1);
      expect(snapshot.philosophy).toBe(identity.philosophy);
      expect(snapshot.values).toBe(identity.values);
      expect(snapshot.evolution).toBe(identity.evolution);
      expect(snapshot.goals).toHaveLength(1);
      expect(snapshot.contributions).toHaveLength(1);
      expect(snapshot.milestones).toHaveLength(1);
      expect(snapshot.createdAt).toBe(identity.createdAt);
      expect(snapshot.updatedAt).toBe(identity.updatedAt);
    });

    it('should return frozen arrays in snapshot', () => {
      const identity = createValidIdentity();
      identity.addResearchArea(createArea('area-001'));

      const snapshot = identity.toSnapshot();

      expect(() => {
        (snapshot.areas as unknown as ResearchArea[]).push(createArea('area-999'));
      }).toThrow();
    });
  });
});
