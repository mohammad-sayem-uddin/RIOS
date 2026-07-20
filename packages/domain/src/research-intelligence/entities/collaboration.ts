/**
 * Collaboration Entity (Sprint 11)
 *
 * Represents a research collaboration between the researcher and another party.
 */

import { Entity, UniqueId, Result } from '@rios/shared';

import {
  CollaborationId,
  CollaborationStrength,
  CollaborationStrengthType,
  ResearchDomain,
  InstitutionId,
} from '../value-objects/research-intelligence-value-objects.js';

export interface CollaborationProps {
  id: CollaborationId;
  profileId: string;
  collaboratorName: string;
  collaboratorEmail?: string;
  institutionId?: InstitutionId;
  institutionName?: string;
  strength: CollaborationStrength;
  domains: ResearchDomain[];
  startDate: Date;
  endDate?: Date;
  publicationCount: number;
  projectCount: number;
  isActive: boolean;
}

export class Collaboration extends Entity<CollaborationProps> {
  private constructor(props: CollaborationProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get collaboratorName(): string {
    return this.props.collaboratorName;
  }

  public get collaboratorEmail(): string | undefined {
    return this.props.collaboratorEmail;
  }

  public get institutionId(): InstitutionId | undefined {
    return this.props.institutionId;
  }

  public get institutionName(): string | undefined {
    return this.props.institutionName;
  }

  public get strength(): CollaborationStrength {
    return this.props.strength;
  }

  public get domains(): ReadonlyArray<ResearchDomain> {
    return [...this.props.domains];
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date | undefined {
    return this.props.endDate;
  }

  public get publicationCount(): number {
    return this.props.publicationCount;
  }

  public get projectCount(): number {
    return this.props.projectCount;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public updateStrength(strength: CollaborationStrength): void {
    this.props.strength = strength;
  }

  public incrementPublicationCount(): void {
    this.props.publicationCount += 1;
  }

  public incrementProjectCount(): void {
    this.props.projectCount += 1;
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.endDate = new Date();
  }

  public addDomain(domain: ResearchDomain): void {
    const exists = this.props.domains.some((d) => d.value === domain.value);
    if (!exists) {
      this.props.domains.push(domain);
    }
  }

  public static create(props: {
    id: CollaborationId;
    profileId: string;
    collaboratorName: string;
    collaboratorEmail?: string;
    institutionId?: InstitutionId;
    institutionName?: string;
    strength: CollaborationStrengthType;
    domains: string[];
    startDate: Date;
    endDate?: Date;
    publicationCount?: number;
    projectCount?: number;
    isActive?: boolean;
  }): Result<Collaboration> {
    if (props.collaboratorName.trim().length === 0) {
      return Result.fail<Collaboration>('Collaborator name cannot be empty');
    }
    if (props.collaboratorName.length > 255) {
      return Result.fail<Collaboration>('Collaborator name cannot exceed 255 characters');
    }
    if (props.profileId.trim().length === 0) {
      return Result.fail<Collaboration>('Profile ID is required');
    }

    const strengthResult = CollaborationStrength.create(props.strength);
    if (strengthResult.isFailure) {
      return Result.fail<Collaboration>(strengthResult.error);
    }

    const domainVOs: ResearchDomain[] = [];
    for (const domain of props.domains) {
      const domainResult = ResearchDomain.create(domain);
      if (domainResult.isFailure) {
        return Result.fail<Collaboration>(domainResult.error);
      }
      domainVOs.push(domainResult.value);
    }

    if (props.startDate > (props.endDate ?? new Date())) {
      return Result.fail<Collaboration>('Start date cannot be after end date');
    }

    return Result.ok<Collaboration>(
      new Collaboration({
        id: props.id,
        profileId: props.profileId.trim(),
        collaboratorName: props.collaboratorName.trim(),
        collaboratorEmail: props.collaboratorEmail,
        institutionId: props.institutionId,
        institutionName: props.institutionName,
        strength: strengthResult.value,
        domains: domainVOs,
        startDate: props.startDate,
        endDate: props.endDate,
        publicationCount: props.publicationCount ?? 0,
        projectCount: props.projectCount ?? 0,
        isActive: props.isActive ?? true,
      }),
    );
  }
}
