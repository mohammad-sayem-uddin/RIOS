import { describe, it, expect } from 'vitest';

import {
  PresentationConfigurationLoader,
  DEFAULT_PRESENTATION_CONFIG,
} from '../configuration/index.js';

describe('PresentationConfigurationLoader', () => {
  it('should load default configuration when no environment variables or overrides are provided', () => {
    const config = PresentationConfigurationLoader.load();
    expect(config.port).toBe(DEFAULT_PRESENTATION_CONFIG.port);
    expect(config.host).toBe(DEFAULT_PRESENTATION_CONFIG.host);
    expect(config.versionPrefix).toBe('/api/v1');
    expect(config.compressionEnabled).toBe(true);
    expect(config.swaggerEnabled).toBe(true);
  });

  it('should accept custom overrides', () => {
    const config = PresentationConfigurationLoader.load({
      port: 8080,
      host: '127.0.0.1',
      versionPrefix: '/api/v2',
      compressionEnabled: false,
    });

    expect(config.port).toBe(8080);
    expect(config.host).toBe('127.0.0.1');
    expect(config.versionPrefix).toBe('/api/v2');
    expect(config.compressionEnabled).toBe(false);
  });

  it('should throw error if port is out of range', () => {
    expect(() => PresentationConfigurationLoader.load({ port: 99999 })).toThrow(
      'Invalid HTTP port configuration',
    );
    expect(() => PresentationConfigurationLoader.load({ port: -1 })).toThrow(
      'Invalid HTTP port configuration',
    );
  });
});
