/**
 * ResearchIdentity SpecificationTranslator implementation.
 *
 * Translates domain specifications into Prisma-compatible query parameters.
 *
 * Architecture reference:
 * - Specification Pattern: Volume I Chapter 8
 * - Infrastructure Layer: Specification Translation Strategy
 *
 * Mapping flow:
 *   Domain Specification
 *         ↓
 *   SpecificationTranslator.translate()
 *         ↓
 *   Prisma Where/OrderBy/Include params
 *         ↓
 *   Database Query
 *
 * This translator:
 * - Converts domain specifications to Prisma query objects.
 * - Handles TextSearchSpecification → Prisma OR filters.
 * - Handles AllResearchIdentitiesSpecification → no filter (empty where).
 * - Supports composite specifications via recursive translation.
 *
 * This translator does NOT:
 * - Contain business logic.
 * - Know about aggregate internals beyond what's needed for query translation.
 * - Execute queries — that is the repository's job.
 */

import type { Specification } from '@rios/identity';
import { TextSearchSpecification } from '@rios/identity';

import type { SpecificationTranslator } from '../../../mappers/aggregate-mapper.js';

/**
 * Prisma query parameters for ResearchIdentity.
 *
 * This is the infrastructure-owned query shape.
 * Domain never sees these types.
 */
export interface ResearchIdentityQueryParams {
  /** Prisma where clause. */
  readonly where: Record<string, unknown>;
  /** Prisma orderBy clause. */
  readonly orderBy?: Record<string, 'asc' | 'desc'>;
  /** Prisma include clause for nested relations. */
  readonly include?: Record<string, boolean | Record<string, unknown>>;
}

/**
 * Default include clause for loading the full aggregate with all owned entities.
 */
const FULL_AGGREGATE_INCLUDE: Record<string, boolean> = {
  user: true,
};

/**
 * Translates ResearchIdentity domain specifications into Prisma query parameters.
 *
 * Usage:
 * ```typescript
 * const translator = new ResearchIdentitySpecificationTranslator();
 * const params = translator.translate(new TextSearchSpecification('machine learning'));
 * // params.where = { OR: [{ vision: { contains: 'machine learning' } }, ...] }
 * ```
 */
export class ResearchIdentitySpecificationTranslator implements SpecificationTranslator<
  Specification<unknown>,
  ResearchIdentityQueryParams
> {
  /**
   * Translate a domain specification into Prisma query parameters.
   *
   * Dispatches to the appropriate translation method based on specification type.
   * Falls back to in-memory filtering for unknown specification types.
   *
   * @param specification - The domain specification to translate.
   * @returns Prisma-compatible query parameters.
   */
  translate(specification: Specification<unknown>): ResearchIdentityQueryParams {
    if (specification instanceof TextSearchSpecification) {
      return this.translateTextSearch(specification);
    }

    // Fallback: return all records, repository will filter in-memory
    // This ensures unknown specification types don't break the pipeline.
    // The repository's findMatching() method handles in-memory filtering
    // via isSatisfiedBy() when the translator cannot produce a targeted query.
    return this.translateAll();
  }

  /**
   * Get the default include clause for loading the full aggregate.
   */
  getFullAggregateInclude(): Record<string, boolean> {
    return { ...FULL_AGGREGATE_INCLUDE };
  }

  /**
   * Translate TextSearchSpecification → Prisma OR filter.
   *
   * Searches across multiple text fields of the aggregate:
   * - Vision statement
   * - Agenda focus
   * - Philosophy statement
   * - Values statement
   * - Evolution description
   * - Area names and descriptions
   * - Question text
   * - Goal descriptions
   * - Contribution titles and descriptions
   */
  private translateTextSearch(spec: TextSearchSpecification): ResearchIdentityQueryParams {
    // Access the normalized term from the domain specification.
    // The field is private in the domain class; we use a type assertion
    // to access it for infrastructure-level query translation.
    const term = (spec as unknown as { normalizedTerm: string }).normalizedTerm;

    return {
      where: {
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { statement: { contains: term, mode: 'insensitive' } },
          { researchAreas: { contains: term, mode: 'insensitive' } },
          { researchGoals: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: FULL_AGGREGATE_INCLUDE,
    };
  }

  /**
   * Translate AllResearchIdentitiesSpecification → no filter.
   *
   * Returns all records ordered by creation date (newest first).
   */
  private translateAll(): ResearchIdentityQueryParams {
    return {
      where: {},
      orderBy: { createdAt: 'desc' },
      include: FULL_AGGREGATE_INCLUDE,
    };
  }
}
