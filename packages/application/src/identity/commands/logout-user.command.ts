/**
 * Logout User Command & Handler
 *
 * CQRS Command for logging out a session.
 * Architecture Reference: Volume I – Identity / Chapter 5 §45
 */

import { Command, CommandHandler, Result } from '@rios/shared';

import { AuthenticationApplicationService } from '../services/identity-application-services.js';

export class LogoutUserCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly sessionId: string;

  constructor(params: { sessionId: string; commandId?: string; timestamp?: Date }) {
    this.commandId =
      params.commandId !== undefined && params.commandId !== ''
        ? params.commandId
        : crypto.randomUUID();
    this.timestamp = params.timestamp ?? new Date();
    this.sessionId = params.sessionId;
  }
}

export class LogoutUserHandler implements CommandHandler<LogoutUserCommand, void> {
  constructor(private readonly authService: AuthenticationApplicationService) {}

  public async handle(command: LogoutUserCommand): Promise<Result<void>> {
    if (command.sessionId.trim() === '') {
      return Result.fail('Session ID is required');
    }

    return this.authService.logout(command.sessionId);
  }
}
