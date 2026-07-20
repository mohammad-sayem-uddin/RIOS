/**
 * @rios/presentation — Enterprise Platform Controller (Sprint 14)
 */

import type {
  CreateAuditEntryCommand,
  EnterpriseApplicationService,
  QueueNotificationCommand,
  RetryJobCommand,
  ScheduleBackgroundJobCommand,
  TriggerWebhookCommand,
  UpdateFeatureFlagCommand,
} from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class EnterpriseController {
  constructor(private readonly service: EnterpriseApplicationService) {}

  public getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getHealthStatus();
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metricName =
        typeof req.query['metricName'] === 'string' ? req.query['metricName'] : undefined;
      const result = await this.service.getSystemMetrics({ metricName });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = typeof req.query['userId'] === 'string' ? req.query['userId'] : undefined;
      const action = typeof req.query['action'] === 'string' ? req.query['action'] : undefined;
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;
      const limit =
        typeof limitStr === 'string' && limitStr.length > 0 ? parseInt(limitStr, 10) : undefined;

      const result = await this.service.getAuditLogs({ userId, action, limit });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public createAuditLog = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as CreateAuditEntryCommand;
      const result = await this.service.createAuditEntry(command);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobId = typeof req.query['jobId'] === 'string' ? req.query['jobId'] : '';
      const result = await this.service.getJobStatus({ jobId });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public scheduleJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const command = req.body as ScheduleBackgroundJobCommand;
      const result = await this.service.scheduleBackgroundJob(command);
      ResultHttpMapper.mapResult(res, result, 202, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public retryJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const command = req.body as RetryJobCommand;
      const result = await this.service.retryJob(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public postNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as QueueNotificationCommand;
      const result = await this.service.queueNotification(command);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public triggerWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as TriggerWebhookCommand;
      const result = await this.service.triggerWebhook(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getFeatureFlags = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.getFeatureFlags();
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public updateFeatureFlag = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as UpdateFeatureFlagCommand;
      const result = await this.service.updateFeatureFlag(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };
}
