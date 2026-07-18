/**
 * RIOS Bootstrap Helper.
 *
 * Architecture reference:
 * Infrastructure Layer — Application Wiring & Bootstrap Entry Point.
 *
 * Wires the Application and Infrastructure layers into a production system.
 */

import { Result } from '@rios/shared';

import type { SystemInstance, StartupOptions } from './lifecycle/application-startup.js';
import { ApplicationStartup } from './lifecycle/application-startup.js';
import { GracefulShutdown } from './lifecycle/graceful-shutdown.js';

export async function bootstrapRiosSystem(
  options: StartupOptions = {},
): Promise<Result<{ instance: SystemInstance; shutdown: GracefulShutdown }>> {
  const startResult = await ApplicationStartup.start(options);
  if (startResult.isFailure) {
    return Result.fail(startResult.error);
  }

  const instance = startResult.value;
  const shutdown = new GracefulShutdown({
    databaseProvider: instance.databaseProvider,
    logger: instance.logger,
  });

  return Result.ok({ instance, shutdown });
}
