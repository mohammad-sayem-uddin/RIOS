/**
 * Publications Repository Contracts
 */

import { Repository, UniqueId } from '@rios/shared';

import { Publication } from '../aggregates/publication.js';
import { ResearchProject } from '../aggregates/research-project.js';
import { Venue } from '../entities/venue.js';
import { DOI, ProjectId, PublicationId } from '../value-objects/publication-value-objects.js';

export interface PublicationSearchFilters {
  query?: string;
  type?: string;
  status?: string;
  year?: number;
  authorName?: string;
}

export interface IPublicationRepository extends Repository<Publication> {
  findById(id: PublicationId): Promise<Publication | null>;
  findByDOI(doi: DOI): Promise<Publication | null>;
  findByAuthor(authorIdOrName: string): Promise<Publication[]>;
  findByResearchProfile(profileId: UniqueId): Promise<Publication[]>;
  search(query: string, filters?: PublicationSearchFilters): Promise<Publication[]>;
  save(publication: Publication): Promise<void>;
  delete(id: PublicationId): Promise<void>;
}

export interface IResearchProjectRepository extends Repository<ResearchProject> {
  findById(id: ProjectId): Promise<ResearchProject | null>;
  findByResearchProfile(profileId: UniqueId): Promise<ResearchProject[]>;
  save(project: ResearchProject): Promise<void>;
  delete(id: ProjectId): Promise<void>;
}

export interface IVenueRepository {
  findById(id: UniqueId): Promise<Venue | null>;
  findByName(name: string): Promise<Venue | null>;
  search(query: string): Promise<Venue[]>;
  save(venue: Venue): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}
