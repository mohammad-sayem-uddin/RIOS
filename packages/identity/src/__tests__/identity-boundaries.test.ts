import { AggregateRoot, DomainError, DomainEvent, Entity, ValueObject } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  ConfidenceLevel,
  IdentityDomainError,
  ResearchAgendaCreated,
  ResearchIdentity,
  ResearchPurpose,
} from '../index.js';

describe('@rios/identity package boundaries', () => {
  it('keeps aggregate placeholders on shared DDD primitives', () => {
    expect(ResearchIdentity.prototype).toBeInstanceOf(AggregateRoot);
  });

  it('keeps entity placeholders on shared DDD primitives', () => {
    expect(ResearchPurpose.prototype).toBeInstanceOf(Entity);
  });

  it('keeps value object placeholders on shared DDD primitives', () => {
    expect(ConfidenceLevel.prototype).toBeInstanceOf(ValueObject);
  });

  it('keeps domain event placeholders on shared DDD primitives', () => {
    expect(ResearchAgendaCreated.prototype).toBeInstanceOf(DomainEvent);
  });

  it('keeps domain errors on shared domain error hierarchy', () => {
    expect(IdentityDomainError.prototype).toBeInstanceOf(DomainError);
  });
});
