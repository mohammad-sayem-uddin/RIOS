/**
 * CollaborationNetwork Aggregate Root (Sprint 11)
 *
 * Manages collaboration networks, co-author relationships,
 * and collaboration strength for a researcher.
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { Collaboration } from '../entities/collaboration.js';
import {
  CollaborationCreatedEvent,
  CollaborationRemovedEvent,
} from '../events/research-intelligence-events.js';

export interface CollaborationNetworkProps {
  profileId: string;
  collaborations: Collaboration[];
  createdAt: Date;
  updatedAt: Date;
}

export class CollaborationNetwork extends AggregateRoot<CollaborationNetworkProps> {
  private constructor(props: CollaborationNetworkProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get collaborations(): ReadonlyArray<Collaboration> {
    return [...this.props.collaborations];
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public addCollaboration(collaboration: Collaboration): Result<void> {
    // Invariant: duplicate collaborations are forbidden
    const exists = this.props.collaborations.some(
      (c) =>
        c.collaboratorName.toLowerCase() === collaboration.collaboratorName.toLowerCase() ||
        (c.collaboratorEmail !== undefined &&
          collaboration.collaboratorEmail !== undefined &&
          c.collaboratorEmail.toLowerCase() === collaboration.collaboratorEmail.toLowerCase()) ||
        (c.collaboratorOrcid !== undefined &&
          collaboration.collaboratorOrcid !== undefined &&
          c.collaboratorOrcid === collaboration.collaboratorOrcid),
    );

    if (exists) {
      return Result.fail<void>('Duplicate collaboration is forbidden');
    }

    this.props.collaborations.push(collaboration);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new CollaborationCreatedEvent(
        collaboration.id.value,
        this.props.profileId,
        collaboration.collaboratorName,
        collaboration.strength.value,
      ),
    );

    return Result.ok<void>(undefined);
  }

  public removeCollaboration(collaborationId: string): Result<void> {
    const index = this.props.collaborations.findIndex((c) => c.id.value === collaborationId);
    if (index === -1) {
      return Result.fail<void>('Collaboration not found');
    }

    this.props.collaborations.splice(index, 1);
    this.props.updatedAt = new Date();

    this.addDomainEvent(new CollaborationRemovedEvent(collaborationId, this.props.profileId));
    return Result.ok<void>(undefined);
  }

  public getCollaborationsByStrength(strength: string): Collaboration[] {
    return this.props.collaborations.filter((c) => c.strength.value === strength);
  }

  public static create(props: {
    id?: string;
    profileId: string;
    collaborations?: Collaboration[];
  }): Result<CollaborationNetwork> {
    if (props.profileId.trim().length === 0) {
      return Result.fail<CollaborationNetwork>('Profile ID is required');
    }

    const id =
      props.id !== undefined && props.id.trim().length > 0
        ? UniqueId.from(props.id)
        : UniqueId.create();
    const now = new Date();

    const network = new CollaborationNetwork(
      {
        profileId: props.profileId.trim(),
        collaborations: props.collaborations ?? [],
        createdAt: now,
        updatedAt: now,
      },
      id,
    );

    return Result.ok<CollaborationNetwork>(network);
  }
}
