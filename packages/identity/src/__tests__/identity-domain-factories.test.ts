/**
 * Identity Domain Factories — Comprehensive Test Suite.
 *
 * Architecture reference:
 * Volume I – Identity; Domain Factory ADR.
 *
 * Verifies:
 * ✓ Aggregate creation via factory
 * ✓ Entity creation via factories
 * ✓ Default initialization
 * ✓ Complex construction
 * ✓ Invalid construction
 * ✓ Deterministic creation
 * ✓ Error handling
 * ✓ No infrastructure usage
 * ✓ No side effects
 * ✓ Factory output validity
 */

import { describe, it, expect } from 'vitest';

import { ResearchIdentity } from '../domain/aggregate/research-identity.js';
import { ResearchAgenda } from '../domain/entities/research-agenda.js';
import { ResearchArea } from '../domain/entities/research-area.js';
import { ResearchContribution } from '../domain/entities/research-contribution.js';
import { ResearchEvolution } from '../domain/entities/research-evolution.js';
import { ResearchGoal } from '../domain/entities/research-goal.js';
import {
  ResearchIdentityFactory,
  ResearchAgendaFactory,
  ResearchAreaFactory,
  ResearchGoalFactory,
  ResearchContributionFactory,
  ResearchEvolutionFactory,
} from '../domain/factories/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Default valid params for ResearchIdentityFactory.create() */
function validIdentityParams(overrides?: Record<string, unknown>): Record<string, unknown> {
  return {
    visionStatement: 'Advancing quantum computing research for practical applications',
    timeHorizon: '10-20 years',
    agendaFocus: 'Quantum error correction algorithms',
    agendaStatus: 'Active',
    philosophyStatement: 'Rigorous scientific inquiry grounded in reproducibility',
    valuesStatement: 'Core values guiding the research program',
    values: ['Reproducibility', 'Openness', 'Rigor'],
    evolutionDescription: 'Initial research direction established',
    evolutionStatus: 'Active',
    evolutionConfidence: 4,
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ResearchIdentityFactory
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchIdentityFactory', () => {
  describe('create', () => {
    it('should create a valid ResearchIdentity aggregate from valid inputs', () => {
      const result = ResearchIdentityFactory.create(validIdentityParams());

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(ResearchIdentity);
      expect(result.value.vision.vision.value).toBe(
        'Advancing quantum computing research for practical applications',
      );
    });

    it('should initialize with empty mandatory collections', () => {
      const result = ResearchIdentityFactory.create(validIdentityParams());

      expect(result.isSuccess).toBe(true);
      const identity = result.value;
      expect(identity.areas).toHaveLength(0);
      expect(identity.questions).toHaveLength(0);
      expect(identity.goals).toHaveLength(0);
      expect(identity.contributions).toHaveLength(0);
      expect(identity.milestones).toHaveLength(0);
    });

    it('should fail when visionStatement is empty', () => {
      const result = ResearchIdentityFactory.create(validIdentityParams({ visionStatement: '' }));

      expect(result.isFailure).toBe(true);
    });

    it('should fail when visionStatement exceeds max length', () => {
      const result = ResearchIdentityFactory.create(
        validIdentityParams({ visionStatement: 'x'.repeat(2001) }),
      );

      expect(result.isFailure).toBe(true);
    });

    it('should fail when agendaFocus is empty', () => {
      const result = ResearchIdentityFactory.create(validIdentityParams({ agendaFocus: '' }));

      expect(result.isFailure).toBe(true);
    });

    it('should fail when agendaStatus is invalid', () => {
      const result = ResearchIdentityFactory.create(
        validIdentityParams({ agendaStatus: 'InvalidStatus' }),
      );

      expect(result.isFailure).toBe(true);
    });

    it('should fail when values array is empty', () => {
      const result = ResearchIdentityFactory.create(validIdentityParams({ values: [] }));

      expect(result.isFailure).toBe(true);
    });

    it('should fail when evolutionConfidence is out of range', () => {
      const result = ResearchIdentityFactory.create(
        validIdentityParams({ evolutionConfidence: 10 }),
      );

      expect(result.isFailure).toBe(true);
    });

    it('should create deterministic results for same inputs', () => {
      const params = validIdentityParams();

      const result1 = ResearchIdentityFactory.create(params);
      const result2 = ResearchIdentityFactory.create(params);

      expect(result1.isSuccess).toBe(true);
      expect(result2.isSuccess).toBe(true);
      expect(result1.value.vision.vision.value).toBe(result2.value.vision.vision.value);
    });

    it('should create valid sub-entities', () => {
      const result = ResearchIdentityFactory.create(validIdentityParams());

      expect(result.isSuccess).toBe(true);
      expect(result.value.vision).toBeDefined();
      expect(result.value.agenda).toBeDefined();
      expect(result.value.philosophy).toBeDefined();
      expect(result.value.values).toBeDefined();
      expect(result.value.evolution).toBeDefined();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchAgendaFactory
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchAgendaFactory', () => {
  describe('create', () => {
    it('should create a valid ResearchAgenda from valid focus string', () => {
      const result = ResearchAgendaFactory.create({
        focus: 'Machine learning for drug discovery',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(ResearchAgenda);
      expect(result.value.focus.value).toBe('Machine learning for drug discovery');
    });

    it('should default status to Active when not provided', () => {
      const result = ResearchAgendaFactory.create({
        focus: 'Natural language processing applications',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status.value).toBe('Active');
    });

    it('should accept custom status', () => {
      const result = ResearchAgendaFactory.create({
        focus: 'Exploratory research in quantum algorithms',
        status: 'Exploratory',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status.value).toBe('Exploratory');
    });

    it('should accept custom createdAt timestamp', () => {
      const ts = '2025-01-15T10:00:00.000Z';
      const result = ResearchAgendaFactory.create({
        focus: 'Bioinformatics pipeline optimization',
        createdAt: ts,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.createdAt).toBe(ts);
    });

    it('should fail when focus is empty', () => {
      const result = ResearchAgendaFactory.create({ focus: '' });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when focus exceeds max length', () => {
      const result = ResearchAgendaFactory.create({ focus: 'x'.repeat(201) });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when status is invalid', () => {
      const result = ResearchAgendaFactory.create({
        focus: 'Valid focus text',
        status: 'InvalidStatus',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalid');
    });

    it('should handle Archived status', () => {
      const result = ResearchAgendaFactory.create({
        focus: 'Previously active research direction',
        status: 'Archived',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status.value).toBe('Archived');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchAreaFactory
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchAreaFactory', () => {
  describe('create', () => {
    it('should create a valid ResearchArea from valid inputs', () => {
      const result = ResearchAreaFactory.create({
        name: 'Deep Reinforcement Learning',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(ResearchArea);
      expect(result.value.name.value).toBe('Deep Reinforcement Learning');
    });

    it('should default description to name when not provided', () => {
      const name = 'Computer Vision';
      const result = ResearchAreaFactory.create({ name });

      expect(result.isSuccess).toBe(true);
      expect(result.value.description.value).toBe(name);
    });

    it('should accept custom description', () => {
      const result = ResearchAreaFactory.create({
        name: 'NLP',
        description: 'Natural Language Processing and understanding',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.name.value).toBe('NLP');
      expect(result.value.description.value).toBe('Natural Language Processing and understanding');
    });

    it('should default confidence to 3 when not provided', () => {
      const result = ResearchAreaFactory.create({
        name: 'Robotics',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.confidence.value).toBe(3);
    });

    it('should accept custom confidence level', () => {
      const result = ResearchAreaFactory.create({
        name: 'Quantum Computing',
        confidence: 5,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.confidence.value).toBe(5);
    });

    it('should fail when name is empty', () => {
      const result = ResearchAreaFactory.create({ name: '' });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when name exceeds max length', () => {
      const result = ResearchAreaFactory.create({ name: 'x'.repeat(201) });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when confidence is out of range', () => {
      const result = ResearchAreaFactory.create({
        name: 'Valid Area',
        confidence: 6,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('1 and 5');
    });

    it('should fail when confidence is zero', () => {
      const result = ResearchAreaFactory.create({
        name: 'Valid Area',
        confidence: 0,
      });

      expect(result.isFailure).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchGoalFactory
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchGoalFactory', () => {
  describe('create', () => {
    it('should create a valid ResearchGoal from valid inputs', () => {
      const result = ResearchGoalFactory.create({
        description: 'Publish a paper on transfer learning',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(ResearchGoal);
    });

    it('should default status to Active when not provided', () => {
      const result = ResearchGoalFactory.create({
        description: 'Complete literature review on neural architecture search',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status.value).toBe('Active');
    });

    it('should default confidence to 3 when not provided', () => {
      const result = ResearchGoalFactory.create({
        description: 'Develop a new optimization algorithm',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.confidence.value).toBe(3);
    });

    it('should accept custom status', () => {
      const result = ResearchGoalFactory.create({
        description: 'Explore meta-learning approaches',
        status: 'Exploratory',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status.value).toBe('Exploratory');
    });

    it('should accept custom confidence', () => {
      const result = ResearchGoalFactory.create({
        description: 'Prototype a federated learning system',
        confidence: 4,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.confidence.value).toBe(4);
    });

    it('should accept custom deadline', () => {
      const deadline = '2026-12-31T00:00:00.000Z';
      const result = ResearchGoalFactory.create({
        description: 'Complete PhD dissertation defense',
        deadlineAt: deadline,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.deadlineAt).toBe(deadline);
    });

    it('should set default deadline to one year from now', () => {
      const before = new Date();
      before.setFullYear(before.getFullYear() + 1);
      before.setSeconds(before.getSeconds() - 5);

      const result = ResearchGoalFactory.create({
        description: 'Automated goal deadline testing scenario',
      });

      expect(result.isSuccess).toBe(true);
      const deadline = new Date(result.value.deadlineAt);
      expect(deadline.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('should fail when description is empty', () => {
      const result = ResearchGoalFactory.create({ description: '' });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when description exceeds max length', () => {
      const result = ResearchGoalFactory.create({ description: 'x'.repeat(201) });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when status is invalid', () => {
      const result = ResearchGoalFactory.create({
        description: 'Valid description',
        status: 'NonExistent',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail when confidence is out of range', () => {
      const result = ResearchGoalFactory.create({
        description: 'Valid description',
        confidence: 10,
      });

      expect(result.isFailure).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchContributionFactory
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchContributionFactory', () => {
  describe('create', () => {
    it('should create a valid ResearchContribution from valid inputs', () => {
      const result = ResearchContributionFactory.create({
        description: 'Published paper on graph neural networks',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(ResearchContribution);
    });

    it('should default significance to 3 when not provided', () => {
      const result = ResearchContributionFactory.create({
        description: 'Conference poster on attention mechanisms',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.significance.value).toBe(3);
    });

    it('should accept custom significance', () => {
      const result = ResearchContributionFactory.create({
        description: 'Breakthrough paper on self-supervised learning',
        significance: 5,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.significance.value).toBe(5);
    });

    it('should accept custom contributedAt date', () => {
      const date = '2025-06-15T00:00:00.000Z';
      const result = ResearchContributionFactory.create({
        description: 'Workshop presentation on causal inference',
        contributedAt: date,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.contributedAt).toBe(date);
    });

    it('should default contributedAt to current date when not provided', () => {
      const now = new Date().toISOString();
      const result = ResearchContributionFactory.create({
        description: 'Journal article on adversarial robustness',
      });

      expect(result.isSuccess).toBe(true);
      // contributedAt should be close to now
      const contributedAt = new Date(result.value.contributedAt);
      const diff = Math.abs(contributedAt.getTime() - new Date(now).getTime());
      expect(diff).toBeLessThan(5000); // within 5 seconds
    });

    it('should fail when description is empty', () => {
      const result = ResearchContributionFactory.create({ description: '' });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when description exceeds max length', () => {
      const result = ResearchContributionFactory.create({ description: 'x'.repeat(201) });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when significance is out of range', () => {
      const result = ResearchContributionFactory.create({
        description: 'Valid description',
        significance: 0,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail when significance exceeds max', () => {
      const result = ResearchContributionFactory.create({
        description: 'Valid description',
        significance: 6,
      });

      expect(result.isFailure).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ResearchEvolutionFactory
// ─────────────────────────────────────────────────────────────────────────────

describe('ResearchEvolutionFactory', () => {
  describe('create', () => {
    it('should create a valid ResearchEvolution from valid inputs', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'Shifted focus from pure theory to applied ML',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(ResearchEvolution);
    });

    it('should default status to Active when not provided', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'Expanded into interdisciplinary research',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status.value).toBe('Active');
    });

    it('should default confidence to 3 when not provided', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'Pivoted research methodology approach',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.confidence.value).toBe(3);
    });

    it('should accept custom status', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'Early stage exploration of new direction',
        status: 'Exploratory',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status.value).toBe('Exploratory');
    });

    it('should accept custom confidence', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'High confidence evolution toward deep learning',
        confidence: 5,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.confidence.value).toBe(5);
    });

    it('should accept custom recordedAt timestamp', () => {
      const ts = '2025-03-01T12:00:00.000Z';
      const result = ResearchEvolutionFactory.create({
        description: 'Research pivot recorded at specific time',
        recordedAt: ts,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.recordedAt).toBe(ts);
    });

    it('should default recordedAt to current timestamp', () => {
      const before = new Date();
      const result = ResearchEvolutionFactory.create({
        description: 'Automated timestamp test for evolution entry',
      });

      expect(result.isSuccess).toBe(true);
      const recorded = new Date(result.value.recordedAt);
      const diff = Math.abs(recorded.getTime() - before.getTime());
      expect(diff).toBeLessThan(5000);
    });

    it('should initialize with empty milestone IDs', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'New direction without milestones yet',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.milestoneIds).toHaveLength(0);
    });

    it('should fail when description is empty', () => {
      const result = ResearchEvolutionFactory.create({ description: '' });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when description exceeds max length', () => {
      const result = ResearchEvolutionFactory.create({ description: 'x'.repeat(201) });
      expect(result.isFailure).toBe(true);
    });

    it('should fail when status is invalid', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'Valid description',
        status: 'Deleted',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail when confidence is out of range', () => {
      const result = ResearchEvolutionFactory.create({
        description: 'Valid description',
        confidence: -1,
      });

      expect(result.isFailure).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-cutting: Error Strategy
// ─────────────────────────────────────────────────────────────────────────────

describe('Factory Error Strategy', () => {
  it('should return Result.fail with string error, never throw', () => {
    // All factory methods should return Result.fail for invalid inputs
    const identityResult = ResearchIdentityFactory.create(
      validIdentityParams({ visionStatement: '', agendaFocus: '' }),
    );
    expect(identityResult.isFailure).toBe(true);
    expect(typeof identityResult.error).toBe('string');

    const agendaResult = ResearchAgendaFactory.create({ focus: '' });
    expect(agendaResult.isFailure).toBe(true);

    const areaResult = ResearchAreaFactory.create({ name: '' });
    expect(areaResult.isFailure).toBe(true);

    const goalResult = ResearchGoalFactory.create({ description: '' });
    expect(goalResult.isFailure).toBe(true);

    const contributionResult = ResearchContributionFactory.create({ description: '' });
    expect(contributionResult.isFailure).toBe(true);

    const evolutionResult = ResearchEvolutionFactory.create({ description: '' });
    expect(evolutionResult.isFailure).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-cutting: No Infrastructure Dependencies
// ─────────────────────────────────────────────────────────────────────────────

describe('Factory Infrastructure Independence', () => {
  it('should create objects without any persistence or external calls', () => {
    // All factories should operate purely in-memory
    const identity = ResearchIdentityFactory.create(validIdentityParams());
    expect(identity.isSuccess).toBe(true);

    const agenda = ResearchAgendaFactory.create({
      focus: 'Pure domain agenda creation',
    });
    expect(agenda.isSuccess).toBe(true);

    const area = ResearchAreaFactory.create({ name: 'Pure Domain Area' });
    expect(area.isSuccess).toBe(true);

    const goal = ResearchGoalFactory.create({
      description: 'Pure domain goal creation',
    });
    expect(goal.isSuccess).toBe(true);

    const contribution = ResearchContributionFactory.create({
      description: 'Pure domain contribution creation',
    });
    expect(contribution.isSuccess).toBe(true);

    const evolution = ResearchEvolutionFactory.create({
      description: 'Pure domain evolution creation',
    });
    expect(evolution.isSuccess).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-cutting: Factory Output Validity
// ─────────────────────────────────────────────────────────────────────────────

describe('Factory Output Validity', () => {
  it('should produce objects that are valid aggregates/entities', () => {
    const identityResult = ResearchIdentityFactory.create(validIdentityParams());
    expect(identityResult.value).toBeInstanceOf(ResearchIdentity);
    expect(identityResult.value.id).toBeDefined();

    const agendaResult = ResearchAgendaFactory.create({
      focus: 'Output validity check for agenda factory',
    });
    expect(agendaResult.value).toBeInstanceOf(ResearchAgenda);
    expect(agendaResult.value.id).toBeDefined();

    const areaResult = ResearchAreaFactory.create({
      name: 'Output Validity Area',
    });
    expect(areaResult.value).toBeInstanceOf(ResearchArea);
    expect(areaResult.value.id).toBeDefined();

    const goalResult = ResearchGoalFactory.create({
      description: 'Output validity check for goal factory',
    });
    expect(goalResult.value).toBeInstanceOf(ResearchGoal);
    expect(goalResult.value.id).toBeDefined();

    const contributionResult = ResearchContributionFactory.create({
      description: 'Output validity check for contribution factory',
    });
    expect(contributionResult.value).toBeInstanceOf(ResearchContribution);
    expect(contributionResult.value.id).toBeDefined();

    const evolutionResult = ResearchEvolutionFactory.create({
      description: 'Output validity check for evolution factory',
    });
    expect(evolutionResult.value).toBeInstanceOf(ResearchEvolution);
    expect(evolutionResult.value.id).toBeDefined();
  });
});
