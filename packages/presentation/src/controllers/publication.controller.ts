/**
 * Publication Controller (Sprint 8)
 *
 * REST Controller coordinating HTTP requests for Publication operations.
 */

import type { PublicationApplicationService } from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import type {
  CreatePublicationApiRequestDto,
  PublishPublicationApiRequestDto,
  SubmitPublicationApiRequestDto,
  UpdatePublicationApiRequestDto,
} from '../dto/publication-dtos.js';
import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class PublicationController {
  constructor(private readonly service: PublicationApplicationService) {}

  public createPublication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreatePublicationApiRequestDto;
      const result = await this.service.createPublication(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getPublicationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getPublicationById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getPublicationsByProfileId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId = String(req.params['profileId']);
      const result = await this.service.getPublicationsByProfileId(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updatePublication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const body = req.body as UpdatePublicationApiRequestDto;
      const result = await this.service.updatePublication({ id, ...body });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public publishPublication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as PublishPublicationApiRequestDto;
      const result = await this.service.publishPublication(id, dto.publishedDate);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public submitPublication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as SubmitPublicationApiRequestDto;
      const result = await this.service.submitPublication(id, dto.submittedDate);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deletePublication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deletePublication(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
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
      const qParam = req.query['q'];
      const query = typeof qParam === 'string' ? qParam : '';

      const typeParam = req.query['type'];
      const type = typeof typeParam === 'string' && typeParam.length > 0 ? typeParam : undefined;

      const statusParam = req.query['status'];
      const status =
        typeof statusParam === 'string' && statusParam.length > 0 ? statusParam : undefined;

      const yearParam = req.query['year'];
      const year =
        typeof yearParam === 'string' && yearParam.length > 0 ? Number(yearParam) : undefined;

      const profileIdParam = req.query['profileId'];
      const profileId =
        typeof profileIdParam === 'string' && profileIdParam.length > 0
          ? profileIdParam
          : undefined;

      const result = await this.service.searchPublications(query, {
        type,
        status,
        year,
        profileId,
      });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileIdParam = req.query['profileId'];
      const profileId = typeof profileIdParam === 'string' ? profileIdParam : '';
      const result = await this.service.getPublicationStatistics(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
