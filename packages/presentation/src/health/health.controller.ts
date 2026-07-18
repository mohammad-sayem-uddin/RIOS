/**
 * Health Controller & API.
 *
 * Exposes system health, liveness, and readiness endpoints over HTTP.
 * Consumes InfrastructureHealthCheckService from DI container — zero local calculation.
 */

import type { InfrastructureHealthCheckService } from '@rios/infrastructure';
import type { Request, Response, NextFunction } from 'express';

export class HealthController {
  constructor(private readonly healthService?: InfrastructureHealthCheckService) {}

  public getHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!this.healthService) {
        res.status(200).json({
          status: 'UP',
          timestamp: new Date().toISOString(),
          environment: process.env['NODE_ENV'] ?? 'development',
        });
        return;
      }

      const result = await this.healthService.check();
      const httpStatus = result.status === 'UP' || result.status === 'DEGRADED' ? 200 : 503;

      res.status(httpStatus).json({
        status: result.status,
        timestamp: result.timestamp,
        environment: process.env['NODE_ENV'] ?? 'development',
        components: result.components,
      });
    } catch (err) {
      next(err);
    }
  };

  public getLiveness = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
    });
  };

  public getReadiness = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!this.healthService) {
        res.status(200).json({
          status: 'UP',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await this.healthService.check();
      const isReady = result.status === 'UP' || result.status === 'DEGRADED';

      res.status(isReady ? 200 : 503).json({
        status: isReady ? 'UP' : 'DOWN',
        timestamp: result.timestamp,
      });
    } catch (err) {
      next(err);
    }
  };
}
