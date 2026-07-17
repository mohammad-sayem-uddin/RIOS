/**
 * Purpose:
 * Represents the long-term scientific direction that guides all research activity.
 * Research Agenda is operational (where Vision is aspirational).
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.1; Volume I Chapter 8 Component B.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Lifecycle:
 * High stability. 5-10 year time horizon.
 * Research Agenda SHALL evolve slowly. It SHALL NOT change because technologies change.
 *
 * Responsibilities:
 * Organize research priorities.
 * Define scientific focus.
 * Connect multiple research areas.
 *
 * Relationships:
 * Research Identity defines → Research Agenda.
 * Research Agenda organizes → Research Areas.
 * Research Vision guides → Research Agenda.
 *
 * Owned invariants:
 * IA-I-001: Every Research Identity SHALL define exactly one primary Research Agenda.
 * IA-I-002: Every Research Area SHALL contribute to the Research Agenda.
 * Research Agenda must be problem-oriented, technology-independent, and long-lived.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { DuplicateEntityItemError, EntityItemNotFoundError } from '../errors/identity-errors.js';
import { ResearchFocus, ResearchStatus } from '../value-objects/identity-value-objects.js';

interface ResearchAgendaProps {
  /** The primary scientific direction as a validated Value Object. */
  focus: ResearchFocus;
  /** Current status of the agenda (Active, Exploratory, Archived). */
  status: ResearchStatus;
  /** Ordered list of research area IDs that contribute to this agenda. */
  readonly _areaIds: UniqueId[];
  /** Strategic themes — short labels capturing recurring agenda motifs. */
  readonly _themes: string[];
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * ResearchAgenda Entity.
 *
 * The operational long-term scientific direction. Unlike Vision (aspirational),
 * the Agenda defines what the researcher is actively pursuing.
 * Time Horizon: 5-10 years.
 *
 * The Agenda entity encapsulates:
 * - A validated focus statement (Value Object)
 * - Current status (Value Object)
 * - A collection of Research Area IDs (relationships)
 * - Strategic themes (domain vocabulary)
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Adding/removing research areas (with duplicate prevention)
 * - Adding/removing strategic themes
 * - Updating focus and status
 * - Identity-based equality (Entity semantics)
 */
export class ResearchAgenda extends Entity<ResearchAgendaProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchAgendaProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchAgenda.
   *
   * Invariants enforced:
   * - Focus must be a validated ResearchFocus VO (non-empty, 1-200 chars)
   * - Status must be a validated ResearchStatus VO
   * - createdAt must be a non-empty ISO timestamp
   */
  static create(params: {
    focus: ResearchFocus;
    status: ResearchStatus;
    createdAt: string;
  }): Result<ResearchAgenda> {
    if (!params.createdAt || params.createdAt.trim().length === 0) {
      return Result.fail<ResearchAgenda>('createdAt must be a non-empty ISO timestamp');
    }

    return Result.ok(
      new ResearchAgenda({
        focus: params.focus,
        status: params.status,
        _areaIds: [],
        _themes: [],
        createdAt: params.createdAt,
        updatedAt: params.createdAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchAgenda from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    focus: ResearchFocus;
    status: ResearchStatus;
    areaIds: UniqueId[];
    themes: string[];
    createdAt: string;
    updatedAt: string;
  }): ResearchAgenda {
    return new ResearchAgenda(
      {
        focus: params.focus,
        status: params.status,
        _areaIds: [...params.areaIds],
        _themes: [...params.themes],
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** The primary scientific direction. */
  get focus(): ResearchFocus {
    return this.props.focus;
  }

  /** Current status of the agenda. */
  get status(): ResearchStatus {
    return this.props.status;
  }

  /** Read-only view of contributing research area IDs. */
  get areaIds(): readonly UniqueId[] {
    return Object.freeze([...this.props._areaIds]);
  }

  /** Read-only view of strategic themes. */
  get themes(): readonly string[] {
    return Object.freeze([...this.props._themes]);
  }

  /** ISO timestamp of creation. */
  get createdAt(): string {
    return this.props.createdAt;
  }

  /** ISO timestamp of last update. */
  get updatedAt(): string {
    return this.props.updatedAt;
  }

  // ─── Behavior ───────────────────────────────────────────────────────

  /**
   * Update the research focus direction.
   *
   * @param newFocus - Validated new focus Value Object
   * @param updatedAt - ISO timestamp of the update
   */
  updateFocus(newFocus: ResearchFocus, updatedAt: string): void {
    this.props.focus = newFocus;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Update the agenda status.
   *
   * @param newStatus - Validated new status Value Object
   * @param updatedAt - ISO timestamp of the update
   */
  updateStatus(newStatus: ResearchStatus, updatedAt: string): void {
    this.props.status = newStatus;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Add a research area to this agenda.
   *
   * Invariant: Prevents duplicate area IDs.
   *
   * @param areaId - The UniqueId of the Research Area
   * @param updatedAt - ISO timestamp of the update
   * @returns Result indicating success or failure with DuplicateEntityItemError
   */
  addArea(areaId: UniqueId, updatedAt: string): Result<void> {
    if (this.props._areaIds.some((id) => id.equals(areaId))) {
      return Result.fail<void>(
        new DuplicateEntityItemError(`Research Area with ID ${areaId.value}`).message,
      );
    }
    this.props._areaIds.push(areaId);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Remove a research area from this agenda.
   *
   * @param areaId - The UniqueId of the Research Area to remove
   * @param updatedAt - ISO timestamp of the update
   * @returns Result indicating success or failure with EntityItemNotFoundError
   */
  removeArea(areaId: UniqueId, updatedAt: string): Result<void> {
    const index = this.props._areaIds.findIndex((id) => id.equals(areaId));
    if (index === -1) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Research Area with ID ${areaId.value}`).message,
      );
    }
    this.props._areaIds.splice(index, 1);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Add a strategic theme to this agenda.
   *
   * Invariant: Prevents duplicate themes (case-insensitive).
   *
   * @param theme - A short label capturing a recurring agenda motif
   * @param updatedAt - ISO timestamp of the update
   * @returns Result indicating success or failure
   */
  addTheme(theme: string, updatedAt: string): Result<void> {
    const normalized = theme.trim();
    if (normalized.length === 0) {
      return Result.fail<void>('Theme must be a non-empty string');
    }
    if (this.props._themes.some((t) => t.toLowerCase() === normalized.toLowerCase())) {
      return Result.fail<void>(new DuplicateEntityItemError(`Theme "${normalized}"`).message);
    }
    this.props._themes.push(normalized);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Remove a strategic theme from this agenda.
   *
   * @param theme - The theme to remove
   * @param updatedAt - ISO timestamp of the update
   * @returns Result indicating success or failure
   */
  removeTheme(theme: string, updatedAt: string): Result<void> {
    const index = this.props._themes.findIndex(
      (t) => t.toLowerCase() === theme.trim().toLowerCase(),
    );
    if (index === -1) {
      return Result.fail<void>(new EntityItemNotFoundError(`Theme "${theme}"`).message);
    }
    this.props._themes.splice(index, 1);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Check if this agenda contains a specific research area.
   */
  hasArea(areaId: UniqueId): boolean {
    return this.props._areaIds.some((id) => id.equals(areaId));
  }

  /**
   * Check if this agenda has a specific theme.
   */
  hasTheme(theme: string): boolean {
    return this.props._themes.some((t) => t.toLowerCase() === theme.trim().toLowerCase());
  }
}
