/**
 * Experiment Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface ExperimentProps {
  title: string;
  description?: string;
  projectId?: string;
  profileId?: string;
  parametersJson?: string;
  metricsJson?: string;
  status: string; // e.g. PLANNED, IN_PROGRESS, COMPLETED, FAILED
  executedAt?: Date;
}

export class Experiment extends Entity<ExperimentProps> {
  private constructor(props: ExperimentProps, id?: UniqueId) {
    super(props, id);
  }

  public get title(): string {
    return this.props.title;
  }
  public get description(): string | undefined {
    return this.props.description;
  }
  public get projectId(): string | undefined {
    return this.props.projectId;
  }
  public get profileId(): string | undefined {
    return this.props.profileId;
  }
  public get parametersJson(): string | undefined {
    return this.props.parametersJson;
  }
  public get metricsJson(): string | undefined {
    return this.props.metricsJson;
  }
  public get status(): string {
    return this.props.status;
  }
  public get executedAt(): Date | undefined {
    return this.props.executedAt;
  }

  public static create(
    props: {
      title: string;
      description?: string;
      projectId?: string;
      profileId?: string;
      parametersJson?: string;
      metricsJson?: string;
      status?: string;
      executedAt?: Date;
    },
    id?: UniqueId,
  ): Result<Experiment> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<Experiment>('Experiment title is required.');
    }
    if (
      (props.projectId === undefined || props.projectId === '') &&
      (props.profileId === undefined || props.profileId === '')
    ) {
      return Result.fail<Experiment>(
        'Experiment must belong to either a project or a research profile.',
      );
    }

    return Result.ok<Experiment>(
      new Experiment(
        {
          ...props,
          status: props.status ?? 'PLANNED',
        },
        id,
      ),
    );
  }
}
