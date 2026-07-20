/**
 * Research Intelligence Repository Contracts (Sprint 11)
 */

import { AcademicTimeline } from '../aggregates/academic-timeline.js';
import { CollaborationNetwork } from '../aggregates/collaboration-network.js';
import { ResearchAnalytics } from '../aggregates/research-analytics.js';

export interface IAcademicTimelineRepository {
  save(timeline: AcademicTimeline): Promise<void>;
  findById(id: string): Promise<AcademicTimeline | null>;
  findByResearchProfile(profileId: string): Promise<AcademicTimeline | null>;
  search(query: string): Promise<AcademicTimeline[]>;
  delete(id: string): Promise<void>;
}

export interface ICollaborationRepository {
  save(network: CollaborationNetwork): Promise<void>;
  findById(id: string): Promise<CollaborationNetwork | null>;
  findByResearchProfile(profileId: string): Promise<CollaborationNetwork | null>;
  search(query: string): Promise<CollaborationNetwork[]>;
  delete(id: string): Promise<void>;
}

export interface IResearchAnalyticsRepository {
  save(analytics: ResearchAnalytics): Promise<void>;
  findById(id: string): Promise<ResearchAnalytics | null>;
  findByResearchProfile(profileId: string): Promise<ResearchAnalytics | null>;
  search(query: string): Promise<ResearchAnalytics[]>;
  delete(id: string): Promise<void>;
}
