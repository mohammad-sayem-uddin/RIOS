/**
 * In-Memory Research Profile Repository for Testing
 */

import { IResearchProfileRepository, ResearchProfile, ResearchProfileId } from '@rios/domain';
import { UniqueId } from '@rios/shared';

export class InMemoryResearchProfileRepository implements IResearchProfileRepository {
  private readonly profiles: Map<string, ResearchProfile> = new Map();

  public findById(id: ResearchProfileId): Promise<ResearchProfile | null> {
    const profile = this.profiles.get(id.value);
    return Promise.resolve(profile !== undefined ? profile : null);
  }

  public findByUserId(userId: UniqueId): Promise<ResearchProfile | null> {
    for (const profile of this.profiles.values()) {
      if (profile.userId.equals(userId)) {
        return Promise.resolve(profile);
      }
    }
    return Promise.resolve(null);
  }

  public save(profile: ResearchProfile): Promise<void> {
    this.profiles.set(profile.id.value, profile);
    return Promise.resolve();
  }

  public delete(id: ResearchProfileId): Promise<void> {
    this.profiles.delete(id.value);
    return Promise.resolve();
  }

  public clear(): void {
    this.profiles.clear();
  }
}
