/**
 * Collaboration Entity (Sprint 11)
 *
 * Represents a research collaboration between the researcher and another party.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { CollaborationStrength } from '../value-objects/research-intelligence-value-objects.js';

import { CoAuthor } from './co-author.js';

export interface CollaborationProps {
  collaboratorName: string;
  collaboratorEmail?: string;
  collaboratorOrcid?: string;
  institution?: string;
  strength: CollaborationStrength;
  jointPublicationCount: number;
  firstCollabDate?: Date;
  lastCollabDate?: Date;
  coAuthors: CoAuthor[];
}

export class Collaboration extends Entity<CollaborationProps> {
  private constructor(props: CollaborationProps, id?: UniqueId) {
    super(props, id);
  }

  public get collaboratorName(): string {
    return this.props.collaboratorName;
  }

  public get collaboratorEmail(): string | undefined {
    return this.props.collaboratorEmail;
  }

  public get collaboratorOrcid(): string | undefined {
    return this.props.collaboratorOrcid;
  }

  public get institution(): string | undefined {
    return this.props.institution;
  }

  public get strength(): CollaborationStrength {
    return this.props.strength;
  }

  public get jointPublicationCount(): number {
    return this.props.jointPublicationCount;
  }

  public get firstCollabDate(): Date | undefined {
    return this.props.firstCollabDate;
  }

  public get lastCollabDate(): Date | undefined {
    return this.props.lastCollabDate;
  }

  public get coAuthors(): ReadonlyArray<CoAuthor> {
    return [...this.props.coAuthors];
  }

  public updateStrength(strength: CollaborationStrength): void {
    this.props.strength = strength;
  }

  public addCoAuthor(coAuthor: CoAuthor): void {
    this.props.coAuthors.push(coAuthor);
  }

  public static create(
    props: {
      collaboratorName: string;
      collaboratorEmail?: string;
      collaboratorOrcid?: string;
      institution?: string;
      strength: CollaborationStrength;
      jointPublicationCount?: number;
      firstCollabDate?: Date;
      lastCollabDate?: Date;
      coAuthors?: CoAuthor[];
    },
    id?: UniqueId,
  ): Result<Collaboration> {
    if (props.collaboratorName.trim().length === 0) {
      return Result.fail<Collaboration>('Collaborator name cannot be empty');
    }
    if (props.collaboratorName.length > 255) {
      return Result.fail<Collaboration>('Collaborator name cannot exceed 255 characters');
    }

    const collaboratorEmail =
      props.collaboratorEmail !== undefined && props.collaboratorEmail.trim() !== ''
        ? props.collaboratorEmail.trim()
        : undefined;

    const collaboratorOrcid =
      props.collaboratorOrcid !== undefined && props.collaboratorOrcid.trim() !== ''
        ? props.collaboratorOrcid.trim()
        : undefined;

    const institution =
      props.institution !== undefined && props.institution.trim() !== ''
        ? props.institution.trim()
        : undefined;

    return Result.ok<Collaboration>(
      new Collaboration(
        {
          collaboratorName: props.collaboratorName.trim(),
          collaboratorEmail,
          collaboratorOrcid,
          institution,
          strength: props.strength,
          jointPublicationCount: props.jointPublicationCount ?? 1,
          firstCollabDate: props.firstCollabDate,
          lastCollabDate: props.lastCollabDate,
          coAuthors: props.coAuthors ?? [],
        },
        id,
      ),
    );
  }
}
