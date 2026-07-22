/**
 * Research Intelligence Controller (Sprint 11)
 *
 * REST Controller coordinating HTTP requests for Academic Timelines,
 * Collaboration Networks, Citation Statistics, and Research Analytics.
 */

import type {
  CalculateResearchMetricsDto,
  CreateCollaborationDto,
  CreateTimelineEventDto,
  ResearchIntelligenceApplicationService,
  UpdateTimelineDto,
} from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class ResearchIntelligenceController {
  constructor(private readonly service: ResearchIntelligenceApplicationService) {}

  private extractProfileId(req: Request): string {
    const fromQuery =
      typeof req.query['profileId'] === 'string' ? req.query['profileId'].trim() : '';
    if (fromQuery.length > 0) return fromQuery;

    const fromParams =
      typeof req.params['profileId'] === 'string' ? req.params['profileId'].trim() : '';
    if (fromParams.length > 0) return fromParams;

    if (
      req.body !== null &&
      typeof req.body === 'object' &&
      'profileId' in req.body &&
      typeof (req.body as { profileId?: unknown }).profileId === 'string'
    ) {
      const fromBody = (req.body as { profileId: string }).profileId.trim();
      if (fromBody.length > 0) return fromBody;
    }

    if (req.user?.userId) {
      return req.user.userId;
    }

    const legacyUser = (req as unknown as { user?: { id?: string } }).user;
    if (legacyUser?.id) {
      return legacyUser.id;
    }

    return '';
  }

  // Timeline
  public getTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileId = this.extractProfileId(req);
      const result = await this.service.getTimeline(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public createTimelineEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateTimelineEventDto;
      const result = await this.service.createTimelineEvent(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updateTimeline = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as UpdateTimelineDto;
      const result = await this.service.updateTimeline(dto);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Collaborations
  public getCollaborations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId = this.extractProfileId(req);
      const result = await this.service.getCollaborationNetwork(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public createCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateCollaborationDto;
      const result = await this.service.createCollaboration(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId = this.extractProfileId(req);
      const id = typeof req.params['id'] === 'string' ? req.params['id'] : '';
      const result = await this.service.removeCollaboration(profileId, id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Analytics & Citations
  public getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileId = this.extractProfileId(req);
      const result = await this.service.getResearchAnalytics(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public calculateMetrics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CalculateResearchMetricsDto;
      const result = await this.service.calculateResearchMetrics(dto);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getCitations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileId = this.extractProfileId(req);
      const result = await this.service.getCitationStatistics(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getResearchImpact = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId = this.extractProfileId(req);
      const result = await this.service.getResearchImpact(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
