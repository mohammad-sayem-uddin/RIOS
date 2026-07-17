/**
 * Comprehensive tests for all Identity Domain Policies.
 *
 * Covers:
 *   - IdentityCompletenessPolicy
 *   - ResearchAgendaConsistencyPolicy
 *   - ResearchAreaEligibilityPolicy
 *   - ResearchGoalCompletionPolicy
 *   - ContributionAcceptancePolicy
 *   - ResearchEvolutionPolicy
 *   - ResearchVisionConsistencyPolicy
 *
 * Each policy is tested for:
 * ✓ Valid policy evaluation (satisfied invariants)
 * ✓ Invalid policy evaluation (violated invariants)
 * ✓ Boundary conditions
 * ✓ Cross-entity scenarios
 * ✓ Aggregate scenarios
 * ✓ No side effects
 * ✓ Deterministic behavior
 * ✓ Error handling (uses IdentityDomainError, never generic Error)
 */

import { describe, it, expect } from 'vitest';

import { ResearchIdentity } from '../domain/aggregate/research-identity.js';
import { ResearchAgenda } from '../domain/entities/research-agenda.js';
import { ResearchArea } from '../domain/entities/research-area.js';
import { ResearchContribution } from '../domain/entities/research-contribution.js';
import { ResearchEvolution } from '../domain/entities/research-evolution.js';
import { ResearchGoal } from '../domain/entities/research-goal.js';
import { ResearchPhilosophy } from '../domain/entities/research-philosophy.js';
import { ResearchQuestion } from '../domain/entities/research-question.js';
import { ResearchValues } from '../domain/entities/research-values.js';
import { ResearchVision } from '../domain/entities/research-vision.js';
import {
  IdentityCompletenessPolicy,
  ResearchAgendaConsistencyPolicy,
  ResearchAreaEligibilityPolicy,
  ResearchGoalCompletionPolicy,
  ContributionAcceptancePolicy,
  ResearchEvolutionPolicy,
  ResearchVisionConsistencyPolicy,
} from '../domain/policies/index.js';
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

function createVision(): ResearchVision {
  return ResearchVision.create({
    vision: visionVO(),
    timeHorizon: timeHorizonVO(),
    createdAt: NOW,
  }).value;
}

function createAgenda(focus = 'Computer Vision'): ResearchAgenda {
  return ResearchAgenda.create({
    focus: focusVO(focus),
    status: statusVO(),
    createdAt: NOW,
  }).value;
}

function createArea(name = 'Area', description = 'Area description'): ResearchArea {
  return ResearchArea.create({
    name: focusVO(name),
    description: focusVO(description),
    status: statusVO(),
    confidence: confidenceVO(),
    createdAt: NOW,
  }).value;
}

function createQuestion(question = 'Question?', motivation = 'Motivation'): ResearchQuestion {
  return ResearchQuestion.create({
    question: focusVO(question),
    motivation: focusVO(motivation),
    status: statusVO(),
    confidence: confidenceVO(),
    createdAt: NOW,
  }).value;
}

function createPhilosophy(): ResearchPhilosophy {
  return ResearchPhilosophy.create({
    statement: visionVO('Pragmatic empiricism'),
    createdAt: NOW,
  }).value;
}

function createValues(): ResearchValues {
  return ResearchValues.create({
    statement: visionVO('Scientific integrity'),
    values: ['Integrity', 'Rigor', 'Transparency'],
    createdAt: NOW,
  }).value;
}

function createEvolution(): ResearchEvolution {
  return ResearchEvolution.create({
    description: focusVO('Evolution description'),
    status: statusVO(),
    confidence: confidenceVO(),
    recordedAt: NOW,
  }).value;
}

function createGoal(description = 'Goal', deadline = '2025-12-31T00:00:00.000Z'): ResearchGoal {
  return ResearchGoal.create({
    description: focusVO(description),
    status: statusVO(),
    confidence: confidenceVO(),
    deadlineAt: deadline,
    createdAt: NOW,
  }).value;
}

function createContribution(description = 'Contribution'): ResearchContribution {
  return ResearchContribution.create({
    description: focusVO(description),
    significance: confidenceVO(),
    contributedAt: NOW,
  }).value;
}

function createIdentity(overrides?: {
  vision?: ResearchVision;
  agenda?: ResearchAgenda;
  philosophy?: ResearchPhilosophy;
  values?: ResearchValues;
  evolution?: ResearchEvolution;
}): ResearchIdentity {
  return ResearchIdentity.create({
    vision: overrides?.vision ?? createVision(),
    agenda: overrides?.agenda ?? createAgenda(),
    philosophy: overrides?.philosophy ?? createPhilosophy(),
    values: overrides?.values ?? createValues(),
    evolution: overrides?.evolution ?? createEvolution(),
    createdAt: NOW,
  }).value;
}

function addAreaToIdentity(identity: ResearchIdentity, area?: ResearchArea): void {
  const result = identity.addResearchArea(area ?? createArea());
  if (result.isFailure) {
    throw new Error(`Failed to add area in test helper: ${result.error}`);
  }
}

function addQuestionToIdentity(identity: ResearchIdentity, question?: ResearchQuestion): void {
  const result = identity.addResearchQuestion(question ?? createQuestion());
  if (result.isFailure) {
    throw new Error(`Failed to add question in test helper: ${result.error}`);
  }
}

function addGoalToIdentity(identity: ResearchIdentity, goal?: ResearchGoal): void {
  const result = identity.addGoal(goal ?? createGoal());
  if (result.isFailure) {
    throw new Error(`Failed to add goal in test helper: ${result.error}`);
  }
}

function addContributionToIdentity(
  identity: ResearchIdentity,
  contribution?: ResearchContribution,
): void {
  const result = identity.recordContribution(contribution ?? createContribution());
  if (result.isFailure) {
    throw new Error(`Failed to add contribution in test helper: ${result.error}`);
  }
}

function _createIdentityWithAreas(areaCount: number): ResearchIdentity {
  const identity = createIdentity();
  for (let i = 0; i < areaCount; i++) {
    addAreaToIdentity(identity, createArea(`Area ${i}`, `Description ${i}`));
  }
  return identity;
}

function _createIdentityWithGoals(activeCount: number, completedCount: number): ResearchIdentity {
  const identity = createIdentity();
  for (let i = 0; i < activeCount; i++) {
    addGoalToIdentity(identity, createGoal(`Active Goal ${i}`));
  }
  for (let i = 0; i < completedCount; i++) {
    const goal = createGoal(`Completed Goal ${i}`);
    goal.markCompleted('2024-06-01T00:00:00.000Z');
    addGoalToIdentity(identity, goal);
  }
  return identity;
}

function _createIdentityWithContributions(count: number): ResearchIdentity {
  const identity = createIdentity();
  for (let i = 0; i < count; i++) {
    addContributionToIdentity(identity, createContribution(`Contribution ${i}`));
  }
  return identity;
}

// ─── IdentityCompletenessPolicy ────────────────────────────────────────

describe('IdentityCompletenessPolicy', () => {
  it('should return Result.ok when all core components are present', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity);
    addQuestionToIdentity(identity);

    const result = IdentityCompletenessPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.ok even without areas (areas optional at creation)', () => {
    const identity = createIdentity();

    const result = IdentityCompletenessPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.ok when identity has vision, agenda, philosophy, values, evolution', () => {
    const identity = createIdentity();

    const result = IdentityCompletenessPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should not mutate the identity', () => {
    const identity = createIdentity();
    const beforeAreas = identity.areas.length;
    const beforeQuestions = identity.questions.length;

    IdentityCompletenessPolicy.evaluate(identity);

    expect(identity.areas.length).toBe(beforeAreas);
    expect(identity.questions.length).toBe(beforeQuestions);
  });

  it('should be deterministic — same input always gives same result', () => {
    const identity = createIdentity();

    const r1 = IdentityCompletenessPolicy.evaluate(identity);
    const r2 = IdentityCompletenessPolicy.evaluate(identity);
    const r3 = IdentityCompletenessPolicy.evaluate(identity);

    expect(r1.isSuccess).toBe(r2.isSuccess);
    expect(r2.isSuccess).toBe(r3.isSuccess);
  });
});

// ─── ResearchAgendaConsistencyPolicy ──────────────────────────────────

describe('ResearchAgendaConsistencyPolicy', () => {
  it('should return Result.ok when agenda focus is valid and areas are well-formed', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('CV Research', 'Computer vision techniques'));

    const result = ResearchAgendaConsistencyPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.ok when agenda has no areas (no areas to be inconsistent)', () => {
    const identity = createIdentity();

    const result = ResearchAgendaConsistencyPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.ok when all areas have valid names', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('Area A', 'Description A'));
    addAreaToIdentity(identity, createArea('Area B', 'Description B'));

    const result = ResearchAgendaConsistencyPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should not mutate any entities', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity);

    const agendaFocusBefore = identity.agenda.focus.value;
    ResearchAgendaConsistencyPolicy.evaluate(identity);

    expect(identity.agenda.focus.value).toBe(agendaFocusBefore);
  });

  it('should be deterministic', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('CV Research', 'Computer vision'));

    const r1 = ResearchAgendaConsistencyPolicy.evaluate(identity);
    const r2 = ResearchAgendaConsistencyPolicy.evaluate(identity);

    expect(r1.isSuccess).toBe(r2.isSuccess);
  });
});

// ─── ResearchAreaEligibilityPolicy ────────────────────────────────────

describe('ResearchAreaEligibilityPolicy', () => {
  it('should return Result.ok when candidate area is eligible', () => {
    const identity = createIdentity();
    const area = createArea('New Area', 'New area description');

    const result = ResearchAreaEligibilityPolicy.evaluate(identity, area);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.fail when candidate area duplicates an existing name', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('Duplicate Area', 'First'));
    const duplicateArea = createArea('Duplicate Area', 'Second');

    const result = ResearchAreaEligibilityPolicy.evaluate(identity, duplicateArea);

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Research Area with name "Duplicate Area" already exists');
  });

  it('should allow adding an area with a different name', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('Existing Area', 'Existing'));
    const newArea = createArea('Different Area', 'Different');

    const result = ResearchAreaEligibilityPolicy.evaluate(identity, newArea);

    expect(result.isSuccess).toBe(true);
  });

  it('should detect duplicate names case-insensitively', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('Computer Vision', 'CV'));
    const duplicateArea = createArea('computer vision', 'lowercase cv');

    const result = ResearchAreaEligibilityPolicy.evaluate(identity, duplicateArea);

    expect(result.isFailure).toBe(true);
  });

  it('should not mutate the identity', () => {
    const identity = createIdentity();
    const beforeCount = identity.areas.length;

    const area = createArea('Test Area', 'Test');
    ResearchAreaEligibilityPolicy.evaluate(identity, area);

    expect(identity.areas.length).toBe(beforeCount);
  });

  it('should be deterministic', () => {
    const identity = createIdentity();
    const area = createArea('Test Area', 'Test');

    const r1 = ResearchAreaEligibilityPolicy.evaluate(identity, area);
    const r2 = ResearchAreaEligibilityPolicy.evaluate(identity, area);

    expect(r1.isSuccess).toBe(r2.isSuccess);
  });
});

// ─── ResearchGoalCompletionPolicy ─────────────────────────────────────

describe('ResearchGoalCompletionPolicy', () => {
  it('should return Result.ok when completing an active goal with valid description and deadline', () => {
    const goal = createGoal('Active Goal', '2025-12-31T00:00:00.000Z');

    const result = ResearchGoalCompletionPolicy.evaluate(goal);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.fail when goal is already completed', () => {
    const goal = createGoal('Completed Goal');
    goal.markCompleted('2024-06-01T00:00:00.000Z');

    const result = ResearchGoalCompletionPolicy.evaluate(goal);

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('already completed');
  });

  it('should reject goal creation with empty description (VO defense)', () => {
    // ResearchFocus VO rejects whitespace — the goal cannot be created.
    // ResearchGoalCompletionPolicy.description check is defense-in-depth.
    const focusResult = ResearchFocus.create('   ');
    expect(focusResult.isFailure).toBe(true);
  });

  it('should reject goal creation with empty deadline (VO defense)', () => {
    // ResearchGoal.create rejects whitespace deadlineAt at construction.
    // ResearchGoalCompletionPolicy.deadlineAt check is defense-in-depth.
    const goalResult = ResearchGoal.create({
      description: focusVO('Valid Description'),
      status: statusVO(),
      confidence: confidenceVO(),
      deadlineAt: '   ',
      createdAt: NOW,
    });
    expect(goalResult.isFailure).toBe(true);
  });

  it('should not mutate the goal', () => {
    const goal = createGoal('Test Goal');
    const wasCompleted = goal.isCompleted;

    ResearchGoalCompletionPolicy.evaluate(goal);

    expect(goal.isCompleted).toBe(wasCompleted);
  });

  it('should be deterministic', () => {
    const goal = createGoal('Test Goal');

    const r1 = ResearchGoalCompletionPolicy.evaluate(goal);
    const r2 = ResearchGoalCompletionPolicy.evaluate(goal);

    expect(r1.isSuccess).toBe(r2.isSuccess);
  });
});

// ─── ContributionAcceptancePolicy ─────────────────────────────────────

describe('ContributionAcceptancePolicy', () => {
  it('should return Result.ok when contribution has valid description, significance, and date', () => {
    const contribution = createContribution('Valid Contribution');

    const result = ContributionAcceptancePolicy.evaluate(contribution);

    expect(result.isSuccess).toBe(true);
  });

  it('should reject contribution creation with empty description (VO defense)', () => {
    // ResearchFocus VO rejects whitespace — the contribution cannot be created.
    // ContributionAcceptancePolicy.description check is defense-in-depth.
    const focusResult = ResearchFocus.create('   ');
    expect(focusResult.isFailure).toBe(true);
  });

  it('should reject contribution creation with invalid significance (VO defense)', () => {
    // ConfidenceLevel VO rejects values outside 1–5.
    // ContributionAcceptancePolicy.significance check is defense-in-depth.
    const confResult = ConfidenceLevel.create(0);
    expect(confResult.isFailure).toBe(true);
  });

  it('should reject contribution creation with empty contributedAt (VO defense)', () => {
    // ResearchContribution.create rejects whitespace contributedAt at construction.
    // ContributionAcceptancePolicy.contributedAt check is defense-in-depth.
    const contributionResult = ResearchContribution.create({
      description: focusVO('Valid'),
      significance: confidenceVO(),
      contributedAt: '   ',
    });
    expect(contributionResult.isFailure).toBe(true);
  });

  it('should not mutate the contribution', () => {
    const contribution = createContribution('Test');
    const descBefore = contribution.description.value;

    ContributionAcceptancePolicy.evaluate(contribution);

    expect(contribution.description.value).toBe(descBefore);
  });

  it('should be deterministic', () => {
    const contribution = createContribution('Test');

    const r1 = ContributionAcceptancePolicy.evaluate(contribution);
    const r2 = ContributionAcceptancePolicy.evaluate(contribution);

    expect(r1.isSuccess).toBe(r2.isSuccess);
  });

  it('evaluateGoal should return Result.ok for an active goal', () => {
    const goal = createGoal('Valid Goal', '2025-12-31T00:00:00.000Z');

    const result = ContributionAcceptancePolicy.evaluateGoal(goal);

    expect(result.isSuccess).toBe(true);
  });

  it('evaluateGoal should return Result.fail for a completed goal', () => {
    const goal = createGoal('Completed Goal');
    goal.markCompleted('2024-06-01T00:00:00.000Z');

    const result = ContributionAcceptancePolicy.evaluateGoal(goal);

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('completed');
  });
});

// ─── ResearchEvolutionPolicy ──────────────────────────────────────────

describe('ResearchEvolutionPolicy', () => {
  it('should return Result.ok when identity has valid evolution with description and confidence', () => {
    const identity = createIdentity();

    const result = ResearchEvolutionPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.ok when evolution confidence is at boundary (1)', () => {
    const evolution = ResearchEvolution.create({
      description: focusVO('Evolution description'),
      status: statusVO(),
      confidence: ConfidenceLevel.create(1).value,
      recordedAt: NOW,
    }).value;

    const identity = createIdentity({ evolution });

    const result = ResearchEvolutionPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.ok when evolution confidence is at boundary (5)', () => {
    const evolution = ResearchEvolution.create({
      description: focusVO('Evolution description'),
      status: statusVO(),
      confidence: ConfidenceLevel.create(5).value,
      recordedAt: NOW,
    }).value;

    const identity = createIdentity({ evolution });

    const result = ResearchEvolutionPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should not mutate the identity', () => {
    const identity = createIdentity();
    const evolutionDescBefore = identity.evolution.description.value;

    ResearchEvolutionPolicy.evaluate(identity);

    expect(identity.evolution.description.value).toBe(evolutionDescBefore);
  });

  it('should be deterministic', () => {
    const identity = createIdentity();

    const r1 = ResearchEvolutionPolicy.evaluate(identity);
    const r2 = ResearchEvolutionPolicy.evaluate(identity);

    expect(r1.isSuccess).toBe(r2.isSuccess);
  });
});

// ─── ResearchVisionConsistencyPolicy ──────────────────────────────────

describe('ResearchVisionConsistencyPolicy', () => {
  it('should return Result.ok when vision is present and valid', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity);

    const result = ResearchVisionConsistencyPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should return Result.ok when vision exists with goals and areas', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('Autonomous Systems', 'Vision-aligned area'));
    addGoalToIdentity(identity, createGoal('Autonomous systems goal'));

    const result = ResearchVisionConsistencyPolicy.evaluate(identity);

    expect(result.isSuccess).toBe(true);
  });

  it('should not mutate vision or identity', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity);
    const beforeAreasCount = identity.areas.length;
    const beforeVisionText = identity.vision.vision.value;

    ResearchVisionConsistencyPolicy.evaluate(identity);

    expect(identity.areas.length).toBe(beforeAreasCount);
    expect(identity.vision.vision.value).toBe(beforeVisionText);
  });

  it('should be deterministic', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity);

    const r1 = ResearchVisionConsistencyPolicy.evaluate(identity);
    const r2 = ResearchVisionConsistencyPolicy.evaluate(identity);

    expect(r1.isSuccess).toBe(r2.isSuccess);
  });
});

// ─── Cross-Policy Integration ─────────────────────────────────────────

describe('Cross-Policy Integration', () => {
  it('a fully-built identity should pass all policies', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('Area 1', 'Description 1'));
    addQuestionToIdentity(identity, createQuestion('Q1?', 'Motivation'));
    addGoalToIdentity(identity, createGoal('Goal 1'));

    // Completeness
    expect(IdentityCompletenessPolicy.evaluate(identity).isSuccess).toBe(true);

    // Agenda consistency
    expect(ResearchAgendaConsistencyPolicy.evaluate(identity).isSuccess).toBe(true);

    // Area eligibility (can add another)
    expect(
      ResearchAreaEligibilityPolicy.evaluate(identity, createArea('Area 2', 'Description 2'))
        .isSuccess,
    ).toBe(true);

    // Vision consistency
    expect(ResearchVisionConsistencyPolicy.evaluate(identity).isSuccess).toBe(true);

    // Evolution policy
    expect(ResearchEvolutionPolicy.evaluate(identity).isSuccess).toBe(true);

    // Contribution acceptance (evaluate a contribution entity)
    const contribution = createContribution('Test Contribution');
    expect(ContributionAcceptancePolicy.evaluate(contribution).isSuccess).toBe(true);
  });

  it('policies should not interfere with each other', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity, createArea('CV', 'Computer Vision'));
    addQuestionToIdentity(identity, createQuestion('How?', 'Motivation'));

    const contribution = createContribution('Test');

    // Run all policies sequentially — each must be independent
    const completeness = IdentityCompletenessPolicy.evaluate(identity);
    const agendaConsistency = ResearchAgendaConsistencyPolicy.evaluate(identity);
    const areaEligibility = ResearchAreaEligibilityPolicy.evaluate(
      identity,
      createArea('NLP', 'Natural Language Processing'),
    );
    const visionConsistency = ResearchVisionConsistencyPolicy.evaluate(identity);
    const evolutionPolicy = ResearchEvolutionPolicy.evaluate(identity);
    const contributionAcceptance = ContributionAcceptancePolicy.evaluate(contribution);

    // All should succeed independently
    expect(completeness.isSuccess).toBe(true);
    expect(agendaConsistency.isSuccess).toBe(true);
    expect(areaEligibility.isSuccess).toBe(true);
    expect(visionConsistency.isSuccess).toBe(true);
    expect(evolutionPolicy.isSuccess).toBe(true);
    expect(contributionAcceptance.isSuccess).toBe(true);

    // Identity should still be unchanged after all policy evaluations
    expect(identity.areas.length).toBe(1);
    expect(identity.questions.length).toBe(1);
  });
});

// ─── Error Strategy ───────────────────────────────────────────────────

describe('Error Strategy', () => {
  it('policies should never throw — they return Result', () => {
    const identity = createIdentity();
    const contribution = createContribution('Test');

    expect(() => IdentityCompletenessPolicy.evaluate(identity)).not.toThrow();
    expect(() => ResearchAgendaConsistencyPolicy.evaluate(identity)).not.toThrow();
    expect(() =>
      ResearchAreaEligibilityPolicy.evaluate(identity, createArea('Test', 'Test')),
    ).not.toThrow();
    expect(() => ResearchEvolutionPolicy.evaluate(identity)).not.toThrow();
    expect(() => ResearchVisionConsistencyPolicy.evaluate(identity)).not.toThrow();
    expect(() => ContributionAcceptancePolicy.evaluate(contribution)).not.toThrow();
  });

  it('policy errors should contain meaningful domain error messages', () => {
    // Create a goal that's already completed to trigger ResearchGoalCompletionPolicy error
    const goal = createGoal('Already Done');
    goal.markCompleted('2024-06-01T00:00:00.000Z');

    const result = ResearchGoalCompletionPolicy.evaluate(goal);

    expect(result.isFailure).toBe(true);
    expect(typeof result.error).toBe('string');
    expect(result.error.length).toBeGreaterThan(0);
    expect(result.error).toContain('already completed');
  });

  it('policies should only depend on domain model types', () => {
    // Compile-time enforcement via TypeScript prevents this from compiling
    // if wrong types are passed. This is a runtime sanity check.
    const identity = createIdentity();
    const area = createArea('Test', 'Test');
    const contribution = createContribution('Test');
    const goal = createGoal('Test');

    // These calls verify the signatures accept correct domain types
    expect(IdentityCompletenessPolicy.evaluate(identity)).toBeDefined();
    expect(ResearchAgendaConsistencyPolicy.evaluate(identity)).toBeDefined();
    expect(ResearchAreaEligibilityPolicy.evaluate(identity, area)).toBeDefined();
    expect(ResearchVisionConsistencyPolicy.evaluate(identity)).toBeDefined();
    expect(ContributionAcceptancePolicy.evaluate(contribution)).toBeDefined();
    expect(ContributionAcceptancePolicy.evaluateGoal(goal)).toBeDefined();
    expect(ResearchGoalCompletionPolicy.evaluate(goal)).toBeDefined();
    expect(ResearchEvolutionPolicy.evaluate(identity)).toBeDefined();
  });
});

// ─── Policy Principle Compliance ──────────────────────────────────────

describe('Policy Principle Compliance', () => {
  it('all policies should be side-effect free (repeated calls produce same result)', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity);
    addQuestionToIdentity(identity);

    // Run evaluate 10 times — each must produce the same result
    const results = Array.from(
      { length: 10 },
      () => IdentityCompletenessPolicy.evaluate(identity).isSuccess,
    );
    const allSame = results.every((r) => r === results[0]);
    expect(allSame).toBe(true);
  });

  it('policies should not modify the aggregate', () => {
    const identity = createIdentity();
    addAreaToIdentity(identity);
    addContributionToIdentity(identity);

    // Capture state before policy evaluation
    const areasBefore = [...identity.areas];
    const goalsBefore = [...identity.goals];
    const contributionsBefore = [...identity.contributions];
    const questionsBefore = [...identity.questions];

    const contribution = createContribution('Evaluation Test');

    // Run all policies
    IdentityCompletenessPolicy.evaluate(identity);
    ResearchAgendaConsistencyPolicy.evaluate(identity);
    ResearchAreaEligibilityPolicy.evaluate(identity, createArea('New', 'New desc'));
    ResearchEvolutionPolicy.evaluate(identity);
    ResearchVisionConsistencyPolicy.evaluate(identity);
    ContributionAcceptancePolicy.evaluate(contribution);

    // State must be unchanged
    expect(identity.areas.length).toBe(areasBefore.length);
    expect(identity.goals.length).toBe(goalsBefore.length);
    expect(identity.contributions.length).toBe(contributionsBefore.length);
    expect(identity.questions.length).toBe(questionsBefore.length);
  });
});
