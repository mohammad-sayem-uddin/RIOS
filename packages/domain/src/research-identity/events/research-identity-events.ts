/**
 * Research Identity Domain Events
 */

import { DomainEvent } from '@rios/shared';

export class ResearchProfileCreated extends DomainEvent {
  public readonly eventType = 'ResearchProfileCreated';

  constructor(
    public readonly profileId: string,
    public readonly userId: string,
    public readonly title: string,
  ) {
    super(profileId);
  }
}

export class BiographyUpdated extends DomainEvent {
  public readonly eventType = 'BiographyUpdated';

  constructor(
    public readonly profileId: string,
    public readonly biography: string,
  ) {
    super(profileId);
  }
}

export class AcademicSummaryUpdated extends DomainEvent {
  public readonly eventType = 'AcademicSummaryUpdated';

  constructor(
    public readonly profileId: string,
    public readonly summary: string,
  ) {
    super(profileId);
  }
}

export class ResearchStatementUpdated extends DomainEvent {
  public readonly eventType = 'ResearchStatementUpdated';

  constructor(
    public readonly profileId: string,
    public readonly statement: string,
  ) {
    super(profileId);
  }
}

export class MissionUpdated extends DomainEvent {
  public readonly eventType = 'MissionUpdated';

  constructor(
    public readonly profileId: string,
    public readonly mission: string,
  ) {
    super(profileId);
  }
}

export class VisionUpdated extends DomainEvent {
  public readonly eventType = 'VisionUpdated';

  constructor(
    public readonly profileId: string,
    public readonly vision: string,
  ) {
    super(profileId);
  }
}

export class EducationAdded extends DomainEvent {
  public readonly eventType = 'EducationAdded';

  constructor(
    public readonly profileId: string,
    public readonly educationId: string,
    public readonly degree: string,
    public readonly institution: string,
  ) {
    super(profileId);
  }
}

export class EducationUpdated extends DomainEvent {
  public readonly eventType = 'EducationUpdated';

  constructor(
    public readonly profileId: string,
    public readonly educationId: string,
  ) {
    super(profileId);
  }
}

export class EducationRemoved extends DomainEvent {
  public readonly eventType = 'EducationRemoved';

  constructor(
    public readonly profileId: string,
    public readonly educationId: string,
  ) {
    super(profileId);
  }
}

export class ExperienceAdded extends DomainEvent {
  public readonly eventType = 'ExperienceAdded';

  constructor(
    public readonly profileId: string,
    public readonly experienceId: string,
    public readonly positionTitle: string,
    public readonly organization: string,
  ) {
    super(profileId);
  }
}

export class ExperienceUpdated extends DomainEvent {
  public readonly eventType = 'ExperienceUpdated';

  constructor(
    public readonly profileId: string,
    public readonly experienceId: string,
  ) {
    super(profileId);
  }
}

export class ExperienceRemoved extends DomainEvent {
  public readonly eventType = 'ExperienceRemoved';

  constructor(
    public readonly profileId: string,
    public readonly experienceId: string,
  ) {
    super(profileId);
  }
}

export class ResearchInterestAdded extends DomainEvent {
  public readonly eventType = 'ResearchInterestAdded';

  constructor(
    public readonly profileId: string,
    public readonly interestId: string,
    public readonly name: string,
  ) {
    super(profileId);
  }
}

export class ResearchInterestRemoved extends DomainEvent {
  public readonly eventType = 'ResearchInterestRemoved';

  constructor(
    public readonly profileId: string,
    public readonly interestId: string,
  ) {
    super(profileId);
  }
}

export class SkillAdded extends DomainEvent {
  public readonly eventType = 'SkillAdded';

  constructor(
    public readonly profileId: string,
    public readonly skillId: string,
    public readonly name: string,
  ) {
    super(profileId);
  }
}

export class SkillRemoved extends DomainEvent {
  public readonly eventType = 'SkillRemoved';

  constructor(
    public readonly profileId: string,
    public readonly skillId: string,
  ) {
    super(profileId);
  }
}

export class ExternalProfileAdded extends DomainEvent {
  public readonly eventType = 'ExternalProfileAdded';

  constructor(
    public readonly profileId: string,
    public readonly externalProfileId: string,
    public readonly provider: string,
    public readonly url: string,
  ) {
    super(profileId);
  }
}

export class ExternalProfileUpdated extends DomainEvent {
  public readonly eventType = 'ExternalProfileUpdated';

  constructor(
    public readonly profileId: string,
    public readonly externalProfileId: string,
  ) {
    super(profileId);
  }
}

export class ExternalProfileRemoved extends DomainEvent {
  public readonly eventType = 'ExternalProfileRemoved';

  constructor(
    public readonly profileId: string,
    public readonly externalProfileId: string,
  ) {
    super(profileId);
  }
}

export class PortfolioAssetUploaded extends DomainEvent {
  public readonly eventType = 'PortfolioAssetUploaded';

  constructor(
    public readonly profileId: string,
    public readonly assetId: string,
    public readonly title: string,
    public readonly fileUrl: string,
  ) {
    super(profileId);
  }
}

export class PortfolioAssetRemoved extends DomainEvent {
  public readonly eventType = 'PortfolioAssetRemoved';

  constructor(
    public readonly profileId: string,
    public readonly assetId: string,
  ) {
    super(profileId);
  }
}
