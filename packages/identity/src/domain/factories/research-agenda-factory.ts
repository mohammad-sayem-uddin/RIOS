/**
 * Purpose:
 * Factory for creating valid ResearchAgenda entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchAgenda entity.
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

import { ResearchAgenda } from '../entities/research-agenda.js';
import {
  InvalidResearchFocusError,
  InvalidResearchStatusError,
} from '../errors/identity-errors.js';
import { ResearchFocus, ResearchStatus } from '../value-objects/identity-value-objects.js';

/**
 * ResearchAgendaFactory — creates valid ResearchAgenda entities from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw focus string and optional status string
 * 2. Create validated ResearchFocus and ResearchStatus Value Objects
 * 3. Delegate to ResearchAgenda.create() for invariant enforcement
 * 4. Return Result<ResearchAgenda>
 *
 * Default initialization strategy:
 * - Status defaults to "Active" when not provided
 * - Timestamps are automatically managed by the entity
 */
export class ResearchAgendaFactory {
  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchAgenda from a focus string.
   *
   * @param focus - The primary scientific direction (1-200 chars, non-empty)
   * @param status - Optional status string; defaults to "Active"
   * @param createdAt - Optional creation timestamp; defaults to now
   * @returns Result<ResearchAgenda>
   */
  static create(params: {
    focus: string;
    status?: string;
    createdAt?: string;
  }): Result<ResearchAgenda> {
    const focusResult = ResearchFocus.create(params.focus);
    if (focusResult.isFailure) {
      return Result.fail<ResearchAgenda>(new InvalidResearchFocusError(focusResult.error).message);
    }

    const statusValue = params.status ?? 'Active';
    const statusResult = ResearchStatus.create(statusValue);
    if (statusResult.isFailure) {
      return Result.fail<ResearchAgenda>(
        new InvalidResearchStatusError(statusResult.error).message,
      );
    }

    const now = params.createdAt ?? new Date().toISOString();

    return ResearchAgenda.create({
      focus: focusResult.value,
      status: statusResult.value,
      createdAt: now,
    });
  }
}
