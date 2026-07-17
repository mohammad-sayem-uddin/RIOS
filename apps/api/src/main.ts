/**
 * @rios/api — Application Entry Point
 *
 * SPRINT 0: Stub — will be populated in Sprint 1+ with NestJS bootstrap.
 */

const port = process.env['API_PORT'] ?? 3000;

function bootstrap(): void {
  // eslint-disable-next-line no-console
  console.log(`[RIOS API] Starting on port ${port}...`);
  // NestJS app will be bootstrapped here in Sprint 1
  // eslint-disable-next-line no-console
  console.log('[RIOS API] Sprint 0 stub — waiting for Sprint 1 implementation');
}

try {
  bootstrap();
} catch (err: unknown) {
  // eslint-disable-next-line no-console
  console.error('[RIOS API] Failed to start:', err);
  process.exit(1);
}
