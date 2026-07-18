/**
 * Research Identity Controller.
 *
 * Thin controller coordinating HTTP REST requests for Research Identity operations.
 * Responsibilities:
 * - Read request parameters and DTOs.
 * - Delegate execution directly to ResearchIdentityApplicationService.
 * - Delegate response formatting to ResultHttpMapper.
 *
 * Invariants:
 * - Zero business logic.
 * - Zero repository or Prisma access.
 * - Zero aggregate manipulation.
 * - Zero transaction handling.
 */

import type { ResearchIdentityApplicationService } from '@rios/application';
import type { Request, Response, NextFunction } from 'express';

import type {
  CreateResearchIdentityRequestDto,
  UpdateResearchVisionRequestDto,
  AddResearchAreaRequestDto,
  AddResearchQuestionRequestDto,
  AddResearchGoalRequestDto,
  RecordContributionRequestDto,
  UpdateResearchAgendaRequestDto,
  SetResearchPhilosophyRequestDto,
  ReviseResearchPhilosophyRequestDto,
  RecordEvolutionRequestDto,
} from '../dto/research-identity-dtos.js';
import { RequestMapper } from '../mappers/request-mappers.js';
import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class ResearchIdentityController {
  constructor(private readonly service: ResearchIdentityApplicationService) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateResearchIdentityRequestDto;
      const command = RequestMapper.toCreateCommand(dto);
      const result = await this.service.establishResearchIdentity(command);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId, (id) => ({
        id: id.toString(),
      }));
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const query = RequestMapper.toGetQuery(id);
      const result = await this.service.retrieveResearchIdentity(query);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public find = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stageParam = req.query['stage'];
      const focusParam = req.query['focus'];
      const limitParam = req.query['limit'];
      const offsetParam = req.query['offset'];

      const query = RequestMapper.toFindQuery({
        stage: typeof stageParam === 'string' && stageParam.trim() !== '' ? stageParam : undefined,
        focus: typeof focusParam === 'string' && focusParam.trim() !== '' ? focusParam : undefined,
        limit:
          typeof limitParam === 'string' && limitParam.trim() !== ''
            ? Number(limitParam)
            : undefined,
        offset:
          typeof offsetParam === 'string' && offsetParam.trim() !== ''
            ? Number(offsetParam)
            : undefined,
      });
      const result = await this.service.discoverResearchIdentities(query);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const qParam = req.query['q'] ?? req.query['query'];
      const searchTerm = typeof qParam === 'string' ? qParam : '';
      const limitParam = req.query['limit'];

      const query = RequestMapper.toSearchQuery({
        query: searchTerm,
        limit:
          typeof limitParam === 'string' && limitParam.trim() !== ''
            ? Number(limitParam)
            : undefined,
      });
      const result = await this.service.exploreResearchIdentities(query);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updateVision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as UpdateResearchVisionRequestDto;
      const command = RequestMapper.toUpdateVisionCommand(id, dto);
      const result = await this.service.refineResearchVision(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addArea = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddResearchAreaRequestDto;
      const command = RequestMapper.toAddAreaCommand(id, dto);
      const result = await this.service.incorporateResearchArea(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeArea = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const areaId = String(req.params['areaId']);
      const command = RequestMapper.toRemoveAreaCommand(id, areaId);
      const result = await this.service.archiveResearchArea(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddResearchQuestionRequestDto;
      const command = RequestMapper.toAddQuestionCommand(id, dto);
      const result = await this.service.poseResearchQuestion(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddResearchGoalRequestDto;
      const command = RequestMapper.toAddGoalCommand(id, dto);
      const result = await this.service.pursueResearchGoal(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const goalId = String(req.params['goalId']);
      const command = RequestMapper.toRemoveGoalCommand(id, goalId);
      const result = await this.service.retireResearchGoal(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public recordContribution = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as RecordContributionRequestDto;
      const command = RequestMapper.toRecordContributionCommand(id, dto);
      const result = await this.service.documentContribution(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updateAgenda = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as UpdateResearchAgendaRequestDto;
      const command = RequestMapper.toUpdateAgendaCommand(id, dto);
      const result = await this.service.reshapeResearchAgenda(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public setPhilosophy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as SetResearchPhilosophyRequestDto;
      const command = RequestMapper.toSetPhilosophyCommand(id, dto);
      const result = await this.service.establishPhilosophy(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public revisePhilosophy = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as ReviseResearchPhilosophyRequestDto;
      const command = RequestMapper.toRevisePhilosophyCommand(id, dto);
      const result = await this.service.evolvePhilosophy(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public recordEvolution = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as RecordEvolutionRequestDto;
      const command = RequestMapper.toRecordEvolutionCommand(id, dto);
      const result = await this.service.chronicleEvolution(command);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
