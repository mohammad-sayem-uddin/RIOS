/**
 * Research Assets Repository Contracts
 */

import { ResearchAsset } from '../aggregates/research-asset.js';
import { ResearchDataset } from '../aggregates/research-dataset.js';
import { SoftwareArtifact } from '../aggregates/software-artifact.js';
import { Experiment } from '../entities/experiment.js';
import { Repository } from '../entities/repository.js';

export interface IResearchDatasetRepository {
  save(dataset: ResearchDataset): Promise<void>;
  findById(id: string): Promise<ResearchDataset | null>;
  findByDOI(doi: string): Promise<ResearchDataset | null>;
  findByResearchProfile(profileId: string): Promise<ResearchDataset[]>;
  search(query: string): Promise<ResearchDataset[]>;
  delete(id: string): Promise<void>;
}

export interface ISoftwareArtifactRepository {
  save(artifact: SoftwareArtifact): Promise<void>;
  findById(id: string): Promise<SoftwareArtifact | null>;
  findByRepository(repositoryUrlOrId: string): Promise<SoftwareArtifact | null>;
  findByResearchProfile(profileId: string): Promise<SoftwareArtifact[]>;
  search(query: string): Promise<SoftwareArtifact[]>;
  delete(id: string): Promise<void>;
}

export interface IResearchAssetRepository {
  save(asset: ResearchAsset): Promise<void>;
  findById(id: string): Promise<ResearchAsset | null>;
  findByResearchProfile(profileId: string): Promise<ResearchAsset[]>;
  findByPublication(publicationId: string): Promise<ResearchAsset[]>;
  search(query: string): Promise<ResearchAsset[]>;
  delete(id: string): Promise<void>;
}

export interface IExperimentRepository {
  save(experiment: Experiment): Promise<void>;
  findById(id: string): Promise<Experiment | null>;
  findByResearchProfile(profileId: string): Promise<Experiment[]>;
  findByProject(projectId: string): Promise<Experiment[]>;
  search(query: string): Promise<Experiment[]>;
  delete(id: string): Promise<void>;
}

export interface IRepositoryRepository {
  save(repository: Repository): Promise<void>;
  findById(id: string): Promise<Repository | null>;
  findByUrl(url: string): Promise<Repository | null>;
  search(query: string): Promise<Repository[]>;
  delete(id: string): Promise<void>;
}
