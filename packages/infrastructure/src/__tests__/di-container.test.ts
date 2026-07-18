import { describe, it, expect } from 'vitest';

import { CompositionRoot } from '../di/composition-root.js';
import { Container, Lifetime } from '../di/container.js';

describe('Dependency Injection & Composition Root', () => {
  it('should register and resolve singleton instances', () => {
    const container = new Container();
    const token = 'TEST_SERVICE';

    let count = 0;
    container.registerFactory(token, () => ({ id: ++count }), Lifetime.SINGLETON);

    const first = container.resolve<{ id: number }>(token);
    const second = container.resolve<{ id: number }>(token);

    expect(first.id).toBe(1);
    expect(second.id).toBe(1);
    expect(first).toBe(second);
  });

  it('should resolve new instances for transient lifetime', () => {
    const container = new Container();
    const token = 'TRANSIENT_SERVICE';

    let count = 0;
    container.registerFactory(token, () => ({ id: ++count }), Lifetime.TRANSIENT);

    const first = container.resolve<{ id: number }>(token);
    const second = container.resolve<{ id: number }>(token);

    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
    expect(first).not.toBe(second);
  });

  it('should support scoped lifetime in child containers', () => {
    const container = new Container();
    const token = 'SCOPED_SERVICE';

    let count = 0;
    container.registerFactory(token, () => ({ id: ++count }), Lifetime.SCOPED);

    const scope1 = container.createScope();
    const scope2 = container.createScope();

    const scope1First = scope1.resolve<{ id: number }>(token);
    const scope1Second = scope1.resolve<{ id: number }>(token);
    const scope2First = scope2.resolve<{ id: number }>(token);

    expect(scope1First.id).toBe(1);
    expect(scope1Second.id).toBe(1);
    expect(scope2First.id).toBe(2);
  });

  it('should detect circular dependencies and throw clear error', () => {
    const container = new Container();
    const tokenA = Symbol('SERVICE_A');
    const tokenB = Symbol('SERVICE_B');

    container.registerFactory(tokenA, (c) => c.resolve(tokenB));
    container.registerFactory(tokenB, (c) => c.resolve(tokenA));

    expect(() => container.resolve(tokenA)).toThrow(/Circular dependency detected/);
  });

  it('should validate complete dependency graph in CompositionRoot', () => {
    const compositionRoot = new CompositionRoot({
      envVars: {
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        LOG_LEVEL: 'INFO',
      },
    });

    const validationResult = compositionRoot.validateGraph();
    expect(validationResult.isSuccess).toBe(true);
  });

  it('should return Result.fail from tryResolve when token is missing', () => {
    const container = new Container();
    const result = container.tryResolve('NON_EXISTENT_TOKEN');

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('No registration found');
  });
});
