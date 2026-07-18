/**
 * Skill Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { SkillId, SkillName } from '../value-objects/research-identity-value-objects.js';

export const SkillCategory = {
  PROGRAMMING_LANGUAGE: 'PROGRAMMING_LANGUAGE',
  AI_TECHNOLOGY: 'AI_TECHNOLOGY',
  RESEARCH_METHODOLOGY: 'RESEARCH_METHODOLOGY',
  FRAMEWORK: 'FRAMEWORK',
  LABORATORY: 'LABORATORY',
  PROFESSIONAL: 'PROFESSIONAL',
  OTHER: 'OTHER',
} as const;

export type SkillCategoryType = (typeof SkillCategory)[keyof typeof SkillCategory];

export interface SkillProps {
  name: SkillName;
  category: SkillCategoryType;
  proficiencyLevel?: string;
  createdAt: Date;
}

export class Skill extends Entity<SkillProps> {
  private constructor(props: SkillProps, id: UniqueId) {
    super(props, id);
  }

  public get skillId(): SkillId {
    return SkillId.from(this._id.value);
  }

  public get name(): SkillName {
    return this.props.name;
  }

  public get category(): SkillCategoryType {
    return this.props.category;
  }

  public get proficiencyLevel(): string | undefined {
    return this.props.proficiencyLevel;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: Omit<SkillProps, 'createdAt'>, id?: UniqueId): Result<Skill> {
    return Result.ok(
      new Skill(
        {
          ...props,
          createdAt: new Date(),
        },
        id ?? SkillId.create(),
      ),
    );
  }
}
