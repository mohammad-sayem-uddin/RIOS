/**
 * Research Project Controller (Sprint 8)
 *
 * REST Controller coordinating HTTP requests for Research Project operations.
 */

import type { ProjectMemberInputDto, PublicationApplicationService } from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import type {
  CompleteResearchProjectApiRequestDto,
  CreateResearchProjectApiRequestDto,
  UpdateResearchProjectApiRequestDto,
} from '../dto/publication-dtos.js';
import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class ResearchProjectController {
  constructor(private readonly service: PublicationApplicationService) {}

  public createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const profileId =
        (typeof body['profileId'] === 'string' && body['profileId'].trim() !== ''
          ? body['profileId'].trim()
          : req.user?.userId) || '00000000-0000-0000-0000-000000000000';
      const startDate =
        typeof body['startDate'] === 'string' && body['startDate'].trim() !== ''
          ? body['startDate'].trim()
          : new Date().toISOString();

      const dto: CreateResearchProjectApiRequestDto = {
        members: [],
        ...body,
        profileId,
        title: typeof body['title'] === 'string' ? body['title'] : '',
        description: typeof body['description'] === 'string' ? body['description'] : '',
        startDate,
      };

      const result = await this.service.createResearchProject(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getProjectById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getResearchProjectById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getProjectsByProfileId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId = String(req.params['profileId']);
      const result = await this.service.getResearchProjectsByProfileId(profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const body = req.body as UpdateResearchProjectApiRequestDto;
      const result = await this.service.updateResearchProject({ id, ...body });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public completeProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as CompleteResearchProjectApiRequestDto;
      const result = await this.service.completeResearchProject(id, dto.endDate);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deleteResearchProject(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const member = req.body as ProjectMemberInputDto;
      const result = await this.service.addProjectMember(id, member);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const memberId = String(req.params['memberId']);
      const result = await this.service.removeProjectMember(id, memberId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
