/**
 * Education Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  AcademicPeriod,
  DegreeName,
  EducationId,
  InstitutionName,
} from '../value-objects/research-identity-value-objects.js';

export interface EducationProps {
  institution: InstitutionName;
  degree: DegreeName;
  fieldOfStudy: string;
  period: AcademicPeriod;
  grade?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Education extends Entity<EducationProps> {
  private constructor(props: EducationProps, id: UniqueId) {
    super(props, id);
  }

  public get educationId(): EducationId {
    return EducationId.from(this._id.value);
  }

  public get institution(): InstitutionName {
    return this.props.institution;
  }

  public get degree(): DegreeName {
    return this.props.degree;
  }

  public get fieldOfStudy(): string {
    return this.props.fieldOfStudy;
  }

  public get period(): AcademicPeriod {
    return this.props.period;
  }

  public get grade(): string | undefined {
    return this.props.grade;
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

  public update(props: Partial<Omit<EducationProps, 'createdAt' | 'updatedAt'>>): void {
    if (props.institution) this.props.institution = props.institution;
    if (props.degree) this.props.degree = props.degree;
    if (props.fieldOfStudy !== undefined) this.props.fieldOfStudy = props.fieldOfStudy;
    if (props.period) this.props.period = props.period;
    if (props.grade !== undefined) this.props.grade = props.grade;
    if (props.description !== undefined) this.props.description = props.description;
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<EducationProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueId,
  ): Result<Education> {
    const now = new Date();
    return Result.ok(
      new Education(
        {
          ...props,
          createdAt: now,
          updatedAt: now,
        },
        id ?? EducationId.create(),
      ),
    );
  }
}
