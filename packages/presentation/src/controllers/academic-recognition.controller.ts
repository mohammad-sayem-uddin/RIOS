/**
 * Academic Recognition Controller (Sprint 10)
 *
 * REST Controller coordinating HTTP requests for Awards, Grants, Patents,
 * and Professional Activities.
 */

import type {
  AcademicRecognitionApplicationService,
  CreateAwardDto,
  CreateGrantDto,
  CreatePatentDto,
  CreateProfessionalActivityDto,
  UpdatePatentStatusDto,
} from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class AcademicRecognitionController {
  constructor(private readonly service: AcademicRecognitionApplicationService) {}

  // Awards
  public createAward = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateAwardDto;
      const result = await this.service.createAward(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getAwardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getAwardById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchAwards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
      const profileId =
        typeof req.query['profileId'] === 'string' ? req.query['profileId'] : undefined;
      const result =
        profileId !== undefined && profileId !== ''
          ? await this.service.getAwardsByProfileId(profileId)
          : await this.service.searchAwards(q);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deleteAward = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deleteAward(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Grants
  public createGrant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateGrantDto;
      const result = await this.service.createGrant(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getGrantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getGrantById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchGrants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
      const profileId =
        typeof req.query['profileId'] === 'string' ? req.query['profileId'] : undefined;
      const result =
        profileId !== undefined && profileId !== ''
          ? await this.service.getGrantsByProfileId(profileId)
          : await this.service.searchGrants(q);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public completeGrant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.completeGrant(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deleteGrant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deleteGrant(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Patents
  public createPatent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreatePatentDto;
      const result = await this.service.createPatent(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getPatentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getPatentById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchPatents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
      const profileId =
        typeof req.query['profileId'] === 'string' ? req.query['profileId'] : undefined;
      const result =
        profileId !== undefined && profileId !== ''
          ? await this.service.getPatentsByProfileId(profileId)
          : await this.service.searchPatents(q);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updatePatentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const patentId = String(req.params['id']);
      const body = req.body as { nextStatus: string; grantDate?: string };
      const dto: UpdatePatentStatusDto = {
        patentId,
        nextStatus: body.nextStatus,
        grantDate: body.grantDate,
      };
      const result = await this.service.updatePatentStatus(dto);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deletePatent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deletePatent(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Professional Activities
  public createProfessionalActivity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateProfessionalActivityDto;
      const result = await this.service.createProfessionalActivity(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getProfessionalActivityById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getProfessionalActivityById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchProfessionalActivities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
      const profileId =
        typeof req.query['profileId'] === 'string' ? req.query['profileId'] : undefined;
      const result =
        profileId !== undefined && profileId !== ''
          ? await this.service.getProfessionalActivitiesByProfileId(profileId)
          : await this.service.searchProfessionalActivities(q);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deleteProfessionalActivity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deleteProfessionalActivity(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
