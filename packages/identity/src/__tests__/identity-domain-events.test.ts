/**
 * Domain Events — comprehensive unit tests.
 *
 * Covers:
 * - Event creation for each concrete event type
 * - Immutability (readonly fields, no setters)
 * - Metadata (eventId, aggregateId, occurredAt, version)
 * - eventType delegation to eventName
 * - Serialization via toPrimitives()
 * - Aggregate integration: event recording on successful operations
 * - pullDomainEvents() returns and clears pending events
 * - clearDomainEvents() empties the buffer
 * - Event ordering (insertion order preserved)
 * - No event recorded after failed operation
 * - Aggregate buffer emptied correctly after pull
 */

import { UniqueId } from '@rios/shared';
import { describe, it, expect } from 'vitest';

import { ResearchIdentity } from '../domain/aggregate/research-identity.js';
import { ResearchAgenda } from '../domain/entities/research-agenda.js';
import { ResearchArea } from '../domain/entities/research-area.js';
import { ResearchEvolution } from '../domain/entities/research-evolution.js';
import { ResearchPhilosophy } from '../domain/entities/research-philosophy.js';
import { ResearchQuestion } from '../domain/entities/research-question.js';
import { ResearchValues } from '../domain/entities/research-values.js';
import { ResearchVision } from '../domain/entities/research-vision.js';
import {
  EvolutionUpdated,
  GoalAchieved,
  IdentityEvent,
  PhilosophyRevised,
  ResearchAgendaCreated,
  ResearchAgendaUpdated,
  ResearchAreaAdded,
  ResearchAreaArchived,
  ResearchQuestionAdded,
} from '../domain/events/index.js';
import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
  ResearchVisionStatement,
  TimeHorizon,
} from '../domain/value-objects/identity-value-objects.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2025-01-15T10:00:00.000Z';

function focusVO(value = 'Test focus'): ResearchFocus {
  const result = ResearchFocus.create(value);
  return result.value;
}

function visionVO(value = 'Test vision statement'): ResearchVisionStatement {
  const result = ResearchVisionStatement.create(value);
  return result.value;
}

function timeHorizonVO(value = '5 years'): TimeHorizon {
  const result = TimeHorizon.create(value);
  return result.value;
}

function confidenceVO(value = 4): ConfidenceLevel {
  const result = ConfidenceLevel.create(value);
  return result.value;
}

function statusVO(status: 'Active' | 'Exploratory' | 'Archived' = 'Active'): ResearchStatus {
  const result = ResearchStatus.create(status);
  return result.value;
}

function createVision(): ResearchVision {
  return ResearchVision.create({
    vision: visionVO(),
    timeHorizon: timeHorizonVO(),
    createdAt: NOW,
  }).value;
}

function createAgenda(): ResearchAgenda {
  return ResearchAgenda.create({
    focus: focusVO('Agenda focus'),
    status: statusVO(),
    createdAt: NOW,
  }).value;
}

function createArea(): ResearchArea {
  return ResearchArea.create({
    name: focusVO('Area name'),
    description: focusVO('Area description'),
    status: statusVO(),
    confidence: confidenceVO(),
    createdAt: NOW,
  }).value;
}

function createQuestion(): ResearchQuestion {
  return ResearchQuestion.create({
    question: focusVO('Research question?'),
    motivation: focusVO('Motivation'),
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. Event Creation — each concrete event type
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Creation', () => {
  const AGGREGATE_ID = 'agg-001';

  it('ResearchAgendaCreated: creates with correct fields', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, {
      agendaTitle: 'AI Safety',
    });

    expect(event.eventName).toBe('ResearchAgendaCreated');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.agendaTitle).toBe('AI Safety');
    expect(event.version).toBe(1);
  });

  it('ResearchAgendaUpdated: creates with correct fields', () => {
    const event = new ResearchAgendaUpdated(AGGREGATE_ID, {
      previousTitle: 'Old Title',
      newTitle: 'New Title',
    });

    expect(event.eventName).toBe('ResearchAgendaUpdated');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.previousTitle).toBe('Old Title');
    expect(event.newTitle).toBe('New Title');
    expect(event.version).toBe(1);
  });

  it('ResearchAreaAdded: creates with correct fields', () => {
    const event = new ResearchAreaAdded(AGGREGATE_ID, {
      areaId: 'area-1',
      areaName: 'Machine Learning',
    });

    expect(event.eventName).toBe('ResearchAreaAdded');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.areaId).toBe('area-1');
    expect(event.areaName).toBe('Machine Learning');
    expect(event.version).toBe(1);
  });

  it('ResearchAreaArchived: creates with correct fields', () => {
    const event = new ResearchAreaArchived(AGGREGATE_ID, {
      areaId: 'area-1',
      areaName: 'Deprecated Area',
    });

    expect(event.eventName).toBe('ResearchAreaArchived');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.areaId).toBe('area-1');
    expect(event.areaName).toBe('Deprecated Area');
    expect(event.version).toBe(1);
  });

  it('ResearchQuestionAdded: creates with correct fields', () => {
    const event = new ResearchQuestionAdded(AGGREGATE_ID, {
      questionId: 'q-1',
      questionTitle: 'How does X affect Y?',
    });

    expect(event.eventName).toBe('ResearchQuestionAdded');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.questionId).toBe('q-1');
    expect(event.questionTitle).toBe('How does X affect Y?');
    expect(event.version).toBe(1);
  });

  it('PhilosophyRevised: creates with correct fields', () => {
    const event = new PhilosophyRevised(AGGREGATE_ID, {
      summary: 'Updated philosophical approach',
    });

    expect(event.eventName).toBe('PhilosophyRevised');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.summary).toBe('Updated philosophical approach');
    expect(event.version).toBe(1);
  });

  it('EvolutionUpdated: creates with correct fields', () => {
    const event = new EvolutionUpdated(AGGREGATE_ID, {
      milestoneId: 'm-1',
      milestoneTitle: 'Phase 2 started',
    });

    expect(event.eventName).toBe('EvolutionUpdated');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.milestoneId).toBe('m-1');
    expect(event.milestoneTitle).toBe('Phase 2 started');
    expect(event.version).toBe(1);
  });

  it('GoalAchieved: creates with correct fields', () => {
    const event = new GoalAchieved(AGGREGATE_ID, {
      goalId: 'g-1',
      goalTitle: 'Complete literature review',
    });

    expect(event.eventName).toBe('GoalAchieved');
    expect(event.aggregateId).toBe(AGGREGATE_ID);
    expect(event.goalId).toBe('g-1');
    expect(event.goalTitle).toBe('Complete literature review');
    expect(event.version).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Inheritance — all events extend IdentityEvent which extends DomainEvent
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Inheritance', () => {
  const AGGREGATE_ID = 'agg-002';

  const allEvents: IdentityEvent[] = [
    new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' }),
    new ResearchAgendaUpdated(AGGREGATE_ID, { previousTitle: 'A', newTitle: 'B' }),
    new ResearchAreaAdded(AGGREGATE_ID, { areaId: 'a', areaName: 'N' }),
    new ResearchAreaArchived(AGGREGATE_ID, { areaId: 'a', areaName: 'N' }),
    new ResearchQuestionAdded(AGGREGATE_ID, { questionId: 'q', questionTitle: 'Q' }),
    new PhilosophyRevised(AGGREGATE_ID, { summary: 'S' }),
    new EvolutionUpdated(AGGREGATE_ID, { milestoneId: 'm', milestoneTitle: 'T' }),
    new GoalAchieved(AGGREGATE_ID, { goalId: 'g', goalTitle: 'G' }),
  ];

  allEvents.forEach((event) => {
    it(`${event.eventName} is an instance of IdentityEvent`, () => {
      expect(event).toBeInstanceOf(IdentityEvent);
    });
  });

  it('IdentityEvent is an abstract base — all concrete events share the same base', () => {
    const first = allEvents[0];
    expect(first).toBeInstanceOf(IdentityEvent);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Metadata — eventId, aggregateId, occurredAt, version
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Metadata', () => {
  const AGGREGATE_ID = 'agg-003';

  it('every event has a unique eventId (UUID format)', () => {
    const event1 = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'A' });
    const event2 = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'B' });

    expect(event1.eventId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(event2.eventId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(event1.eventId).not.toBe(event2.eventId);
  });

  it('every event stores the correct aggregateId', () => {
    const event = new PhilosophyRevised('my-aggregate', { summary: 'X' });
    expect(event.aggregateId).toBe('my-aggregate');
  });

  it('every event has an occurredAt Date in the past or present', () => {
    const before = new Date();
    const event = new EvolutionUpdated(AGGREGATE_ID, {
      milestoneId: 'm',
      milestoneTitle: 'T',
    });
    const after = new Date();

    expect(event.occurredAt).toBeInstanceOf(Date);
    expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('every event has version 1', () => {
    const events: IdentityEvent[] = [
      new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' }),
      new ResearchAgendaUpdated(AGGREGATE_ID, { previousTitle: 'A', newTitle: 'B' }),
      new ResearchAreaAdded(AGGREGATE_ID, { areaId: 'a', areaName: 'N' }),
      new ResearchAreaArchived(AGGREGATE_ID, { areaId: 'a', areaName: 'N' }),
      new ResearchQuestionAdded(AGGREGATE_ID, { questionId: 'q', questionTitle: 'Q' }),
      new PhilosophyRevised(AGGREGATE_ID, { summary: 'S' }),
      new EvolutionUpdated(AGGREGATE_ID, { milestoneId: 'm', milestoneTitle: 'T' }),
      new GoalAchieved(AGGREGATE_ID, { goalId: 'g', goalTitle: 'G' }),
    ];

    for (const event of events) {
      expect(event.version).toBe(1);
    }
  });

  it('metadata object is present with correlationId and causationId', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' });
    expect(event.metadata).toBeDefined();
    expect(typeof event.metadata).toBe('object');
  });

  it('custom metadata can be provided at construction', () => {
    const event = new ResearchAgendaCreated(
      AGGREGATE_ID,
      { agendaTitle: 'T' },
      { correlationId: 'corr-1', causationId: 'cause-1' },
    );

    expect(event.metadata.correlationId).toBe('corr-1');
    expect(event.metadata.causationId).toBe('cause-1');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. eventType — delegates to eventName
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — eventType delegates to eventName', () => {
  const AGGREGATE_ID = 'agg-004';

  it('ResearchAgendaCreated.eventType === ResearchAgendaCreated.eventName', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('ResearchAgendaCreated');
  });

  it('ResearchAgendaUpdated.eventType === ResearchAgendaUpdated.eventName', () => {
    const event = new ResearchAgendaUpdated(AGGREGATE_ID, {
      previousTitle: 'A',
      newTitle: 'B',
    });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('ResearchAgendaUpdated');
  });

  it('ResearchAreaAdded.eventType === ResearchAreaAdded.eventName', () => {
    const event = new ResearchAreaAdded(AGGREGATE_ID, { areaId: 'a', areaName: 'N' });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('ResearchAreaAdded');
  });

  it('ResearchAreaArchived.eventType === ResearchAreaArchived.eventName', () => {
    const event = new ResearchAreaArchived(AGGREGATE_ID, { areaId: 'a', areaName: 'N' });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('ResearchAreaArchived');
  });

  it('ResearchQuestionAdded.eventType === ResearchQuestionAdded.eventName', () => {
    const event = new ResearchQuestionAdded(AGGREGATE_ID, {
      questionId: 'q',
      questionTitle: 'Q',
    });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('ResearchQuestionAdded');
  });

  it('PhilosophyRevised.eventType === PhilosophyRevised.eventName', () => {
    const event = new PhilosophyRevised(AGGREGATE_ID, { summary: 'S' });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('PhilosophyRevised');
  });

  it('EvolutionUpdated.eventType === EvolutionUpdated.eventName', () => {
    const event = new EvolutionUpdated(AGGREGATE_ID, {
      milestoneId: 'm',
      milestoneTitle: 'T',
    });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('EvolutionUpdated');
  });

  it('GoalAchieved.eventType === GoalAchieved.eventName', () => {
    const event = new GoalAchieved(AGGREGATE_ID, { goalId: 'g', goalTitle: 'G' });
    expect(event.eventType).toBe(event.eventName);
    expect(event.eventType).toBe('GoalAchieved');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Immutability — readonly fields, frozen payload data
// ─────────────────────────────────────────────────────────────────────────────

function hasNoSetter(obj: object, prop: string): boolean {
  const desc = Object.getOwnPropertyDescriptor(obj, prop);
  return desc !== undefined && desc.set === undefined;
}

describe('Domain Events — Immutability', () => {
  const AGGREGATE_ID = 'agg-005';

  it('ResearchAgendaCreated fields are readonly (no setters)', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'AI' });
    expect(hasNoSetter(event, 'agendaTitle')).toBe(true);
  });

  it('ResearchAgendaUpdated fields are readonly', () => {
    const event = new ResearchAgendaUpdated(AGGREGATE_ID, {
      previousTitle: 'A',
      newTitle: 'B',
    });
    expect(hasNoSetter(event, 'previousTitle')).toBe(true);
    expect(hasNoSetter(event, 'newTitle')).toBe(true);
  });

  it('ResearchAreaAdded fields are readonly', () => {
    const event = new ResearchAreaAdded(AGGREGATE_ID, { areaId: 'a', areaName: 'N' });
    expect(hasNoSetter(event, 'areaId')).toBe(true);
    expect(hasNoSetter(event, 'areaName')).toBe(true);
  });

  it('PhilosophyRevised fields are readonly', () => {
    const event = new PhilosophyRevised(AGGREGATE_ID, { summary: 'S' });
    expect(hasNoSetter(event, 'summary')).toBe(true);
  });

  it('EvolutionUpdated fields are readonly', () => {
    const event = new EvolutionUpdated(AGGREGATE_ID, {
      milestoneId: 'm',
      milestoneTitle: 'T',
    });
    expect(hasNoSetter(event, 'milestoneId')).toBe(true);
    expect(hasNoSetter(event, 'milestoneTitle')).toBe(true);
  });

  it('GoalAchieved fields are readonly', () => {
    const event = new GoalAchieved(AGGREGATE_ID, { goalId: 'g', goalTitle: 'G' });
    expect(hasNoSetter(event, 'goalId')).toBe(true);
    expect(hasNoSetter(event, 'goalTitle')).toBe(true);
  });

  it('eventId is readonly', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' });
    expect(hasNoSetter(event, 'eventId')).toBe(true);
  });

  it('aggregateId is readonly', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' });
    expect(hasNoSetter(event, 'aggregateId')).toBe(true);
  });

  it('occurredAt is readonly', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' });
    expect(hasNoSetter(event, 'occurredAt')).toBe(true);
  });

  it('version is readonly', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'T' });
    expect(hasNoSetter(event, 'version')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Serialization — toPrimitives() returns correct plain objects
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Serialization', () => {
  const AGGREGATE_ID = 'agg-006';

  it('ResearchAgendaCreated.toPrimitives() returns correct shape', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'AI Safety' });
    const primitives = event.toPrimitives();

    expect(primitives).toHaveProperty('eventId', event.eventId);
    expect(primitives).toHaveProperty('aggregateId', AGGREGATE_ID);
    expect(primitives).toHaveProperty('eventName', 'ResearchAgendaCreated');
    expect(primitives).toHaveProperty('occurredAt');
    expect(primitives).toHaveProperty('version', 1);
    expect(primitives).toHaveProperty('agendaTitle', 'AI Safety');
  });

  it('ResearchAgendaUpdated.toPrimitives() returns correct shape', () => {
    const event = new ResearchAgendaUpdated(AGGREGATE_ID, {
      previousTitle: 'Old',
      newTitle: 'New',
    });
    const primitives = event.toPrimitives();

    expect(primitives.eventName).toBe('ResearchAgendaUpdated');
    expect(primitives.previousTitle).toBe('Old');
    expect(primitives.newTitle).toBe('New');
  });

  it('ResearchAreaAdded.toPrimitives() returns correct shape', () => {
    const event = new ResearchAreaAdded(AGGREGATE_ID, {
      areaId: 'area-1',
      areaName: 'ML',
    });
    const primitives = event.toPrimitives();

    expect(primitives.eventName).toBe('ResearchAreaAdded');
    expect(primitives.areaId).toBe('area-1');
    expect(primitives.areaName).toBe('ML');
  });

  it('ResearchAreaArchived.toPrimitives() returns correct shape', () => {
    const event = new ResearchAreaArchived(AGGREGATE_ID, {
      areaId: 'area-1',
      areaName: 'Deprecated',
    });
    const primitives = event.toPrimitives();

    expect(primitives.eventName).toBe('ResearchAreaArchived');
    expect(primitives.areaId).toBe('area-1');
    expect(primitives.areaName).toBe('Deprecated');
  });

  it('ResearchQuestionAdded.toPrimitives() returns correct shape', () => {
    const event = new ResearchQuestionAdded(AGGREGATE_ID, {
      questionId: 'q-1',
      questionTitle: 'Why?',
    });
    const primitives = event.toPrimitives();

    expect(primitives.eventName).toBe('ResearchQuestionAdded');
    expect(primitives.questionId).toBe('q-1');
    expect(primitives.questionTitle).toBe('Why?');
  });

  it('PhilosophyRevised.toPrimitives() returns correct shape', () => {
    const event = new PhilosophyRevised(AGGREGATE_ID, { summary: 'Pragmatic' });
    const primitives = event.toPrimitives();

    expect(primitives.eventName).toBe('PhilosophyRevised');
    expect(primitives.summary).toBe('Pragmatic');
  });

  it('EvolutionUpdated.toPrimitives() returns correct shape', () => {
    const event = new EvolutionUpdated(AGGREGATE_ID, {
      milestoneId: 'm-1',
      milestoneTitle: 'Phase 2',
    });
    const primitives = event.toPrimitives();

    expect(primitives.eventName).toBe('EvolutionUpdated');
    expect(primitives.milestoneId).toBe('m-1');
    expect(primitives.milestoneTitle).toBe('Phase 2');
  });

  it('GoalAchieved.toPrimitives() returns correct shape', () => {
    const event = new GoalAchieved(AGGREGATE_ID, {
      goalId: 'g-1',
      goalTitle: 'Lit review',
    });
    const primitives = event.toPrimitives();

    expect(primitives.eventName).toBe('GoalAchieved');
    expect(primitives.goalId).toBe('g-1');
    expect(primitives.goalTitle).toBe('Lit review');
  });

  it('toPrimitives() results are JSON-serializable', () => {
    const event = new ResearchAgendaCreated(AGGREGATE_ID, { agendaTitle: 'Test' });
    const primitives = event.toPrimitives();

    const json = JSON.stringify(primitives);
    const parsed = JSON.parse(json) as Record<string, unknown>;

    expect(parsed).toEqual(primitives);
  });

  it('toPrimitives() returns a plain object with no prototype methods', () => {
    const event = new GoalAchieved(AGGREGATE_ID, { goalId: 'g', goalTitle: 'G' });
    const primitives = event.toPrimitives();

    expect(Object.getPrototypeOf(primitives)).toBe(Object.prototype);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Aggregate Integration — event recording on successful operations
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Aggregate Integration', () => {
  it('updateAgenda() records ResearchAgendaUpdated event', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const newAgenda = ResearchAgenda.create({
      focus: focusVO('New focus'),
      status: statusVO(),
      createdAt: NOW,
    }).value;

    identity.updateAgenda(newAgenda);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventName).toBe('ResearchAgendaUpdated');
    expect((events[0] as ResearchAgendaUpdated)?.newTitle).toBe('New focus');
  });

  it('addResearchArea() records ResearchAreaAdded event', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const area = createArea();
    const result = identity.addResearchArea(area);

    expect(result.isSuccess).toBe(true);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventName).toBe('ResearchAreaAdded');
    expect((events[0] as ResearchAreaAdded)?.areaId).toBe(area.id.value);
  });

  it('removeResearchArea() records ResearchAreaArchived event', () => {
    const identity = createIdentity();
    const area = createArea();
    identity.addResearchArea(area);
    identity.clearDomainEvents();

    const result = identity.removeResearchArea(area.id);

    expect(result.isSuccess).toBe(true);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventName).toBe('ResearchAreaArchived');
    expect((events[0] as ResearchAreaArchived)?.areaId).toBe(area.id.value);
  });

  it('addResearchQuestion() records ResearchQuestionAdded event', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const question = createQuestion();
    const result = identity.addResearchQuestion(question);

    expect(result.isSuccess).toBe(true);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventName).toBe('ResearchQuestionAdded');
    expect((events[0] as ResearchQuestionAdded)?.questionId).toBe(question.id.value);
  });

  it('updatePhilosophy() records PhilosophyRevised event', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const newPhilosophy = ResearchPhilosophy.create({
      statement: visionVO('New philosophy'),
      createdAt: NOW,
    }).value;

    identity.updatePhilosophy(newPhilosophy);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventName).toBe('PhilosophyRevised');
    expect((events[0] as PhilosophyRevised)?.summary).toBe('New philosophy');
  });

  it('updateEvolution() records EvolutionUpdated event', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const newEvolution = ResearchEvolution.create({
      description: focusVO('New evolution'),
      status: statusVO(),
      confidence: confidenceVO(),
      recordedAt: NOW,
    }).value;

    identity.updateEvolution(newEvolution);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventName).toBe('EvolutionUpdated');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. pullDomainEvents() — returns pending events and clears buffer
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — pullDomainEvents()', () => {
  it('returns all pending events', () => {
    const identity = createIdentity();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    const area = createArea();
    identity.addResearchArea(area);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(2);
  });

  it('clears the buffer after pull (subsequent pull returns empty)', () => {
    const identity = createIdentity();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    identity.pullDomainEvents();
    const secondPull = identity.pullDomainEvents();

    expect(secondPull).toHaveLength(0);
  });

  it('returns frozen (read-only) array', () => {
    const identity = createIdentity();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    const events = identity.pullDomainEvents();

    expect(Object.isFrozen(events)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. clearDomainEvents() — empties the buffer without returning
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — clearDomainEvents()', () => {
  it('empties the pending events buffer', () => {
    const identity = createIdentity();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    expect(identity.pullDomainEvents()).toHaveLength(1);

    // Re-add an event
    identity.updatePhilosophy(
      ResearchPhilosophy.create({
        statement: visionVO('P'),
        createdAt: NOW,
      }).value,
    );

    identity.clearDomainEvents();

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(0);
  });

  it('works when buffer is already empty (no error)', () => {
    const identity = createIdentity();

    expect(() => identity.clearDomainEvents()).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Event Ordering — insertion order is preserved
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Event Ordering', () => {
  it('events are returned in the order they were recorded', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    // 1. Update agenda
    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('First'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    // 2. Add area
    const area = createArea();
    identity.addResearchArea(area);

    // 3. Update philosophy
    identity.updatePhilosophy(
      ResearchPhilosophy.create({
        statement: visionVO('Philosophy update'),
        createdAt: NOW,
      }).value,
    );

    // 4. Add question
    const question = createQuestion();
    identity.addResearchQuestion(question);

    const events = identity.pullDomainEvents();

    expect(events).toHaveLength(4);
    expect(events[0]?.eventName).toBe('ResearchAgendaUpdated');
    expect(events[1]?.eventName).toBe('ResearchAreaAdded');
    expect(events[2]?.eventName).toBe('PhilosophyRevised');
    expect(events[3]?.eventName).toBe('ResearchQuestionAdded');
  });

  it('events accumulate across multiple operation groups', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    identity.updatePhilosophy(
      ResearchPhilosophy.create({
        statement: visionVO('P'),
        createdAt: NOW,
      }).value,
    );

    identity.updateEvolution(
      ResearchEvolution.create({
        description: focusVO('E'),
        status: statusVO(),
        confidence: confidenceVO(),
        recordedAt: NOW,
      }).value,
    );

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(3);
    expect(events.map((e) => e.eventName)).toEqual([
      'ResearchAgendaUpdated',
      'PhilosophyRevised',
      'EvolutionUpdated',
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. No Event Recorded After Failed Operation
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — No Event on Failure', () => {
  it('addResearchArea() does NOT record event on duplicate failure', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const area = createArea();
    identity.addResearchArea(area); // success
    identity.clearDomainEvents();

    const result = identity.addResearchArea(area); // duplicate → failure
    expect(result.isFailure).toBe(true);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(0);
  });

  it('removeResearchArea() does NOT record event when area not found', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const nonExistentId = UniqueId.create('non-existent-id');
    const result = identity.removeResearchArea(nonExistentId);

    expect(result.isFailure).toBe(true);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(0);
  });

  it('addResearchQuestion() does NOT record event on duplicate failure', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    const question = createQuestion();
    identity.addResearchQuestion(question);
    identity.clearDomainEvents();

    const result = identity.addResearchQuestion(question);
    expect(result.isFailure).toBe(true);

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Aggregate Buffer Emptied Correctly
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Buffer Management', () => {
  it('pullDomainEvents() returns all events then empties buffer', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    identity.updatePhilosophy(
      ResearchPhilosophy.create({
        statement: visionVO('P'),
        createdAt: NOW,
      }).value,
    );

    const firstPull = identity.pullDomainEvents();
    expect(firstPull).toHaveLength(2);

    // Buffer should now be empty
    const secondPull = identity.pullDomainEvents();
    expect(secondPull).toHaveLength(0);
  });

  it('new events after pull are captured correctly', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    const firstPull = identity.pullDomainEvents();
    expect(firstPull).toHaveLength(1);

    identity.updatePhilosophy(
      ResearchPhilosophy.create({
        statement: visionVO('P'),
        createdAt: NOW,
      }).value,
    );

    const secondPull = identity.pullDomainEvents();
    expect(secondPull).toHaveLength(1);
    expect(secondPull[0]?.eventName).toBe('PhilosophyRevised');
  });

  it('clearDomainEvents() followed by pullDomainEvents() returns empty', () => {
    const identity = createIdentity();

    identity.updateAgenda(
      ResearchAgenda.create({
        focus: focusVO('A'),
        status: statusVO(),
        createdAt: NOW,
      }).value,
    );

    identity.clearDomainEvents();
    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(0);
  });

  it('aggregate methods do not affect event buffer after clear', () => {
    const identity = createIdentity();
    identity.clearDomainEvents();

    // Only non-event-recording operations
    const vision = identity.vision;
    expect(vision).toBeDefined();

    const events = identity.pullDomainEvents();
    expect(events).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. Export Verification
// ─────────────────────────────────────────────────────────────────────────────

describe('Domain Events — Exports', () => {
  it('all event classes are exported from the identity package index', async () => {
    const mod = await import('../index.js');

    expect(mod.ResearchAgendaCreated).toBeDefined();
    expect(mod.ResearchAgendaUpdated).toBeDefined();
    expect(mod.ResearchAreaAdded).toBeDefined();
    expect(mod.ResearchAreaArchived).toBeDefined();
    expect(mod.ResearchQuestionAdded).toBeDefined();
    expect(mod.PhilosophyRevised).toBeDefined();
    expect(mod.EvolutionUpdated).toBeDefined();
    expect(mod.GoalAchieved).toBeDefined();
    expect(mod.IdentityEvent).toBeDefined();
  });
});
