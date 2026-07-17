import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    passWithNoTests: true,
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['packages/*/src/**/*.ts', 'apps/*/src/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
        '**/index.ts',
        '**/node_modules/**',
        '**/dist/**',
      ],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@rios/shared': path.resolve(__dirname, 'packages/shared/src'),
      '@rios/domain': path.resolve(__dirname, 'packages/domain/src'),
      '@rios/identity': path.resolve(__dirname, 'packages/identity/src'),
      '@rios/application': path.resolve(__dirname, 'packages/application/src'),
      '@rios/infrastructure': path.resolve(__dirname, 'packages/infrastructure/src'),
    },
  },
});
