/**
 * External Profile Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  ExternalProfileId,
  ExternalProfileUrl,
} from '../value-objects/research-identity-value-objects.js';

export const ProfileProvider = {
  ORCID: 'ORCID',
  GOOGLE_SCHOLAR: 'GOOGLE_SCHOLAR',
  SEMANTIC_SCHOLAR: 'SEMANTIC_SCHOLAR',
  RESEARCHGATE: 'RESEARCHGATE',
  GITHUB: 'GITHUB',
  LINKEDIN: 'LINKEDIN',
  PERSONAL_WEBSITE: 'PERSONAL_WEBSITE',
  OTHER: 'OTHER',
} as const;

export type ProfileProviderType = (typeof ProfileProvider)[keyof typeof ProfileProvider];

export interface ExternalProfileProps {
  provider: ProfileProviderType;
  profileUrl: ExternalProfileUrl;
  externalIdentifier?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ExternalProfile extends Entity<ExternalProfileProps> {
  private constructor(props: ExternalProfileProps, id: UniqueId) {
    super(props, id);
  }

  public get externalProfileId(): ExternalProfileId {
    return ExternalProfileId.from(this._id.value);
  }

  public get provider(): ProfileProviderType {
    return this.props.provider;
  }

  public get profileUrl(): ExternalProfileUrl {
    return this.props.profileUrl;
  }

  public get externalIdentifier(): string | undefined {
    return this.props.externalIdentifier;
  }

  public get isVerified(): boolean {
    return this.props.isVerified;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateUrl(url: ExternalProfileUrl): void {
    this.props.profileUrl = url;
    this.props.updatedAt = new Date();
  }

  public markVerified(): void {
    this.props.isVerified = true;
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<ExternalProfileProps, 'createdAt' | 'updatedAt' | 'isVerified'> & {
      isVerified?: boolean;
    },
    id?: UniqueId,
  ): Result<ExternalProfile> {
    const now = new Date();
    return Result.ok(
      new ExternalProfile(
        {
          ...props,
          isVerified: props.isVerified ?? false,
          createdAt: now,
          updatedAt: now,
        },
        id ?? ExternalProfileId.create(),
      ),
    );
  }
}
