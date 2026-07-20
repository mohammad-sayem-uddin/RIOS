/**
 * Research Discovery Controller (Sprint 12)
 *
 * REST Controller coordinating HTTP requests for Search Platform, Public Profiles, and Research Portfolios.
 */

import type {
  CreatePortfolioCommand,
  PublishProfileCommand,
  ResearchDiscoveryApplicationService,
  UnpublishProfileCommand,
  UpdateSearchIndexCommand,
} from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class ResearchDiscoveryController {
  constructor(private readonly service: ResearchDiscoveryApplicationService) {}

  public globalSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : undefined;
      const category =
        typeof req.query['category'] === 'string' ? req.query['category'] : undefined;
      const institution =
        typeof req.query['institution'] === 'string' ? req.query['institution'] : undefined;
      const authorName =
        typeof req.query['authorName'] === 'string' ? req.query['authorName'] : undefined;
      const sortField =
        typeof req.query['sortField'] === 'string' ? req.query['sortField'] : undefined;
      const rawSortDir =
        typeof req.query['sortDirection'] === 'string' ? req.query['sortDirection'] : undefined;
      const sortDirection: 'ASC' | 'DESC' | undefined =
        rawSortDir === 'ASC' || rawSortDir === 'DESC' ? rawSortDir : undefined;

      const pageStr = typeof req.query['page'] === 'string' ? req.query['page'] : undefined;
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;

      const input = {
        query: q,
        category,
        institution,
        authorName,
        sortField,
        sortDirection,
        page: pageStr !== undefined ? parseInt(pageStr, 10) : 1,
        limit: limitStr !== undefined ? parseInt(limitStr, 10) : 20,
      };

      const result = await this.service.globalSearch(input);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchResearchers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : undefined;
      const pageStr = typeof req.query['page'] === 'string' ? req.query['page'] : undefined;
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;

      const input = {
        query: q,
        page: pageStr !== undefined ? parseInt(pageStr, 10) : 1,
        limit: limitStr !== undefined ? parseInt(limitStr, 10) : 20,
      };

      const result = await this.service.searchResearchers(input);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchPublications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : undefined;
      const pageStr = typeof req.query['page'] === 'string' ? req.query['page'] : undefined;
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;

      const input = {
        query: q,
        page: pageStr !== undefined ? parseInt(pageStr, 10) : 1,
        limit: limitStr !== undefined ? parseInt(limitStr, 10) : 20,
      };

      const result = await this.service.searchPublications(input);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchProjects = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : undefined;
      const pageStr = typeof req.query['page'] === 'string' ? req.query['page'] : undefined;
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;

      const input = {
        query: q,
        page: pageStr !== undefined ? parseInt(pageStr, 10) : 1,
        limit: limitStr !== undefined ? parseInt(limitStr, 10) : 20,
      };

      const result = await this.service.searchProjects(input);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchDatasets = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : undefined;
      const pageStr = typeof req.query['page'] === 'string' ? req.query['page'] : undefined;
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;

      const input = {
        query: q,
        page: pageStr !== undefined ? parseInt(pageStr, 10) : 1,
        limit: limitStr !== undefined ? parseInt(limitStr, 10) : 20,
      };

      const result = await this.service.searchDatasets(input);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchInstitutions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
      const limitStr = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;
      const offsetStr = typeof req.query['offset'] === 'string' ? req.query['offset'] : undefined;

      const limit = limitStr !== undefined ? parseInt(limitStr, 10) : 20;
      const offset = offsetStr !== undefined ? parseInt(offsetStr, 10) : 0;

      const result = await this.service.searchInstitutions(q, limit, offset);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getPublicProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const slug = typeof req.params['slug'] === 'string' ? req.params['slug'] : '';
      const result = await this.service.getPublicProfile(slug);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = typeof req.params['slug'] === 'string' ? req.params['slug'] : '';
      const result = await this.service.getPortfolio(slug);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public publishProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as PublishProfileCommand;
      const result = await this.service.publishProfile(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public unpublishProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as UnpublishProfileCommand;
      const result = await this.service.unpublishProfile(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updateSearchIndex = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as UpdateSearchIndexCommand;
      const result = await this.service.updateSearchIndex(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public createPortfolio = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body as CreatePortfolioCommand;
      const result = await this.service.createPortfolio(command);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
