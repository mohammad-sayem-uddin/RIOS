/**
 * Research Interest Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  ResearchInterestId,
  ResearchInterestName,
} from '../value-objects/research-identity-value-objects.js';

export interface ResearchInterestProps {
  name: ResearchInterestName;
  category?: string;
  createdAt: Date;
}

export class ResearchInterest extends Entity<ResearchInterestProps> {
  private constructor(props: ResearchInterestProps, id: UniqueId) {
    super(props, id);
  }

  public get interestId(): ResearchInterestId {
    return ResearchInterestId.from(this._id.value);
  }

  public get name(): ResearchInterestName {
    return this.props.name;
  }

  public get category(): string | undefined {
    return this.props.category;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: Omit<ResearchInterestProps, 'createdAt'>,
    id?: UniqueId,
  ): Result<ResearchInterest> {
    return Result.ok(
      new ResearchInterest(
        {
          ...props,
          createdAt: new Date(),
        },
        id ?? ResearchInterestId.create(),
      ),
    );
  }
}
