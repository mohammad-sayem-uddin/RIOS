import { describe, it, expect } from 'vitest';

import { EnvConfigurationLoader } from '../configuration/env-configuration-loader.js';

describe('EnvConfigurationLoader', () => {
  it('should load configuration with valid defaults', async () => {
    const loader = new EnvConfigurationLoader({});
    const result = await loader.load();

    expect(result.isSuccess).toBe(true);
    const config = result.value;
    expect(config.env).toBe('development');
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(5432);
    expect(config.server.port).toBe(3000);
    expect(config.logging.level).toBe('INFO');
  });

  it('should override defaults with custom environment variables', async () => {
    const env = {
      NODE_ENV: 'production',
      DB_HOST: 'postgres.internal',
      DB_PORT: '5433',
      SERVER_PORT: '8080',
      LOG_LEVEL: 'WARN',
      CORS_ORIGINS: 'https://rios.org, https://admin.rios.org',
    };

    const loader = new EnvConfigurationLoader(env);
    const result = await loader.load();

    expect(result.isSuccess).toBe(true);
    const config = result.value;
    expect(config.env).toBe('production');
    expect(config.database.host).toBe('postgres.internal');
    expect(config.database.port).toBe(5433);
    expect(config.server.port).toBe(8080);
    expect(config.logging.level).toBe('WARN');
    expect(config.server.corsOrigins).toEqual(['https://rios.org', 'https://admin.rios.org']);
  });

  it('should fail fast on invalid numeric values', async () => {
    const env = {
      DB_PORT: 'invalid_port',
      SERVER_PORT: '-1',
      LOG_LEVEL: 'INVALID_LEVEL',
    };

    const loader = new EnvConfigurationLoader(env);
    const result = await loader.load();

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Invalid DB_PORT');
    expect(result.error).toContain('Invalid SERVER_PORT');
    expect(result.error).toContain('Invalid LOG_LEVEL');
  });
});
