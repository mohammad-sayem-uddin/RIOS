/**
 * ModelArtifact Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { Framework, SemanticVersion } from '../value-objects/research-assets-value-objects.js';

export interface ModelArtifactProps {
  name: string;
  architecture?: string;
  framework?: Framework;
  version: SemanticVersion;
  weightsUrl?: string;
  parametersCount?: string;
  license?: string;
}

export class ModelArtifact extends Entity<ModelArtifactProps> {
  private constructor(props: ModelArtifactProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }
  public get architecture(): string | undefined {
    return this.props.architecture;
  }
  public get framework(): Framework | undefined {
    return this.props.framework;
  }
  public get version(): SemanticVersion {
    return this.props.version;
  }
  public get weightsUrl(): string | undefined {
    return this.props.weightsUrl;
  }
  public get parametersCount(): string | undefined {
    return this.props.parametersCount;
  }
  public get license(): string | undefined {
    return this.props.license;
  }

  public static create(
    props: {
      name: string;
      architecture?: string;
      framework?: Framework;
      version: SemanticVersion;
      weightsUrl?: string;
      parametersCount?: string;
      license?: string;
    },
    id?: UniqueId,
  ): Result<ModelArtifact> {
    if (!props.name || !props.name.trim()) {
      return Result.fail<ModelArtifact>('Model name is required.');
    }

    return Result.ok<ModelArtifact>(new ModelArtifact(props, id));
  }
}
