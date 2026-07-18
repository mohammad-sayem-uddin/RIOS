/**
 * Professional Experience Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { AcademicPeriod, ExperienceId } from '../value-objects/research-identity-value-objects.js';

export interface ProfessionalExperienceProps {
  positionTitle: string;
  organization: string;
  location?: string;
  period: AcademicPeriod;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfessionalExperience extends Entity<ProfessionalExperienceProps> {
  private constructor(props: ProfessionalExperienceProps, id: UniqueId) {
    super(props, id);
  }

  public get experienceId(): ExperienceId {
    return ExperienceId.from(this._id.value);
  }

  public get positionTitle(): string {
    return this.props.positionTitle;
  }

  public get organization(): string {
    return this.props.organization;
  }

  public get location(): string | undefined {
    return this.props.location;
  }

  public get period(): AcademicPeriod {
    return this.props.period;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public update(
    props: Partial<Omit<ProfessionalExperienceProps, 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.positionTitle !== undefined) this.props.positionTitle = props.positionTitle;
    if (props.organization !== undefined) this.props.organization = props.organization;
    if (props.location !== undefined) this.props.location = props.location;
    if (props.period !== undefined) this.props.period = props.period;
    if (props.description !== undefined) this.props.description = props.description;
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<ProfessionalExperienceProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueId,
  ): Result<ProfessionalExperience> {
    if (!props.positionTitle || !props.positionTitle.trim()) {
      return Result.fail('Position title is required');
    }
    if (!props.organization || !props.organization.trim()) {
      return Result.fail('Organization is required');
    }
    const now = new Date();
    return Result.ok(
      new ProfessionalExperience(
        {
          ...props,
          createdAt: now,
          updatedAt: now,
        },
        id ?? ExperienceId.create(),
      ),
    );
  }
}
