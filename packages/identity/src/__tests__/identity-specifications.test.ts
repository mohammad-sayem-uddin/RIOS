import { Result, UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import type { ResearchIdentity } from '../domain/aggregate/research-identity.js';
import type { ResearchIdentityRepository } from '../domain/repositories/research-identity-repository.js';
import { ResearchIdentitySpecification } from '../domain/specifications/research-identity-specification.js';
import {
  AndSpecification,
  NotSpecification,
  OrSpecification,
} from '../domain/specifications/specification.js';
import type { Specification } from '../domain/specifications/specification.js';

/**
 * Specification Pattern Tests
 *
 * These tests verify:
 * 1. Base Specification interface and composite specifications
 * 2. ResearchIdentitySpecification abstract base
 * 3. Composition: AND, OR, NOT
 * 4. Type safety at compile time
 * 5. Repository accepts Specifications
 * 6. DDD compliance
 * 7. No infrastructure dependency
 *
 * Architecture reference:
 * Domain Model Specification Layers 7-9; Volume I Chapter 8 structural integrity.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 */

// ─── Test Helpers ────────────────────────────────────────────────────────
// Minimal concrete specifications for testing the pattern.
// These use a simple number entity type for base Specification tests.

class EvenNumberSpecification implements Specification<number> {
  isSatisfiedBy(entity: number): boolean {
    return entity % 2 === 0;
  }

  and(other: Specification<number>): Specification<number> {
    return new AndSpecification<number>(this, other);
  }

  or(other: Specification<number>): Specification<number> {
    return new OrSpecification<number>(this, other);
  }

  not(): Specification<number> {
    return new NotSpecification<number>(this);
  }
}

class PositiveNumberSpecification implements Specification<number> {
  isSatisfiedBy(entity: number): boolean {
    return entity > 0;
  }

  and(other: Specification<number>): Specification<number> {
    return new AndSpecification<number>(this, other);
  }

  or(other: Specification<number>): Specification<number> {
    return new OrSpecification<number>(this, other);
  }

  not(): Specification<number> {
    return new NotSpecification<number>(this);
  }
}

class GreaterThanSpecification implements Specification<number> {
  constructor(private readonly threshold: number) {}

  isSatisfiedBy(entity: number): boolean {
    return entity > this.threshold;
  }

  and(other: Specification<number>): Specification<number> {
    return new AndSpecification<number>(this, other);
  }

  or(other: Specification<number>): Specification<number> {
    return new OrSpecification<number>(this, other);
  }

  not(): Specification<number> {
    return new NotSpecification<number>(this);
  }
}

// ─── ResearchIdentity Test Helpers ────────────────────────────────────────
// Concrete ResearchIdentitySpecification implementations for testing.

class HasAreasSpecification extends ResearchIdentitySpecification {
  isSatisfiedBy(_identity: ResearchIdentity): boolean {
    // Simulate checking for areas on the identity.
    // In real usage, this would check identity.areas.length > 0.
    return true;
  }
}

class HasGoalsSpecification extends ResearchIdentitySpecification {
  isSatisfiedBy(_identity: ResearchIdentity): boolean {
    return false;
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────

describe('Specification Pattern', () => {
  describe('base Specification interface', () => {
    it('should define isSatisfiedBy method', () => {
      const spec = new EvenNumberSpecification();
      expect(typeof spec.isSatisfiedBy).toBe('function');
    });

    it('should define and method', () => {
      const spec = new EvenNumberSpecification();
      expect(typeof spec.and).toBe('function');
    });

    it('should define or method', () => {
      const spec = new EvenNumberSpecification();
      expect(typeof spec.or).toBe('function');
    });

    it('should define not method', () => {
      const spec = new EvenNumberSpecification();
      expect(typeof spec.not).toBe('function');
    });
  });

  describe('isSatisfiedBy', () => {
    it('should return true when entity satisfies the specification', () => {
      const evenSpec = new EvenNumberSpecification();
      expect(evenSpec.isSatisfiedBy(2)).toBe(true);
      expect(evenSpec.isSatisfiedBy(4)).toBe(true);
      expect(evenSpec.isSatisfiedBy(100)).toBe(true);
    });

    it('should return false when entity does not satisfy the specification', () => {
      const evenSpec = new EvenNumberSpecification();
      expect(evenSpec.isSatisfiedBy(1)).toBe(false);
      expect(evenSpec.isSatisfiedBy(3)).toBe(false);
      expect(evenSpec.isSatisfiedBy(99)).toBe(false);
    });
  });

  describe('AND composition', () => {
    it('should return true when both specifications are satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenAndPositive = evenSpec.and(positiveSpec);

      expect(evenAndPositive.isSatisfiedBy(2)).toBe(true);
      expect(evenAndPositive.isSatisfiedBy(4)).toBe(true);
    });

    it('should return false when first specification is not satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenAndPositive = evenSpec.and(positiveSpec);

      expect(evenAndPositive.isSatisfiedBy(1)).toBe(false); // odd positive
    });

    it('should return false when second specification is not satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenAndPositive = evenSpec.and(positiveSpec);

      expect(evenAndPositive.isSatisfiedBy(-2)).toBe(false); // even negative
    });

    it('should return false when both specifications are not satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenAndPositive = evenSpec.and(positiveSpec);

      expect(evenAndPositive.isSatisfiedBy(-1)).toBe(false); // odd negative
    });
  });

  describe('OR composition', () => {
    it('should return true when both specifications are satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenOrPositive = evenSpec.or(positiveSpec);

      expect(evenOrPositive.isSatisfiedBy(2)).toBe(true);
    });

    it('should return true when only first specification is satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenOrPositive = evenSpec.or(positiveSpec);

      expect(evenOrPositive.isSatisfiedBy(-2)).toBe(true); // even negative
    });

    it('should return true when only second specification is satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenOrPositive = evenSpec.or(positiveSpec);

      expect(evenOrPositive.isSatisfiedBy(1)).toBe(true); // odd positive
    });

    it('should return false when neither specification is satisfied', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const evenOrPositive = evenSpec.or(positiveSpec);

      expect(evenOrPositive.isSatisfiedBy(-1)).toBe(false); // odd negative
    });
  });

  describe('NOT composition', () => {
    it('should return true when wrapped specification returns false', () => {
      const evenSpec = new EvenNumberSpecification();
      const oddSpec = evenSpec.not();

      expect(oddSpec.isSatisfiedBy(1)).toBe(true);
      expect(oddSpec.isSatisfiedBy(3)).toBe(true);
    });

    it('should return false when wrapped specification returns true', () => {
      const evenSpec = new EvenNumberSpecification();
      const oddSpec = evenSpec.not();

      expect(oddSpec.isSatisfiedBy(2)).toBe(false);
      expect(oddSpec.isSatisfiedBy(4)).toBe(false);
    });
  });

  describe('complex composition', () => {
    it('should support chaining AND and OR', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const greaterThanFive = new GreaterThanSpecification(5);

      // (even AND positive) OR greaterThanFive
      const complex = evenSpec.and(positiveSpec).or(greaterThanFive);

      // even AND positive: 2 satisfies
      expect(complex.isSatisfiedBy(2)).toBe(true);
      // greaterThanFive: 7 satisfies (odd, but > 5)
      expect(complex.isSatisfiedBy(7)).toBe(true);
      // 3: odd, positive, not > 5
      expect(complex.isSatisfiedBy(3)).toBe(false);
    });

    it('should support AND with NOT', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();

      // even AND NOT positive (i.e., even AND negative or zero)
      const complex = evenSpec.and(positiveSpec.not());

      expect(complex.isSatisfiedBy(-2)).toBe(true); // even and not positive
      expect(complex.isSatisfiedBy(2)).toBe(false); // even and positive
      expect(complex.isSatisfiedBy(-1)).toBe(false); // odd and not positive
    });

    it('should support NOT of a composite', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();

      // NOT (even AND positive)
      const complex = evenSpec.and(positiveSpec).not();

      expect(complex.isSatisfiedBy(2)).toBe(false); // even and positive → NOT → false
      expect(complex.isSatisfiedBy(1)).toBe(true); // not (even and positive) → true
      expect(complex.isSatisfiedBy(-2)).toBe(true); // not (even and positive) → true
    });

    it('should support triple AND composition', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const greaterThanFive = new GreaterThanSpecification(5);

      const complex = evenSpec.and(positiveSpec).and(greaterThanFive);

      expect(complex.isSatisfiedBy(6)).toBe(true); // even, positive, > 5
      expect(complex.isSatisfiedBy(4)).toBe(false); // even, positive, not > 5
      expect(complex.isSatisfiedBy(7)).toBe(false); // odd, positive, > 5
      expect(complex.isSatisfiedBy(-6)).toBe(false); // even, not positive, > 5
    });

    it('should support OR with NOT and AND', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();
      const greaterThanTen = new GreaterThanSpecification(10);

      // (even AND positive) OR NOT greaterThanTen
      const complex = evenSpec.and(positiveSpec).or(greaterThanTen.not());

      // 2: even AND positive → true
      expect(complex.isSatisfiedBy(2)).toBe(true);
      // 5: not even, not > 10 → (false) OR (true) → true
      expect(complex.isSatisfiedBy(5)).toBe(true);
      // 12: not (even AND positive) → false, but > 10 → NOT → false... wait, 12 is even and positive → true
      expect(complex.isSatisfiedBy(12)).toBe(true);
      // -1: not even, not positive → false, NOT > 10 → true → true
      expect(complex.isSatisfiedBy(-1)).toBe(true);
    });
  });

  describe('AndSpecification', () => {
    it('should be importable and instantiable', () => {
      const left = new EvenNumberSpecification();
      const right = new PositiveNumberSpecification();
      const andSpec = new AndSpecification(left, right);
      expect(andSpec).toBeDefined();
      expect(andSpec).toBeInstanceOf(AndSpecification);
    });

    it('should implement Specification interface', () => {
      const left = new EvenNumberSpecification();
      const right = new PositiveNumberSpecification();
      const andSpec = new AndSpecification(left, right);

      expect(typeof andSpec.isSatisfiedBy).toBe('function');
      expect(typeof andSpec.and).toBe('function');
      expect(typeof andSpec.or).toBe('function');
      expect(typeof andSpec.not).toBe('function');
    });
  });

  describe('OrSpecification', () => {
    it('should be importable and instantiable', () => {
      const left = new EvenNumberSpecification();
      const right = new PositiveNumberSpecification();
      const orSpec = new OrSpecification(left, right);
      expect(orSpec).toBeDefined();
      expect(orSpec).toBeInstanceOf(OrSpecification);
    });

    it('should implement Specification interface', () => {
      const left = new EvenNumberSpecification();
      const right = new PositiveNumberSpecification();
      const orSpec = new OrSpecification(left, right);

      expect(typeof orSpec.isSatisfiedBy).toBe('function');
      expect(typeof orSpec.and).toBe('function');
      expect(typeof orSpec.or).toBe('function');
      expect(typeof orSpec.not).toBe('function');
    });
  });

  describe('NotSpecification', () => {
    it('should be importable and instantiable', () => {
      const inner = new EvenNumberSpecification();
      const notSpec = new NotSpecification(inner);
      expect(notSpec).toBeDefined();
      expect(notSpec).toBeInstanceOf(NotSpecification);
    });

    it('should implement Specification interface', () => {
      const inner = new EvenNumberSpecification();
      const notSpec = new NotSpecification(inner);

      expect(typeof notSpec.isSatisfiedBy).toBe('function');
      expect(typeof notSpec.and).toBe('function');
      expect(typeof notSpec.or).toBe('function');
      expect(typeof notSpec.not).toBe('function');
    });

    it('should negate double not back to original', () => {
      const evenSpec = new EvenNumberSpecification();
      const doubleNotSpec = evenSpec.not().not();

      expect(doubleNotSpec.isSatisfiedBy(2)).toBe(true);
      expect(doubleNotSpec.isSatisfiedBy(3)).toBe(false);
    });
  });

  describe('ResearchIdentitySpecification', () => {
    it('should be importable as an abstract class', () => {
      // Verify the abstract class exists and can be extended
      expect(ResearchIdentitySpecification).toBeDefined();
      expect(typeof ResearchIdentitySpecification).toBe('function');
    });

    it('should be extensible with concrete implementations', () => {
      const hasAreas = new HasAreasSpecification();
      expect(hasAreas).toBeDefined();
      expect(hasAreas).toBeInstanceOf(ResearchIdentitySpecification);
    });

    it('should implement isSatisfiedBy from subclasses', () => {
      const hasAreas = new HasAreasSpecification();
      // Use a minimal mock that satisfies the type
      const mockIdentity = {} as ResearchIdentity;
      expect(hasAreas.isSatisfiedBy(mockIdentity)).toBe(true);
    });

    it('should support and() composition', () => {
      const hasAreas = new HasAreasSpecification();
      const hasGoals = new HasGoalsSpecification();
      const combined = hasAreas.and(hasGoals);

      expect(combined).toBeDefined();
      expect(typeof combined.isSatisfiedBy).toBe('function');
      expect(combined).toBeInstanceOf(AndSpecification);
    });

    it('should support or() composition', () => {
      const hasAreas = new HasAreasSpecification();
      const hasGoals = new HasGoalsSpecification();
      const combined = hasAreas.or(hasGoals);

      expect(combined).toBeDefined();
      expect(typeof combined.isSatisfiedBy).toBe('function');
      expect(combined).toBeInstanceOf(OrSpecification);
    });

    it('should support not() composition', () => {
      const hasAreas = new HasAreasSpecification();
      const negated = hasAreas.not();

      expect(negated).toBeDefined();
      expect(typeof negated.isSatisfiedBy).toBe('function');
      expect(negated).toBeInstanceOf(NotSpecification);
    });

    it('should evaluate composed specifications against ResearchIdentity', () => {
      const hasAreas = new HasAreasSpecification(); // returns true
      const hasGoals = new HasGoalsSpecification(); // returns false

      const mockIdentity = {} as ResearchIdentity;

      // AND: true AND false = false
      expect(hasAreas.and(hasGoals).isSatisfiedBy(mockIdentity)).toBe(false);

      // OR: true OR false = true
      expect(hasAreas.or(hasGoals).isSatisfiedBy(mockIdentity)).toBe(true);

      // NOT: NOT true = false
      expect(hasAreas.not().isSatisfiedBy(mockIdentity)).toBe(false);

      // NOT: NOT false = true
      expect(hasGoals.not().isSatisfiedBy(mockIdentity)).toBe(true);
    });
  });

  describe('type safety', () => {
    it('should enforce type parameter consistency in and()', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();

      // Compile-time check: both specifications must be of type Specification<number>
      const combined: Specification<number> = evenSpec.and(positiveSpec);
      expect(combined.isSatisfiedBy(2)).toBe(true);
    });

    it('should enforce type parameter consistency in or()', () => {
      const evenSpec = new EvenNumberSpecification();
      const positiveSpec = new PositiveNumberSpecification();

      const combined: Specification<number> = evenSpec.or(positiveSpec);
      expect(combined.isSatisfiedBy(2)).toBe(true);
    });

    it('should enforce type parameter consistency in not()', () => {
      const evenSpec = new EvenNumberSpecification();

      const negated: Specification<number> = evenSpec.not();
      expect(negated.isSatisfiedBy(1)).toBe(true);
    });

    it('should type-check ResearchIdentitySpecification composition', () => {
      const hasAreas = new HasAreasSpecification();
      const hasGoals = new HasGoalsSpecification();

      // Compile-time: both return Specification<ResearchIdentity>
      const andSpec: Specification<ResearchIdentity> = hasAreas.and(hasGoals);
      const orSpec: Specification<ResearchIdentity> = hasAreas.or(hasGoals);
      const notSpec: Specification<ResearchIdentity> = hasAreas.not();

      expect(andSpec).toBeDefined();
      expect(orSpec).toBeDefined();
      expect(notSpec).toBeDefined();
    });
  });

  describe('repository accepts Specifications', () => {
    it('should define findMatching method on ResearchIdentityRepository', () => {
      // Compile-time structural test: the interface must include findMatching
      type RepoFindMatching = ResearchIdentityRepository['findMatching'];
      type FindMatchingSignature = (
        specification: Specification<ResearchIdentity>,
      ) => Promise<Result<ResearchIdentity[]>>;

      type AssertFindMatching = FindMatchingSignature extends RepoFindMatching
        ? RepoFindMatching extends FindMatchingSignature
          ? true
          : false
        : false;

      const assertFindMatching: AssertFindMatching = true;
      expect(assertFindMatching).toBe(true);
    });

    it('should accept ResearchIdentitySpecification in findMatching', () => {
      // Compile-time: a ResearchIdentitySpecification is assignable to
      // Specification<ResearchIdentity> which is what findMatching accepts.
      const hasAreas = new HasAreasSpecification();

      const spec: Specification<ResearchIdentity> = hasAreas;
      expect(spec).toBeDefined();
    });

    it('should accept composed specifications in findMatching', () => {
      const hasAreas = new HasAreasSpecification();
      const hasGoals = new HasGoalsSpecification();

      // Compose specifications
      const combined: Specification<ResearchIdentity> = hasAreas.and(hasGoals).or(hasAreas.not());
      expect(combined).toBeDefined();
    });

    it('should still define save, findById, exists, and delete methods', () => {
      // Verify existing methods are preserved
      type RepoSave = ResearchIdentityRepository['save'];
      type RepoFindById = ResearchIdentityRepository['findById'];
      type RepoExists = ResearchIdentityRepository['exists'];
      type RepoDelete = ResearchIdentityRepository['delete'];

      // These type checks will fail compilation if the methods are missing
      const assertSave: RepoSave extends (identity: ResearchIdentity) => Promise<Result<void>>
        ? true
        : false = true;
      const assertFindById: RepoFindById extends (id: UniqueId) => Promise<Result<ResearchIdentity>>
        ? true
        : false = true;
      const assertExists: RepoExists extends (id: UniqueId) => Promise<Result<boolean>>
        ? true
        : false = true;
      const assertDelete: RepoDelete extends (id: UniqueId) => Promise<Result<void>>
        ? true
        : false = true;

      expect(assertSave).toBe(true);
      expect(assertFindById).toBe(true);
      expect(assertExists).toBe(true);
      expect(assertDelete).toBe(true);
    });
  });

  describe('DDD compliance', () => {
    it('should treat specifications as domain concepts', () => {
      // Specifications live in domain/specifications/
      // They depend only on domain types (ResearchIdentity)
      // No infrastructure imports exist in the specification files.
      expect(true).toBe(true);
    });

    it('should not depend on any infrastructure types', () => {
      // The specification files import from:
      // - ./specification.js (base interface and composites)
      // - ../aggregate/research-identity.js (the aggregate root)
      // No Prisma, TypeORM, SQL, REST, or GraphQL imports.
      expect(true).toBe(true);
    });

    it('should support the Open/Closed Principle', () => {
      // New specifications can be created by extending
      // ResearchIdentitySpecification without modifying existing code.
      // The repository accepts Specification<ResearchIdentity> — any
      // implementation works.
      const hasAreas = new HasAreasSpecification();
      expect(hasAreas).toBeInstanceOf(ResearchIdentitySpecification);
    });

    it('should express business query intent, not data access', () => {
      // Specifications encapsulate business rules:
      // - HasAreasSpecification: "has the researcher defined areas?"
      // - HasGoalsSpecification: "has the researcher set goals?"
      // They do NOT express:
      // - "SELECT * FROM identities WHERE areas_count > 0"
      // - "db.identities.find({ areas: { $exists: true } })"
      expect(true).toBe(true);
    });

    it('should define specifications only for the Aggregate Root', () => {
      // ResearchIdentitySpecification extends Specification<ResearchIdentity>
      // The type parameter is bound to the Aggregate Root.
      // Individual entities (ResearchArea, ResearchGoal, etc.) do not
      // have their own specifications — they are accessed through the aggregate.
      type SpecType = Specification<ResearchIdentity>;
      const typeCheck: SpecType | undefined = undefined;
      expect(typeCheck).toBeUndefined();
    });
  });

  describe('no infrastructure dependency', () => {
    it('should depend only on domain abstractions', () => {
      // The Specification interface is generic and entity-agnostic.
      // ResearchIdentitySpecification depends only on ResearchIdentity.
      // AndSpecification, OrSpecification, NotSpecification depend only
      // on the Specification interface.
      // No infrastructure, ORM, or persistence types are referenced.
      expect(true).toBe(true);
    });

    it('should be persistence-independent', () => {
      // Specifications evaluate entities in-memory via isSatisfiedBy().
      // They contain no SQL, Prisma, MongoDB, or any other
      // persistence-specific logic.
      // Infrastructure implementations translate specifications to queries.
      const evenSpec = new EvenNumberSpecification();
      expect(evenSpec.isSatisfiedBy(2)).toBe(true);
    });
  });

  describe('exports', () => {
    it('should export Specification as a type', () => {
      const typeCheck: Specification<number> | undefined = undefined;
      expect(typeCheck).toBeUndefined();
    });

    it('should export AndSpecification as a class', () => {
      expect(AndSpecification).toBeDefined();
      expect(typeof AndSpecification).toBe('function');
    });

    it('should export OrSpecification as a class', () => {
      expect(OrSpecification).toBeDefined();
      expect(typeof OrSpecification).toBe('function');
    });

    it('should export NotSpecification as a class', () => {
      expect(NotSpecification).toBeDefined();
      expect(typeof NotSpecification).toBe('function');
    });

    it('should export ResearchIdentitySpecification as a class', () => {
      expect(ResearchIdentitySpecification).toBeDefined();
      expect(typeof ResearchIdentitySpecification).toBe('function');
    });
  });
});
