/**
 * Publisher Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import type { URL } from '../value-objects/publication-value-objects.js';

export interface PublisherProps {
  name: string;
  location?: string;
  websiteUrl?: URL;
}

export class Publisher extends Entity<PublisherProps> {
  private constructor(props: PublisherProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get location(): string | undefined {
    return this.props.location;
  }

  public get websiteUrl(): URL | undefined {
    return this.props.websiteUrl;
  }

  public static create(
    props: {
      name: string;
      location?: string;
      websiteUrl?: URL;
    },
    id?: UniqueId,
  ): Result<Publisher> {
    const trimmed = props.name?.trim();
    if (!trimmed) {
      return Result.fail<Publisher>('Publisher name cannot be empty.');
    }
    return Result.ok<Publisher>(
      new Publisher(
        {
          name: trimmed,
          location: props.location?.trim(),
          websiteUrl: props.websiteUrl,
        },
        id,
      ),
    );
  }
}
