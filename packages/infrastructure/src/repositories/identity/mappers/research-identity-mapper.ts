/**
 * ResearchIdentity AggregateMapper implementation.
 *
 * Converts between:
 * - Domain Aggregate ↔ Snapshot (domain types)
 * - Snapshot ↔ Persistence Entity (primitives)
 *
 * Architecture reference: Mapping Strategy §2, §4, §8.
 *
 * Flow:
 *   Save path:  Aggregate → Snapshot → Persistence Entity
 *   Load path:  Persistence Entity → Snapshot → Aggregate (reconstitute)
 */

import type { ReadonlyResearchIdentitySnapshot } from '@rios/identity';
import {
  ResearchIdentity,
  ResearchVisionStatement,
  TimeHorizon,
  ResearchFocus,
  ConfidenceLevel,
  ResearchStatus,
  ResearchAgenda,
  ResearchPhilosophy,
  ResearchValues,
  ResearchEvolution,
  ResearchArea,
  ResearchQuestion,
  ResearchGoal,
  ResearchContribution,
  ResearchMilestone,
  ResearchVision,
} from '@rios/identity';
import { UniqueId, Result } from '@rios/shared';

import type { AggregateMapper } from '../../../mappers/aggregate-mapper.js';
import type {
  ResearchIdentityPersistence,
  VisionPersistence,
  AgendaPersistence,
  PhilosophyPersistence,
  ValuesPersistence,
  EvolutionPersistence,
  AreaPersistence,
  QuestionPersistence,
  GoalPersistence,
  ContributionPersistence,
  MilestonePersistence,
} from '../persistence/identity-persistence.js';

/**
 * Maps between ResearchIdentity aggregate and persistence entities.
 *
 * Responsibilities:
 * - toDomain: Reconstitute aggregate from persistence (load path)
 * - toPersistence: Flatten aggregate to persistence entity (save path)
 */
export class ResearchIdentityAggregateMapper implements AggregateMapper<
  ResearchIdentityPersistence,
  ResearchIdentity
> {
  /**
   * Convert persistence entity → Domain Aggregate.
   * Used in the load path (DB → Domain).
   *
   * Reconstitutes all Value Objects from primitives,
   * rebuilds entity collections, and calls reconstitute().
   *
   * Throws on failure — the AggregateMapper contract returns TDomain directly.
   * Repository callers should catch and convert to Result.fail.
   */
  toDomain(persistence: ResearchIdentityPersistence): ResearchIdentity {
    // Reconstitute Vision
    const visionResult = this.reconstituteVision(persistence.vision);
    if (visionResult.isFailure) {
      throw new Error(visionResult.error);
    }

    // Reconstitute Agenda
    const agendaResult = this.reconstituteAgenda(persistence.agenda);
    if (agendaResult.isFailure) {
      throw new Error(agendaResult.error);
    }

    // Reconstitute Philosophy
    const philosophyResult = this.reconstitutePhilosophy(persistence.philosophy);
    if (philosophyResult.isFailure) {
      throw new Error(philosophyResult.error);
    }

    // Reconstitute Values
    const valuesResult = this.reconstituteValues(persistence.values);
    if (valuesResult.isFailure) {
      throw new Error(valuesResult.error);
    }

    // Reconstitute Evolution
    const evolutionResult = this.reconstituteEvolution(persistence.evolution);
    if (evolutionResult.isFailure) {
      throw new Error(evolutionResult.error);
    }

    // Reconstitute collections
    const areas = persistence.areas.map((a) => this.reconstituteArea(a));
    const questions = persistence.questions.map((q) => this.reconstituteQuestion(q));
    const goals = persistence.goals.map((g) => this.reconstituteGoal(g));
    const contributions = persistence.contributions.map((c) => this.reconstituteContribution(c));
    const milestones = persistence.milestones.map((m) => this.reconstituteMilestone(m));

    // Reconstitute aggregate
    return ResearchIdentity.reconstitute({
      id: UniqueId.from(persistence.id),
      vision: visionResult.value,
      agenda: agendaResult.value,
      areas,
      questions,
      philosophy: philosophyResult.value,
      values: valuesResult.value,
      evolution: evolutionResult.value,
      goals,
      contributions,
      milestones,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }

  /**
   * Convert Domain Aggregate → Persistence Entity.
   * Used in the save path (Domain → DB).
   *
   * Extracts VO values to primitives, flattens collections.
   */
  toPersistence(aggregate: ResearchIdentity): ResearchIdentityPersistence {
    const snapshot = aggregate.toSnapshot();
    return this.snapshotToPersistence(snapshot);
  }

  /**
   * Convert snapshot → persistence entity.
   * Used for save path when snapshot is available.
   */
  snapshotToPersistence(snapshot: ReadonlyResearchIdentitySnapshot): ResearchIdentityPersistence {
    return {
      id: snapshot.id,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
      vision: this.visionToPersistence(snapshot),
      agenda: this.agendaToPersistence(snapshot),
      philosophy: this.philosophyToPersistence(snapshot),
      values: this.valuesToPersistence(snapshot),
      evolution: this.evolutionToPersistence(snapshot),
      areas: snapshot.areas.map((a) => this.areaToPersistence(a)),
      questions: snapshot.questions.map((q) => this.questionToPersistence(q)),
      goals: snapshot.goals.map((g) => this.goalToPersistence(g)),
      contributions: snapshot.contributions.map((c) => this.contributionToPersistence(c)),
      milestones: snapshot.milestones.map((m) => this.milestoneToPersistence(m)),
    };
  }

  // ─── Private: Save path (Domain → Persistence) ──────────────────────

  private visionToPersistence(snapshot: ReadonlyResearchIdentitySnapshot): VisionPersistence {
    return {
      id: snapshot.vision.id.value,
      visionStatement: snapshot.vision.vision.value,
      timeHorizon: snapshot.vision.timeHorizon.value,
      lastRefinedAt: snapshot.vision.lastRefinedAt,
      createdAt: snapshot.vision.createdAt,
    };
  }

  private agendaToPersistence(snapshot: ReadonlyResearchIdentitySnapshot): AgendaPersistence {
    return {
      id: snapshot.agenda.id.value,
      focus: snapshot.agenda.focus.value,
      status: snapshot.agenda.status.value,
      areaIds: snapshot.agenda.areaIds.map((id) => id.value),
      themes: [...snapshot.agenda.themes],
      createdAt: snapshot.agenda.createdAt,
      updatedAt: snapshot.agenda.updatedAt,
    };
  }

  private philosophyToPersistence(
    snapshot: ReadonlyResearchIdentitySnapshot,
  ): PhilosophyPersistence {
    return {
      id: snapshot.philosophy.id.value,
      statement: snapshot.philosophy.statement.value,
      principles: [...snapshot.philosophy.principles],
      createdAt: snapshot.philosophy.createdAt,
      updatedAt: snapshot.philosophy.updatedAt,
    };
  }

  private valuesToPersistence(snapshot: ReadonlyResearchIdentitySnapshot): ValuesPersistence {
    return {
      id: snapshot.values.id.value,
      statement: snapshot.values.statement.value,
      values: [...snapshot.values.values],
      createdAt: snapshot.values.createdAt,
      updatedAt: snapshot.values.updatedAt,
    };
  }

  private evolutionToPersistence(snapshot: ReadonlyResearchIdentitySnapshot): EvolutionPersistence {
    return {
      id: snapshot.evolution.id.value,
      description: snapshot.evolution.description.value,
      status: snapshot.evolution.status.value,
      confidence: snapshot.evolution.confidence.value,
      milestoneIds: snapshot.evolution.milestoneIds.map((id) => id.value),
      recordedAt: snapshot.evolution.recordedAt,
      createdAt: snapshot.evolution.createdAt,
    };
  }

  private areaToPersistence(area: ResearchArea): AreaPersistence {
    return {
      id: area.id.value,
      name: area.name.value,
      description: area.description.value,
      status: area.status.value,
      confidence: area.confidence.value,
      questionIds: area.questionIds.map((id) => id.value),
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,
    };
  }

  private questionToPersistence(question: ResearchQuestion): QuestionPersistence {
    return {
      id: question.id.value,
      question: question.question.value,
      motivation: question.motivation.value,
      status: question.status.value,
      confidence: question.confidence.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private goalToPersistence(goal: ResearchGoal): GoalPersistence {
    return {
      id: goal.id.value,
      description: goal.description.value,
      status: goal.status.value,
      confidence: goal.confidence.value,
      deadlineAt: goal.deadlineAt,
      completedAt: goal.completedAt,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };
  }

  private contributionToPersistence(contribution: ResearchContribution): ContributionPersistence {
    return {
      id: contribution.id.value,
      description: contribution.description.value,
      significance: contribution.significance.value,
      contributedAt: contribution.contributedAt,
      createdAt: contribution.createdAt,
      updatedAt: contribution.updatedAt,
    };
  }

  private milestoneToPersistence(milestone: ResearchMilestone): MilestonePersistence {
    return {
      id: milestone.id.value,
      description: milestone.description.value,
      confidence: milestone.confidence.value,
      occurredAt: milestone.occurredAt,
      createdAt: milestone.createdAt,
    };
  }

  // ─── Private: Load path (Persistence → Domain) ──────────────────────

  private reconstituteVision(p: VisionPersistence): Result<ResearchVision> {
    try {
      const statementResult = ResearchVisionStatement.create(p.visionStatement);
      if (statementResult.isFailure) {
        return Result.fail<ResearchVision>(statementResult.error);
      }
      const timeHorizonResult = TimeHorizon.create(p.timeHorizon);
      if (timeHorizonResult.isFailure) {
        return Result.fail<ResearchVision>(timeHorizonResult.error);
      }

      const vision = ResearchVision.reconstitute({
        id: UniqueId.from(p.id),
        vision: statementResult.value,
        timeHorizon: timeHorizonResult.value,
        lastRefinedAt: p.lastRefinedAt,
        createdAt: p.createdAt,
      });

      return Result.ok(vision);
    } catch (error) {
      return Result.fail<ResearchVision>(
        `Failed to reconstitute ResearchVision: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private reconstituteAgenda(p: AgendaPersistence): Result<ResearchAgenda> {
    try {
      const focusResult = ResearchFocus.create(p.focus);
      if (focusResult.isFailure) {
        return Result.fail<ResearchAgenda>(focusResult.error);
      }
      const statusResult = ResearchStatus.create(p.status);
      if (statusResult.isFailure) {
        return Result.fail<ResearchAgenda>(statusResult.error);
      }

      const agenda = ResearchAgenda.reconstitute({
        id: UniqueId.from(p.id),
        focus: focusResult.value,
        status: statusResult.value,
        areaIds: p.areaIds.map((id) => UniqueId.from(id)),
        themes: [...p.themes],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      });

      return Result.ok(agenda);
    } catch (error) {
      return Result.fail<ResearchAgenda>(
        `Failed to reconstitute ResearchAgenda: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private reconstitutePhilosophy(p: PhilosophyPersistence): Result<ResearchPhilosophy> {
    try {
      const philosophy = ResearchPhilosophy.reconstitute({
        id: UniqueId.from(p.id),
        statement: p.statement as unknown as ResearchVisionStatement,
        principles: [...p.principles],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      });
      return Result.ok(philosophy);
    } catch (error) {
      return Result.fail<ResearchPhilosophy>(
        `Failed to reconstitute ResearchPhilosophy: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private reconstituteValues(p: ValuesPersistence): Result<ResearchValues> {
    try {
      const values = ResearchValues.reconstitute({
        id: UniqueId.from(p.id),
        statement: p.statement as unknown as ResearchVisionStatement,
        values: [...p.values],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      });
      return Result.ok(values);
    } catch (error) {
      return Result.fail<ResearchValues>(
        `Failed to reconstitute ResearchValues: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private reconstituteEvolution(p: EvolutionPersistence): Result<ResearchEvolution> {
    try {
      const confidenceResult = ConfidenceLevel.create(p.confidence);
      if (confidenceResult.isFailure) {
        return Result.fail<ResearchEvolution>(confidenceResult.error);
      }

      const statusResult = ResearchStatus.create(p.status);
      if (statusResult.isFailure) {
        return Result.fail<ResearchEvolution>(statusResult.error);
      }

      const evolution = ResearchEvolution.reconstitute({
        id: UniqueId.from(p.id),
        description: p.description as unknown as ResearchFocus,
        status: statusResult.value,
        confidence: confidenceResult.value,
        milestoneIds: p.milestoneIds.map((id) => UniqueId.from(id)),
        recordedAt: p.recordedAt,
        createdAt: p.createdAt,
      });
      return Result.ok(evolution);
    } catch (error) {
      return Result.fail<ResearchEvolution>(
        `Failed to reconstitute ResearchEvolution: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private reconstituteArea(p: AreaPersistence): ResearchArea {
    const nameResult = ResearchFocus.create(p.name);
    const descriptionResult = ResearchFocus.create(p.description);
    const statusResult = ResearchStatus.create(p.status);
    const confidenceResult = ConfidenceLevel.create(p.confidence);
    return ResearchArea.reconstitute({
      id: UniqueId.from(p.id),
      name: nameResult.isSuccess ? nameResult.value : (p.name as unknown as ResearchFocus),
      description: descriptionResult.isSuccess
        ? descriptionResult.value
        : (p.description as unknown as ResearchFocus),
      status: statusResult.isSuccess ? statusResult.value : (p.status as unknown as ResearchStatus),
      confidence: confidenceResult.isSuccess
        ? confidenceResult.value
        : (p.confidence as unknown as ConfidenceLevel),
      questionIds: p.questionIds?.map((id) => UniqueId.from(id)) ?? [],
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private reconstituteQuestion(p: QuestionPersistence): ResearchQuestion {
    const questionResult = ResearchFocus.create(p.question);
    const motivationResult = ResearchFocus.create(p.motivation);
    const statusResult = ResearchStatus.create(p.status);
    const confidenceResult = ConfidenceLevel.create(p.confidence);
    return ResearchQuestion.reconstitute({
      id: UniqueId.from(p.id),
      question: questionResult.isSuccess
        ? questionResult.value
        : (p.question as unknown as ResearchFocus),
      motivation: motivationResult.isSuccess
        ? motivationResult.value
        : (p.motivation as unknown as ResearchFocus),
      status: statusResult.isSuccess ? statusResult.value : (p.status as unknown as ResearchStatus),
      confidence: confidenceResult.isSuccess
        ? confidenceResult.value
        : (p.confidence as unknown as ConfidenceLevel),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private reconstituteGoal(p: GoalPersistence): ResearchGoal {
    const descriptionResult = ResearchFocus.create(p.description);
    const statusResult = ResearchStatus.create(p.status);
    const confidenceResult = ConfidenceLevel.create(p.confidence);
    return ResearchGoal.reconstitute({
      id: UniqueId.from(p.id),
      description: descriptionResult.isSuccess
        ? descriptionResult.value
        : (p.description as unknown as ResearchFocus),
      status: statusResult.isSuccess ? statusResult.value : (p.status as unknown as ResearchStatus),
      confidence: confidenceResult.isSuccess
        ? confidenceResult.value
        : (p.confidence as unknown as ConfidenceLevel),
      deadlineAt: p.deadlineAt,
      completedAt: p.completedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private reconstituteContribution(p: ContributionPersistence): ResearchContribution {
    const descriptionResult = ResearchFocus.create(p.description);
    const significanceResult = ConfidenceLevel.create(p.significance);
    return ResearchContribution.reconstitute({
      id: UniqueId.from(p.id),
      description: descriptionResult.isSuccess
        ? descriptionResult.value
        : (p.description as unknown as ResearchFocus),
      significance: significanceResult.isSuccess
        ? significanceResult.value
        : (p.significance as unknown as ConfidenceLevel),
      contributedAt: p.contributedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private reconstituteMilestone(p: MilestonePersistence): ResearchMilestone {
    const descriptionResult = ResearchFocus.create(p.description);
    const confidenceResult = ConfidenceLevel.create(p.confidence);
    return ResearchMilestone.reconstitute({
      id: UniqueId.from(p.id),
      description: descriptionResult.isSuccess
        ? descriptionResult.value
        : (p.description as unknown as ResearchFocus),
      confidence: confidenceResult.isSuccess
        ? confidenceResult.value
        : (p.confidence as unknown as ConfidenceLevel),
      occurredAt: p.occurredAt,
      createdAt: p.createdAt,
    });
  }
}
