import { describe, it, expect } from 'vitest';

import { ApplicationStartup } from '../lifecycle/application-startup.js';
import { GracefulShutdown } from '../lifecycle/graceful-shutdown.js';

describe('Application Startup & Graceful Shutdown Lifecycle', () => {
  it('should start system successfully with valid env options', async () => {
    const envVars = {
      NODE_ENV: 'test',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      LOG_LEVEL: 'INFO',
    };

    const startResult = await ApplicationStartup.start({
      envVars,
      skipHealthCheck: false,
    });

    expect(startResult.isSuccess).toBe(true);
    const system = startResult.value;

    expect(system.config.env).toBe('test');
    expect(system.databaseProvider).toBeDefined();
    expect(system.identityApplicationService).toBeDefined();

    // Clean up via GracefulShutdown
    const shutdown = new GracefulShutdown({
      databaseProvider: system.databaseProvider,
      logger: system.logger,
    });

    const shutdownResult = await shutdown.shutdown('Test finished');
    expect(shutdownResult.isSuccess).toBe(true);
  });

  it('should fail startup fast when configuration is invalid', async () => {
    const envVars = {
      DB_PORT: 'invalid_port',
    };

    const startResult = await ApplicationStartup.start({ envVars });

    expect(startResult.isFailure).toBe(true);
    expect(startResult.error).toContain('Configuration error');
  });

  it('should register signal handlers without throwing', () => {
    const shutdown = new GracefulShutdown();
    expect(() => shutdown.registerSignalHandlers()).not.toThrow();
  });
});
