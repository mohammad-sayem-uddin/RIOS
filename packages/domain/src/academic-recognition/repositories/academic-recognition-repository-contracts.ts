/**
 * Academic Recognition Repository Contracts
 */

import { Award } from '../aggregates/award.js';
import { Grant } from '../aggregates/grant.js';
import { Patent } from '../aggregates/patent.js';
import { ProfessionalActivity } from '../aggregates/professional-activity.js';

export interface IAwardRepository {
  save(award: Award): Promise<void>;
  findById(id: string): Promise<Award | null>;
  findByResearchProfile(profileId: string): Promise<Award[]>;
  search(query: string): Promise<Award[]>;
  delete(id: string): Promise<void>;
}

export interface IGrantRepository {
  save(grant: Grant): Promise<void>;
  findById(id: string): Promise<Grant | null>;
  findByGrantNumber(grantNumber: string): Promise<Grant | null>;
  findByResearchProfile(profileId: string): Promise<Grant[]>;
  search(query: string): Promise<Grant[]>;
  delete(id: string): Promise<void>;
}

export interface IPatentRepository {
  save(patent: Patent): Promise<void>;
  findById(id: string): Promise<Patent | null>;
  findByPatentNumber(patentNumber: string): Promise<Patent | null>;
  findByResearchProfile(profileId: string): Promise<Patent[]>;
  search(query: string): Promise<Patent[]>;
  delete(id: string): Promise<void>;
}

export interface IProfessionalActivityRepository {
  save(activity: ProfessionalActivity): Promise<void>;
  findById(id: string): Promise<ProfessionalActivity | null>;
  findByResearchProfile(profileId: string): Promise<ProfessionalActivity[]>;
  search(query: string): Promise<ProfessionalActivity[]>;
  delete(id: string): Promise<void>;
}
