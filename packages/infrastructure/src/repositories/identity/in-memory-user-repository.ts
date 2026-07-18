/**
 * In-Memory User Repository
 *
 * Implements IUserRepository contract for identity persistence.
 * Architecture Reference: Volume I – Identity / Chapter 6 §65 & Chapter 8
 */

import { Email, IUserRepository, User, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: Map<string, User> = new Map();

  public findById(id: UserId): Promise<Result<User | null>> {
    const user = this.users.get(id.value);
    return Promise.resolve(Result.ok(user ?? null));
  }

  public findByEmail(email: Email): Promise<Result<User | null>> {
    const targetEmail = email.value.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.value.toLowerCase() === targetEmail) {
        return Promise.resolve(Result.ok(user));
      }
    }
    return Promise.resolve(Result.ok(null));
  }

  public save(user: User): Promise<Result<void>> {
    this.users.set(user.userId.value, user);
    return Promise.resolve(Result.ok(undefined));
  }

  public async exists(email: Email): Promise<Result<boolean>> {
    const res = await this.findByEmail(email);
    if (res.isFailure) return Result.fail(res.error);
    return Result.ok(res.value !== null);
  }

  public delete(id: UserId): Promise<Result<void>> {
    this.users.delete(id.value);
    return Promise.resolve(Result.ok(undefined));
  }
}
