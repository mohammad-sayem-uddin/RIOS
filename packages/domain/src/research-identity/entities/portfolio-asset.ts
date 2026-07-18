/**
 * Portfolio Asset Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { PortfolioAssetId } from '../value-objects/research-identity-value-objects.js';

export const AssetType = {
  CV: 'CV',
  RESUME: 'RESUME',
  PROFILE_PHOTO: 'PROFILE_PHOTO',
  COVER_IMAGE: 'COVER_IMAGE',
  RESEARCH_STATEMENT_DOC: 'RESEARCH_STATEMENT_DOC',
  SUPPORTING_DOCUMENT: 'SUPPORTING_DOCUMENT',
  OTHER: 'OTHER',
} as const;

export type AssetTypeType = (typeof AssetType)[keyof typeof AssetType];

export interface PortfolioAssetProps {
  title: string;
  assetType: AssetTypeType;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: Date;
}

export class PortfolioAsset extends Entity<PortfolioAssetProps> {
  private constructor(props: PortfolioAssetProps, id: UniqueId) {
    super(props, id);
  }

  public get assetId(): PortfolioAssetId {
    return PortfolioAssetId.from(this._id.value);
  }

  public get title(): string {
    return this.props.title;
  }

  public get assetType(): AssetTypeType {
    return this.props.assetType;
  }

  public get fileUrl(): string {
    return this.props.fileUrl;
  }

  public get mimeType(): string {
    return this.props.mimeType;
  }

  public get fileSizeBytes(): number {
    return this.props.fileSizeBytes;
  }

  public get uploadedAt(): Date {
    return this.props.uploadedAt;
  }

  public static create(
    props: Omit<PortfolioAssetProps, 'uploadedAt'>,
    id?: UniqueId,
  ): Result<PortfolioAsset> {
    if (!props.title || !props.title.trim()) {
      return Result.fail('Asset title is required');
    }
    if (!props.fileUrl || !props.fileUrl.trim()) {
      return Result.fail('File URL is required');
    }
    if (props.fileSizeBytes <= 0) {
      return Result.fail('File size must be positive');
    }
    return Result.ok(
      new PortfolioAsset(
        {
          ...props,
          uploadedAt: new Date(),
        },
        id ?? PortfolioAssetId.create(),
      ),
    );
  }
}
