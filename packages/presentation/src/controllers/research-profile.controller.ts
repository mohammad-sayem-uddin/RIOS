/**
 * Research Profile Controller (Sprint 7)
 *
 * REST Controller coordinating HTTP requests for Research Profile operations.
 * Thin presentation controller delegating to ResearchProfileApplicationService.
 */

import type { ResearchProfileApplicationService } from '@rios/application';
import type { NextFunction, Request, Response } from 'express';

import type {
  AddEducationApiRequestDto,
  AddExperienceApiRequestDto,
  AddExternalProfileApiRequestDto,
  AddResearchInterestApiRequestDto,
  AddSkillApiRequestDto,
  CreateResearchProfileApiRequestDto,
  UpdateBiographyApiRequestDto,
  UploadPortfolioAssetApiRequestDto,
} from '../dto/research-profile-dtos.js';
import { ResultHttpMapper } from '../responders/result-http-mapper.js';

export class ResearchProfileController {
  constructor(private readonly service: ResearchProfileApplicationService) {}

  public createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateResearchProfileApiRequestDto;
      const result = await this.service.createProfile(dto);
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getProfileById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const result = await this.service.getProfileById(id);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public getProfileByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = String(req.params['userId']);
      const result = await this.service.getProfileByUserId(userId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public updateBiography = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as UpdateBiographyApiRequestDto;
      const result = await this.service.updateBiography(id, dto.biography);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddEducationApiRequestDto;
      const endDate =
        typeof dto.endDate === 'string' && dto.endDate.length > 0 ? new Date(dto.endDate) : null;
      const result = await this.service.addEducation({
        profileId: id,
        institution: dto.institution,
        degree: dto.degree,
        fieldOfStudy: dto.fieldOfStudy,
        startDate: new Date(dto.startDate),
        endDate,
        isCurrent: dto.isCurrent ?? false,
        grade: dto.grade,
        description: dto.description,
      });
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeEducation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const eduId = String(req.params['educationId']);
      const result = await this.service.removeEducation(id, eduId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddExperienceApiRequestDto;
      const endDate =
        typeof dto.endDate === 'string' && dto.endDate.length > 0 ? new Date(dto.endDate) : null;
      const result = await this.service.addExperience({
        profileId: id,
        positionTitle: dto.positionTitle,
        organization: dto.organization,
        location: dto.location,
        startDate: new Date(dto.startDate),
        endDate,
        isCurrent: dto.isCurrent ?? false,
        description: dto.description,
      });
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeExperience = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const expId = String(req.params['experienceId']);
      const result = await this.service.removeExperience(id, expId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addResearchInterest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddResearchInterestApiRequestDto;
      const result = await this.service.addResearchInterest({
        profileId: id,
        name: dto.name,
        category: dto.category,
      });
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeResearchInterest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const interestId = String(req.params['interestId']);
      const result = await this.service.removeResearchInterest(id, interestId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddSkillApiRequestDto;
      const result = await this.service.addSkill({
        profileId: id,
        name: dto.name,
        category: dto.category,
        proficiencyLevel: dto.proficiencyLevel,
      });
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const skillId = String(req.params['skillId']);
      const result = await this.service.removeSkill(id, skillId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public addExternalProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as AddExternalProfileApiRequestDto;
      const result = await this.service.addExternalProfile({
        profileId: id,
        provider: dto.provider,
        url: dto.url,
        externalIdentifier: dto.externalIdentifier,
      });
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removeExternalProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const profileId = String(req.params['externalProfileId']);
      const result = await this.service.removeExternalProfile(id, profileId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public uploadPortfolioAsset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const dto = req.body as UploadPortfolioAssetApiRequestDto;
      const result = await this.service.uploadPortfolioAsset({
        profileId: id,
        title: dto.title,
        assetType: dto.assetType,
        fileUrl: dto.fileUrl,
        mimeType: dto.mimeType,
        fileSizeBytes: dto.fileSizeBytes,
      });
      ResultHttpMapper.mapResult(res, result, 201, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };

  public removePortfolioAsset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params['id']);
      const assetId = String(req.params['assetId']);
      const result = await this.service.removePortfolioAsset(id, assetId);
      ResultHttpMapper.mapResult(res, result, 200, req.context?.correlationId);
    } catch (err) {
      next(err);
    }
  };
}
