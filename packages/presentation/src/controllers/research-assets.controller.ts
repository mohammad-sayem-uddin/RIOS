/**
 * Research Assets Controller (Sprint 9)
 *
 * REST Controller coordinating HTTP requests for Research Datasets,
 * Repositories, Software Artifacts, Experiments, and Scholarly Digital Assets.
 */

import type {
  CreateDatasetDto,
  CreateExperimentDto,
  CreateRepositoryDto,
  CreateSoftwareArtifactDto,
  ReleaseSoftwareDto,
  ResearchAssetsApplicationService,
  UploadResearchAssetDto,
} from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class ResearchAssetsController {
  constructor(private readonly service: ResearchAssetsApplicationService) {}

  // Dataset Endpoints
  public createDataset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateDatasetDto;
      const result = await this.service.createDataset(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public publishDataset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const datasetId = String(req.params['id']);
      const body = req.body as { doi: string };
      const result = await this.service.publishDataset({ datasetId, doi: body.doi });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getDatasetById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getDatasetById(id);
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
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
      const profileId =
        typeof req.query['profileId'] === 'string' ? req.query['profileId'] : undefined;
      const result = await this.service.searchDatasets(q, profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deleteDataset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deleteDataset(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Repository Endpoints
  public createRepository = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateRepositoryDto;
      const result = await this.service.createRepository(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getRepositoryById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getRepositoryById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public searchRepositories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
      const result = await this.service.searchRepositories(q);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Software Endpoints
  public createSoftwareArtifact = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateSoftwareArtifactDto;
      const result = await this.service.createSoftwareArtifact(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public releaseSoftware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as ReleaseSoftwareDto;
      const result = await this.service.releaseSoftware(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // Experiment Endpoints
  public createExperiment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateExperimentDto;
      const result = await this.service.createExperiment(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getExperimentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getExperimentById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  // General Research Asset Endpoints
  public uploadResearchAsset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as UploadResearchAssetDto;
      const result = await this.service.uploadResearchAsset(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getResearchAssets = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profileId =
        typeof req.query['profileId'] === 'string' ? req.query['profileId'] : undefined;
      const publicationId =
        typeof req.query['publicationId'] === 'string' ? req.query['publicationId'] : undefined;
      const category =
        typeof req.query['category'] === 'string' ? req.query['category'] : undefined;
      const result = await this.service.getResearchAssets({ profileId, publicationId, category });
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public deleteResearchAsset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.deleteResearchAsset(id);
      ResultHttpMapper.mapResult(res, result, 204, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
