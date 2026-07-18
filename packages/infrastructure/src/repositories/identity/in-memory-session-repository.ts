/**
 * In-Memory Session Repository
 *
 * Implements ISessionRepository for persistence & revocation of sessions.
 * Architecture Reference: Volume I – Identity / Chapter 6 §64 & Chapter 8
 */

import { ISessionRepository, Session, SessionId, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

export class InMemorySessionRepository implements ISessionRepository {
  private readonly sessions: Map<string, Session> = new Map();

  public findById(id: SessionId): Promise<Result<Session | null>> {
    const session = this.sessions.get(id.value);
    return Promise.resolve(Result.ok(session ?? null));
  }

  public findByUserId(userId: UserId): Promise<Result<Session[]>> {
    const userSessions: Session[] = [];
    for (const session of this.sessions.values()) {
      if (session.userId.value === userId.value) {
        userSessions.push(session);
      }
    }
    return Promise.resolve(Result.ok(userSessions));
  }

  public save(session: Session): Promise<Result<void>> {
    this.sessions.set(session.sessionId.value, session);
    return Promise.resolve(Result.ok(undefined));
  }

  public revoke(id: SessionId): Promise<Result<void>> {
    const session = this.sessions.get(id.value);
    if (session !== undefined) {
      session.revoke();
      this.sessions.set(id.value, session);
    }
    return Promise.resolve(Result.ok(undefined));
  }

  public revokeAllForUser(userId: UserId): Promise<Result<void>> {
    for (const session of this.sessions.values()) {
      if (session.userId.value === userId.value) {
        session.revoke();
      }
    }
    return Promise.resolve(Result.ok(undefined));
  }

  public deleteExpired(): Promise<Result<number>> {
    const now = new Date();
    let count = 0;
    for (const [id, session] of this.sessions.entries()) {
      if (session.isExpired(now)) {
        this.sessions.delete(id);
        count++;
      }
    }
    return Promise.resolve(Result.ok(count));
  }
}
