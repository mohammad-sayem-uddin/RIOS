/**
 * Repository Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  ProgrammingLanguage,
  RepositoryURL,
} from '../value-objects/research-assets-value-objects.js';

export interface RepositoryProps {
  name: string;
  url: RepositoryURL;
  provider: string; // e.g. GITHUB, GITLAB, BITBUCKET
  isPrivate: boolean;
  defaultBranch: string;
  primaryLanguage?: ProgrammingLanguage;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  description?: string;
}

export class Repository extends Entity<RepositoryProps> {
  private constructor(props: RepositoryProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }
  public get url(): RepositoryURL {
    return this.props.url;
  }
  public get provider(): string {
    return this.props.provider;
  }
  public get isPrivate(): boolean {
    return this.props.isPrivate;
  }
  public get defaultBranch(): string {
    return this.props.defaultBranch;
  }
  public get primaryLanguage(): ProgrammingLanguage | undefined {
    return this.props.primaryLanguage;
  }
  public get starsCount(): number {
    return this.props.starsCount;
  }
  public get forksCount(): number {
    return this.props.forksCount;
  }
  public get openIssuesCount(): number {
    return this.props.openIssuesCount;
  }
  public get description(): string | undefined {
    return this.props.description;
  }

  public static create(
    props: {
      name: string;
      url: RepositoryURL;
      provider?: string;
      isPrivate?: boolean;
      defaultBranch?: string;
      primaryLanguage?: ProgrammingLanguage;
      starsCount?: number;
      forksCount?: number;
      openIssuesCount?: number;
      description?: string;
    },
    id?: UniqueId,
  ): Result<Repository> {
    if (!props.name || !props.name.trim()) {
      return Result.fail<Repository>('Repository name is required.');
    }

    return Result.ok<Repository>(
      new Repository(
        {
          ...props,
          provider: props.provider ?? 'GITHUB',
          isPrivate: props.isPrivate ?? false,
          defaultBranch: props.defaultBranch ?? 'main',
          starsCount: props.starsCount ?? 0,
          forksCount: props.forksCount ?? 0,
          openIssuesCount: props.openIssuesCount ?? 0,
        },
        id,
      ),
    );
  }
}
