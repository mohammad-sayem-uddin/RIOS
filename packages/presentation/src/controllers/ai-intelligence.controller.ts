/**
 * @rios/presentation — AI Research Intelligence Controller (Sprint 13)
 */

import type {
  GenerateEmbeddingCommand,
  GenerateRecommendationsCommand,
  IAiIntelligenceApplicationService,
} from '@rios/application';
import { RecommendationTypeEnum } from '@rios/domain';
import type { NextFunction, Request, Response } from 'express';

import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class AiIntelligenceController {
  constructor(private readonly service: IAiIntelligenceApplicationService) {}

  public generateEmbeddings = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as GenerateEmbeddingCommand;
      const result = await this.service.generateEmbedding(command);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public generateRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as GenerateRecommendationsCommand;
      const result = await this.service.generateRecommendations(command);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId =
        (req.query['profileId'] as string) || (req.query['researcherProfileId'] as string) || '';
      const typeStr = typeof req.query['type'] === 'string' ? req.query['type'] : undefined;
      const typeEnum =
        typeStr !== undefined && typeStr.trim().length > 0
          ? (typeStr.toUpperCase() as RecommendationTypeEnum)
          : undefined;

      const result = await this.service.getRecommendations(profileId, typeEnum);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getSimilarResearchers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId =
        (req.query['profileId'] as string) || (req.query['researcherProfileId'] as string) || '';
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;
      const limit =
        limitStr !== undefined && limitStr.trim().length > 0 ? parseInt(limitStr, 10) : 5;

      const result = await this.service.getSimilarResearchers(profileId, limit);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getResearchTrends = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const period = typeof req.query['period'] === 'string' ? req.query['period'] : undefined;
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;
      const limit =
        limitStr !== undefined && limitStr.trim().length > 0 ? parseInt(limitStr, 10) : 10;

      const result = await this.service.getResearchTrends(period, limit);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getResearchGaps = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const field = typeof req.query['field'] === 'string' ? req.query['field'] : undefined;
      const result = await this.service.getResearchGaps(field);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };

  public getKnowledgeGraph = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId =
        (req.query['profileId'] as string) || (req.query['researcherProfileId'] as string) || '';
      const result = await this.service.getKnowledgeGraph(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (error) {
      next(error);
    }
  };
}
