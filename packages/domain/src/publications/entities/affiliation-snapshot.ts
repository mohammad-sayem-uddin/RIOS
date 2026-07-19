/**
 * AffiliationSnapshot Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface AffiliationSnapshotProps {
  institution: string;
  department?: string;
  location?: string;
}

export class AffiliationSnapshot extends Entity<AffiliationSnapshotProps> {
  private constructor(props: AffiliationSnapshotProps, id?: UniqueId) {
    super(props, id);
  }

  public get institution(): string {
    return this.props.institution;
  }

  public get department(): string | undefined {
    return this.props.department;
  }

  public get location(): string | undefined {
    return this.props.location;
  }

  public static create(
    props: {
      institution: string;
      department?: string;
      location?: string;
    },
    id?: UniqueId,
  ): Result<AffiliationSnapshot> {
    const trimmed = props.institution?.trim();
    if (!trimmed) {
      return Result.fail<AffiliationSnapshot>('Affiliation institution cannot be empty.');
    }
    return Result.ok<AffiliationSnapshot>(
      new AffiliationSnapshot(
        {
          institution: trimmed,
          department: props.department?.trim(),
          location: props.location?.trim(),
        },
        id,
      ),
    );
  }
}
