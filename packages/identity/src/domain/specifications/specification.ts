/**
 * Purpose:
 * Generic base Specification interface for the Domain-Driven Design
 * Specification Pattern.
 *
 * Architecture reference:
 * Domain Model Specification Layers 7-9; Volume I Chapter 8 structural integrity.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Lifecycle:
 * Specifications are immutable value-like objects. Once composed, they
 * represent a fixed business query rule. They may be combined freely
 * using AND, OR, and NOT logical operators.
 *
 * Responsibilities:
 * Encapsulate reusable business query rules as domain concepts.
 * Enable composable, persistence-independent query definitions.
 * Prevent repository interface explosion.
 * Keep query logic in the domain layer where it belongs.
 *
 * Invariants:
 * Specifications depend only on domain abstractions.
 * No infrastructure, ORM, SQL, Prisma, REST, or GraphQL dependencies.
 * Specifications are composable and immutable after construction.
 */

/**
 * Specification — the base interface for the Specification Pattern.
 *
 * A Specification encapsulates a business rule that can be evaluated
 * against an entity to determine whether it satisfies the rule.
 *
 * Specifications are composable via `and()`, `or()`, and `not()` to
 * build complex query rules from simple, reusable building blocks.
 *
 * @typeParam T - The entity type this specification evaluates against.
 */
export interface Specification<T> {
  /**
   * Evaluate whether the given entity satisfies this specification.
   *
   * @param entity - The entity to evaluate.
   * @returns `true` if the entity satisfies the specification, `false` otherwise.
   */
  isSatisfiedBy(entity: T): boolean;

  /**
   * Compose this specification with another using logical AND.
   * The resulting specification is satisfied only when both
   * operand specifications are satisfied.
   *
   * @param other - The specification to AND with.
   * @returns A new composite specification representing the AND condition.
   */
  and(other: Specification<T>): Specification<T>;

  /**
   * Compose this specification with another using logical OR.
   * The resulting specification is satisfied when at least one
   * of the operand specifications is satisfied.
   *
   * @param other - The specification to OR with.
   * @returns A new composite specification representing the OR condition.
   */
  or(other: Specification<T>): Specification<T>;

  /**
   * Negate this specification.
   * The resulting specification is satisfied when this specification
   * is NOT satisfied, and vice versa.
   *
   * @returns A new specification representing the NOT condition.
   */
  not(): Specification<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Concrete composite specifications
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AndSpecification — satisfied only when both operand specifications are satisfied.
 */
export class AndSpecification<T> implements Specification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>,
  ) {}

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

/**
 * OrSpecification — satisfied when at least one operand specification is satisfied.
 */
export class OrSpecification<T> implements Specification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>,
  ) {}

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

/**
 * NotSpecification — satisfied when the operand specification is NOT satisfied.
 */
export class NotSpecification<T> implements Specification<T> {
  constructor(private readonly wrapped: Specification<T>) {}

  isSatisfiedBy(entity: T): boolean {
    return !this.wrapped.isSatisfiedBy(entity);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}
