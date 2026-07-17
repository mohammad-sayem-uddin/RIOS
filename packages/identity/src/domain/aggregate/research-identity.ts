/**
 * Purpose:
 * Aggregate Root for the Identity Domain.
 * This is the single consistency boundary for the entire Identity Domain.
 * Every command, query, repository, and service interacts with the Identity
 * Domain ONLY through this Aggregate Root.
 *
 * Architecture reference:
 * Domain Model Specification Layers 7-9; Volume I Chapter 8 structural integrity;
 * Volume I Chapter 9 foundational, structural, relationship, and evolution constraints.
 *
 * ADR reference:
 * ADR-101, ADR-102, ADR-103.
 *
 * Lifecycle:
 * Created once per researcher. Long-lived. Evolves over time but never
 * violates historical continuity.
 *
 * Responsibilities:
 * Own complete Identity consistency.
 * Protect aggregate-wide invariants.
 * Coordinate all owned Entities and Value Objects.
 * Control all mutations through intention-revealing behavior.
 * Hide internal implementation details.
 * Prepare Domain Event recording (internal only).
 *
 * Relationships:
 * Research Identity owns → Research Vision
 * Research Identity defines → Research Agenda
 * Research Identity organizes → Research Areas
 * Research Identity explores → Research Questions
 * Research Identity holds → Research Philosophy
 * Research Identity embodies → Research Values
 * Research Identity tracks → Research Evolution
 * Research Identity pursues → Research Goals
 * Research Identity produces → Research Contributions
 * Research Identity records → Research Milestones
 *
 * Owned invariants:
 * IA-I-001: Every Research Identity SHALL define exactly one primary Research Agenda.
 * IA-I-003: Research Vision expresses the enduring scientific direction.
 * IA-I-007: Research Identity must be representation-independent.
 * Cannot reference unknown entities.
 * Cannot duplicate owned identities.
 * Cannot violate ownership.
 * Cannot leave aggregate in invalid state.
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { ResearchAgenda } from '../entities/research-agenda.js';
import { ResearchArea } from '../entities/research-area.js';
import { ResearchContribution } from '../entities/research-contribution.js';
import { ResearchEvolution } from '../entities/research-evolution.js';
import { ResearchGoal } from '../entities/research-goal.js';
import { ResearchMilestone } from '../entities/research-milestone.js';
import { ResearchPhilosophy } from '../entities/research-philosophy.js';
import { ResearchQuestion } from '../entities/research-question.js';
import { ResearchValues } from '../entities/research-values.js';
import { ResearchVision } from '../entities/research-vision.js';
import {
  DuplicateEntityItemError,
  EntityItemNotFoundError,
  IdentityCreationInvariantError,
} from '../errors/identity-errors.js';
import {
  EvolutionUpdated,
  IdentityEvent,
  PhilosophyRevised,
  ResearchAgendaUpdated,
  ResearchAreaAdded,
  ResearchAreaArchived,
  ResearchQuestionAdded,
} from '../events/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Interface for aggregate properties
// ─────────────────────────────────────────────────────────────────────────────

interface ResearchIdentityProps {
  /** The researcher's long-term aspirational vision. */
  vision: ResearchVision;
  /** The operational long-term scientific direction. */
  agenda: ResearchAgenda;
  /** Owned research areas (scientific domains). */
  readonly _areas: ResearchArea[];
  /** Owned research questions (architectural entities). */
  readonly _questions: ResearchQuestion[];
  /** The researcher's philosophical approach. */
  philosophy: ResearchPhilosophy;
  /** The researcher's guiding values. */
  values: ResearchValues;
  /** Tracks how the identity has evolved over time. */
  evolution: ResearchEvolution;
  /** Owned research goals. */
  readonly _goals: ResearchGoal[];
  /** Owned research contributions. */
  readonly _contributions: ResearchContribution[];
  /** Owned research milestones. */
  readonly _milestones: ResearchMilestone[];
  /** ISO timestamp of creation. */
  readonly createdAt: string;
  /** ISO timestamp of last mutation. */
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Read-only snapshot types for safe exposure
// ─────────────────────────────────────────────────────────────────────────────

export interface ReadonlyResearchIdentitySnapshot {
  readonly id: string;
  readonly vision: ResearchVision;
  readonly agenda: ResearchAgenda;
  readonly areas: readonly ResearchArea[];
  readonly questions: readonly ResearchQuestion[];
  readonly philosophy: ResearchPhilosophy;
  readonly values: ResearchValues;
  readonly evolution: ResearchEvolution;
  readonly goals: readonly ResearchGoal[];
  readonly contributions: readonly ResearchContribution[];
  readonly milestones: readonly ResearchMilestone[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ResearchIdentity Aggregate Root
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ResearchIdentity — the Aggregate Root of the Identity Domain.
 *
 * This class is the single entry point for all domain behavior within the
 * Identity boundary. No external code may directly modify owned entities.
 * All mutations flow through intention-revealing methods on this aggregate.
 *
 * Construction:
 * - Use ResearchIdentity.create() to build a new valid aggregate.
 * - Use ResearchIdentity.reconstitute() to rebuild from persistence.
 * - Constructor is private — no bypass of invariant enforcement.
 *
 * Ownership:
 * - ResearchVision, ResearchAgenda, ResearchArea, ResearchQuestion,
 *   ResearchPhilosophy, ResearchValues, ResearchEvolution, ResearchGoal,
 *   ResearchContribution, ResearchMilestone are all owned entities.
 * - Collections are returned as ReadonlyArray to prevent external mutation.
 */
export class ResearchIdentity extends AggregateRoot<ResearchIdentityProps> {
  // ─── Pending Domain Events (internal recording only) ────────────────

  private _pendingEvents: IdentityEvent[] = [];

  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Private constructor — callers must use create() or reconstitute().
   */
  private constructor(props: ResearchIdentityProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory: creates a new ResearchIdentity with valid initial state.
   *
   * Enforces aggregate-wide creation invariants:
   * - Vision must be a valid ResearchVision entity
   * - Agenda must be a valid ResearchAgenda entity
   * - Philosophy must be a valid ResearchPhilosophy entity
   * - Values must be a valid ResearchValues entity
   * - Evolution must be a valid ResearchEvolution entity
   * - All collections begin empty
   */
  static create(params: {
    vision: ResearchVision;
    agenda: ResearchAgenda;
    philosophy: ResearchPhilosophy;
    values: ResearchValues;
    evolution: ResearchEvolution;
    createdAt?: string;
  }): Result<ResearchIdentity> {
    if (params.vision === undefined || params.vision === null) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError('Vision is required.').message,
      );
    }
    if (params.agenda === undefined || params.agenda === null) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError('Agenda is required.').message,
      );
    }
    if (params.philosophy === undefined || params.philosophy === null) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError('Philosophy is required.').message,
      );
    }
    if (params.values === undefined || params.values === null) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError('Values are required.').message,
      );
    }
    if (params.evolution === undefined || params.evolution === null) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError('Evolution is required.').message,
      );
    }

    const now = params.createdAt ?? new Date().toISOString();

    const identity = new ResearchIdentity({
      vision: params.vision,
      agenda: params.agenda,
      _areas: [],
      _questions: [],
      philosophy: params.philosophy,
      values: params.values,
      evolution: params.evolution,
      _goals: [],
      _contributions: [],
      _milestones: [],
      createdAt: now,
      updatedAt: now,
    });

    // NOTE: We cannot record events here because we don't have the ID yet.
    // The caller (application layer) should record the creation event after
    // the aggregate has been assigned an ID. Alternatively, reconstitute()
    // is used for persistence rehydration.

    return Result.ok(identity);
  }

  /**
   * Named factory: reconstitutes a ResearchIdentity from persistence.
   *
   * Does NOT validate creation invariants — the aggregate was already valid
   * when originally created. Restores full state including all owned entities.
   */
  static reconstitute(params: {
    id: UniqueId;
    vision: ResearchVision;
    agenda: ResearchAgenda;
    areas: ResearchArea[];
    questions: ResearchQuestion[];
    philosophy: ResearchPhilosophy;
    values: ResearchValues;
    evolution: ResearchEvolution;
    goals: ResearchGoal[];
    contributions: ResearchContribution[];
    milestones: ResearchMilestone[];
    createdAt: string;
    updatedAt: string;
  }): ResearchIdentity {
    return new ResearchIdentity(
      {
        vision: params.vision,
        agenda: params.agenda,
        _areas: [...params.areas],
        _questions: [...params.questions],
        philosophy: params.philosophy,
        values: params.values,
        evolution: params.evolution,
        _goals: [...params.goals],
        _contributions: [...params.contributions],
        _milestones: [...params.milestones],
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** The researcher's long-term aspirational vision. */
  get vision(): ResearchVision {
    return this.props.vision;
  }

  /** The operational long-term scientific direction. */
  get agenda(): ResearchAgenda {
    return this.props.agenda;
  }

  /** Read-only view of owned research areas. */
  get areas(): ReadonlyArray<ResearchArea> {
    return Object.freeze([...this.props._areas]);
  }

  /** Read-only view of owned research questions. */
  get questions(): ReadonlyArray<ResearchQuestion> {
    return Object.freeze([...this.props._questions]);
  }

  /** The researcher's philosophical approach. */
  get philosophy(): ResearchPhilosophy {
    return this.props.philosophy;
  }

  /** The researcher's guiding values. */
  get values(): ResearchValues {
    return this.props.values;
  }

  /** The researcher's evolution record. */
  get evolution(): ResearchEvolution {
    return this.props.evolution;
  }

  /** Read-only view of owned research goals. */
  get goals(): ReadonlyArray<ResearchGoal> {
    return Object.freeze([...this.props._goals]);
  }

  /** Read-only view of owned research contributions. */
  get contributions(): ReadonlyArray<ResearchContribution> {
    return Object.freeze([...this.props._contributions]);
  }

  /** Read-only view of owned research milestones. */
  get milestones(): ReadonlyArray<ResearchMilestone> {
    return Object.freeze([...this.props._milestones]);
  }

  /** ISO timestamp of aggregate creation. */
  get createdAt(): string {
    return this.props.createdAt;
  }

  /** ISO timestamp of last aggregate mutation. */
  get updatedAt(): string {
    return this.props.updatedAt;
  }

  /**
   * Returns a safe, read-only snapshot of the entire aggregate state.
   * No external code should hold mutable references to owned entities.
   */
  toSnapshot(): ReadonlyResearchIdentitySnapshot {
    return {
      id: this.id.value,
      vision: this.props.vision,
      agenda: this.props.agenda,
      areas: Object.freeze([...this.props._areas]),
      questions: Object.freeze([...this.props._questions]),
      philosophy: this.props.philosophy,
      values: this.props.values,
      evolution: this.props.evolution,
      goals: Object.freeze([...this.props._goals]),
      contributions: Object.freeze([...this.props._contributions]),
      milestones: Object.freeze([...this.props._milestones]),
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  // ─── Domain Behavior: Vision ────────────────────────────────────────

  /**
   * Update the researcher's long-term aspirational vision.
   *
   * Transaction: Atomic update of vision statement and time horizon.
   * Invariants: Vision must be a valid ResearchVision entity.
   */
  updateVision(vision: ResearchVision): void {
    this.props.vision = vision;
    this.touch();
  }

  // ─── Domain Behavior: Agenda ────────────────────────────────────────

  /**
   * Update the researcher's operational research agenda.
   *
   * Transaction: Atomic update of the agenda entity.
   * Invariants: Agenda must be a valid ResearchAgenda entity.
   */
  updateAgenda(agenda: ResearchAgenda): void {
    const previousTitle = this.props.agenda.focus.value;
    this.props.agenda = agenda;
    this.touch();
    this.recordEvent(
      new ResearchAgendaUpdated(this.id.value, {
        previousTitle,
        newTitle: agenda.focus.value,
      }),
    );
  }

  // ─── Domain Behavior: Research Areas ────────────────────────────────

  /**
   * Add a research area to the aggregate.
   *
   * Transaction: Atomic addition with duplicate prevention.
   * Invariant: Area ID must not already exist in the aggregate.
   */
  addResearchArea(area: ResearchArea): Result<void> {
    if (this.props._areas.some((a) => a.id.equals(area.id))) {
      return Result.fail<void>(
        new DuplicateEntityItemError(`Research Area with ID ${area.id.value}`).message,
      );
    }
    this.props._areas.push(area);
    this.touch();
    this.recordEvent(
      new ResearchAreaAdded(this.id.value, {
        areaId: area.id.value,
        areaName: area.name.value,
      }),
    );
    return Result.ok(undefined);
  }

  /**
   * Remove a research area from the aggregate.
   *
   * Transaction: Atomic removal with existence validation.
   * Invariant: Area ID must exist in the aggregate.
   */
  removeResearchArea(areaId: UniqueId): Result<void> {
    const index = this.props._areas.findIndex((a) => a.id.equals(areaId));
    if (index === -1) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Research Area with ID ${areaId.value}`).message,
      );
    }
    const removedArea = this.props._areas[index];
    if (removedArea === undefined) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Research Area with ID ${areaId.value}`).message,
      );
    }
    this.props._areas.splice(index, 1);
    this.touch();
    this.recordEvent(
      new ResearchAreaArchived(this.id.value, {
        areaId: removedArea.id.value,
        areaName: removedArea.name.value,
      }),
    );
    return Result.ok(undefined);
  }

  /**
   * Retrieve a research area by its identifier.
   * Returns undefined if not found.
   */
  findResearchArea(areaId: UniqueId): ResearchArea | undefined {
    return this.props._areas.find((a) => a.id.equals(areaId));
  }

  // ─── Domain Behavior: Research Questions ────────────────────────────

  /**
   * Add a research question to the aggregate.
   *
   * Transaction: Atomic addition with duplicate prevention.
   * Invariant: Question ID must not already exist in the aggregate.
   */
  addResearchQuestion(question: ResearchQuestion): Result<void> {
    if (this.props._questions.some((q) => q.id.equals(question.id))) {
      return Result.fail<void>(
        new DuplicateEntityItemError(`Research Question with ID ${question.id.value}`).message,
      );
    }
    this.props._questions.push(question);
    this.touch();
    this.recordEvent(
      new ResearchQuestionAdded(this.id.value, {
        questionId: question.id.value,
        questionTitle: question.question.value,
      }),
    );
    return Result.ok(undefined);
  }

  /**
   * Remove a research question from the aggregate.
   *
   * Transaction: Atomic removal with existence validation.
   * Invariant: Question ID must exist in the aggregate.
   */
  removeResearchQuestion(questionId: UniqueId): Result<void> {
    const index = this.props._questions.findIndex((q) => q.id.equals(questionId));
    if (index === -1) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Research Question with ID ${questionId.value}`).message,
      );
    }
    this.props._questions.splice(index, 1);
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Retrieve a research question by its identifier.
   * Returns undefined if not found.
   */
  findResearchQuestion(questionId: UniqueId): ResearchQuestion | undefined {
    return this.props._questions.find((q) => q.id.equals(questionId));
  }

  // ─── Domain Behavior: Philosophy ────────────────────────────────────

  /**
   * Update the researcher's philosophical approach.
   *
   * Transaction: Atomic replacement of philosophy entity.
   * Invariants: Philosophy must be a valid ResearchPhilosophy entity.
   */
  updatePhilosophy(philosophy: ResearchPhilosophy): void {
    this.props.philosophy = philosophy;
    this.touch();
    this.recordEvent(
      new PhilosophyRevised(this.id.value, {
        summary: philosophy.statement.value,
      }),
    );
  }

  // ─── Domain Behavior: Values ────────────────────────────────────────

  /**
   * Update the researcher's guiding values.
   *
   * Transaction: Atomic replacement of values entity.
   * Invariants: Values must be a valid ResearchValues entity.
   */
  updateValues(values: ResearchValues): void {
    this.props.values = values;
    this.touch();
  }

  // ─── Domain Behavior: Evolution ─────────────────────────────────────

  /**
   * Update the researcher's evolution record.
   *
   * Transaction: Atomic replacement of evolution entity.
   * Invariants: Evolution must be a valid ResearchEvolution entity.
   */
  updateEvolution(evolution: ResearchEvolution): void {
    this.props.evolution = evolution;
    this.touch();
    this.recordEvent(
      new EvolutionUpdated(this.id.value, {
        milestoneId: evolution.id.value,
        milestoneTitle: evolution.description.value,
      }),
    );
  }

  // ─── Domain Behavior: Goals ─────────────────────────────────────────

  /**
   * Add a research goal to the aggregate.
   *
   * Transaction: Atomic addition with duplicate prevention.
   * Invariant: Goal ID must not already exist in the aggregate.
   */
  addGoal(goal: ResearchGoal): Result<void> {
    if (this.props._goals.some((g) => g.id.equals(goal.id))) {
      return Result.fail<void>(
        new DuplicateEntityItemError(`Research Goal with ID ${goal.id.value}`).message,
      );
    }
    this.props._goals.push(goal);
    this.touch();
    // NOTE: GoalAchieved is recorded when completeGoal() is called,
    // not when a goal is added.
    return Result.ok(undefined);
  }

  /**
   * Remove a research goal from the aggregate.
   *
   * Transaction: Atomic removal with existence validation.
   * Invariant: Goal ID must exist in the aggregate.
   */
  removeGoal(goalId: UniqueId): Result<void> {
    const index = this.props._goals.findIndex((g) => g.id.equals(goalId));
    if (index === -1) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Research Goal with ID ${goalId.value}`).message,
      );
    }
    this.props._goals.splice(index, 1);
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Retrieve a research goal by its identifier.
   * Returns undefined if not found.
   */
  findGoal(goalId: UniqueId): ResearchGoal | undefined {
    return this.props._goals.find((g) => g.id.equals(goalId));
  }

  // ─── Domain Behavior: Contributions ─────────────────────────────────

  /**
   * Record a research contribution in the aggregate.
   *
   * Transaction: Atomic addition with duplicate prevention.
   * Invariant: Contribution ID must not already exist in the aggregate.
   */
  recordContribution(contribution: ResearchContribution): Result<void> {
    if (this.props._contributions.some((c) => c.id.equals(contribution.id))) {
      return Result.fail<void>(
        new DuplicateEntityItemError(`Research Contribution with ID ${contribution.id.value}`)
          .message,
      );
    }
    this.props._contributions.push(contribution);
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Remove a research contribution from the aggregate.
   *
   * Transaction: Atomic removal with existence validation.
   * Invariant: Contribution ID must exist in the aggregate.
   */
  removeContribution(contributionId: UniqueId): Result<void> {
    const index = this.props._contributions.findIndex((c) => c.id.equals(contributionId));
    if (index === -1) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Research Contribution with ID ${contributionId.value}`)
          .message,
      );
    }
    this.props._contributions.splice(index, 1);
    this.touch();
    return Result.ok(undefined);
  }

  /**
   * Retrieve a research contribution by its identifier.
   * Returns undefined if not found.
   */
  findContribution(contributionId: UniqueId): ResearchContribution | undefined {
    return this.props._contributions.find((c) => c.id.equals(contributionId));
  }

  // ─── Domain Behavior: Milestones ────────────────────────────────────

  /**
   * Record a milestone in the aggregate.
   *
   * Transaction: Atomic addition.
   * Invariant: Milestone must be valid.
   */
  addMilestone(milestone: ResearchMilestone): void {
    this.props._milestones.push(milestone);
    this.touch();
  }

  /**
   * Retrieve a milestone by its identifier.
   * Returns undefined if not found.
   */
  findMilestone(milestoneId: UniqueId): ResearchMilestone | undefined {
    return this.props._milestones.find((m) => m.id.equals(milestoneId));
  }

  // ─── Domain Events (internal recording only) ────────────────────────

  /**
   * Pull all pending domain events and clear the internal buffer.
   * This is the ONLY way external code can retrieve recorded events.
   */
  pullDomainEvents(): ReadonlyArray<IdentityEvent> {
    const events = [...this._pendingEvents];
    this._pendingEvents = [];
    return Object.freeze(events);
  }

  /**
   * Clear all pending domain events without retrieving them.
   */
  clearDomainEvents(): void {
    this._pendingEvents = [];
  }

  // ─── Internal Helpers ───────────────────────────────────────────────

  /**
   * Update the aggregate's updatedAt timestamp.
   */
  private touch(): void {
    this.props.updatedAt = new Date().toISOString();
  }

  /**
   * Record a domain event in the internal buffer.
   * Events are only recorded after successful state changes.
   * Private — only the aggregate itself may record events.
   */
  private recordEvent(event: IdentityEvent): void {
    this._pendingEvents = [...this._pendingEvents, event];
  }
}
