/**
 * Purpose:
 * Factory for creating valid ResearchArea entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchArea entity.
 *
 * Architecture reference:
 * Volume I – Identity; Domain Factory ADR.
 *
 * Responsibilities:
 * Accept primitive inputs and construct validated Value Objects.
 * Coordinate VO creation → Entity creation.
 * Apply architecture-defined defaults.
 *
 * Does NOT:
 * Save objects, load objects, publish events, call repositories.
 */

import { Result } from '@rios/shared';

import { ResearchArea } from '../entities/research-area.js';
import { ResearchQuestion } from '../entities/research-question.js';
import {
  InvalidConfidenceLevelError,
  InvalidResearchFocusError,
} from '../errors/identity-errors.js';
import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
} from '../value-objects/identity-value-objects.js';

/**
 * ResearchAreaFactory — creates valid ResearchArea entities from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw name string, optional description, and optional confidence
 * 2. Create validated ResearchFocus and ConfidenceLevel Value Objects
 * 3. Delegate to ResearchArea.create() for invariant enforcement
 * 4. Return Result<ResearchArea>
 *
 * Default initialization strategy:
 * - Confidence defaults to 3 (Moderate) when not provided
 * - Description defaults to the area name when not provided
 * - Status defaults to Active
 * - Timestamps are automatically managed by the entity
 */
export class ResearchAreaFactory {
  /** Default confidence level for new research areas. */
  private static readonly DEFAULT_CONFIDENCE = 3;

  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchArea from primitive inputs.
   *
   * @param name - The area name (1-200 chars, non-empty)
   * @param description - Optional description; defaults to the area name
   * @param confidence - Optional confidence level (1-5); defaults to 3
   * @returns Result<ResearchArea>
   */
  static create(params: {
    name: string;
    description?: string;
    confidence?: number;
  }): Result<ResearchArea> {
    const nameResult = ResearchFocus.create(params.name);
    if (nameResult.isFailure) {
      return Result.fail<ResearchArea>(new InvalidResearchFocusError(nameResult.error).message);
    }

    const descriptionValue = params.description ?? params.name;
    const descriptionResult = ResearchFocus.create(descriptionValue);
    if (descriptionResult.isFailure) {
      return Result.fail<ResearchArea>(
        new InvalidResearchFocusError(descriptionResult.error).message,
      );
    }

    const confidenceLevel = params.confidence ?? ResearchAreaFactory.DEFAULT_CONFIDENCE;
    const confidenceResult = ConfidenceLevel.create(confidenceLevel);
    if (confidenceResult.isFailure) {
      return Result.fail<ResearchArea>(new InvalidConfidenceLevelError(confidenceLevel).message);
    }

    const statusResult = ResearchStatus.create('Active');
    if (statusResult.isFailure) {
      return Result.fail<ResearchArea>(statusResult.error);
    }

    return ResearchArea.create({
      name: nameResult.value,
      description: descriptionResult.value,
      status: statusResult.value,
      confidence: confidenceResult.value,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Create a valid ResearchQuestion from primitive inputs.
   *
   * @param question - The question statement (1-200 chars)
   * @param motivation - Why this question matters (1-200 chars)
   * @returns Result<ResearchQuestion>
   */
  static createQuestion(question: string, motivation: string): Result<ResearchQuestion> {
    const questionResult = ResearchFocus.create(question);
    if (questionResult.isFailure) {
      return Result.fail<ResearchQuestion>(
        new InvalidResearchFocusError(questionResult.error).message,
      );
    }

    const motivationResult = ResearchFocus.create(motivation);
    if (motivationResult.isFailure) {
      return Result.fail<ResearchQuestion>(
        new InvalidResearchFocusError(motivationResult.error).message,
      );
    }

    const confidenceResult = ConfidenceLevel.create(ResearchAreaFactory.DEFAULT_CONFIDENCE);
    if (confidenceResult.isFailure) {
      return Result.fail<ResearchQuestion>(
        new InvalidConfidenceLevelError(ResearchAreaFactory.DEFAULT_CONFIDENCE).message,
      );
    }

    const statusResult = ResearchStatus.create('Active');
    if (statusResult.isFailure) {
      return Result.fail<ResearchQuestion>(statusResult.error);
    }

    return ResearchQuestion.create({
      question: questionResult.value,
      motivation: motivationResult.value,
      status: statusResult.value,
      confidence: confidenceResult.value,
      createdAt: new Date().toISOString(),
    });
  }
}
