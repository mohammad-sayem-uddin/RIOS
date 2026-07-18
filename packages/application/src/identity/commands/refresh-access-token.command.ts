/**
 * Refresh Access Token Command & Handler
 *
 * CQRS Command for rotating refresh token and issuing new access token.
 * Architecture Reference: Volume I – Identity / Chapter 5 §45
 */

import { Command, CommandHandler, Result } from '@rios/shared';

import { RefreshTokenResponseDto } from '../dto/identity-application-dtos.js';
import { AuthenticationApplicationService } from '../services/identity-application-services.js';

export class RefreshAccessTokenCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly refreshToken: string;

  constructor(params: { refreshToken: string; commandId?: string; timestamp?: Date }) {
    this.commandId =
      params.commandId !== undefined && params.commandId !== ''
        ? params.commandId
        : crypto.randomUUID();
    this.timestamp = params.timestamp ?? new Date();
    this.refreshToken = params.refreshToken;
  }
}

export class RefreshAccessTokenHandler implements CommandHandler<
  RefreshAccessTokenCommand,
  RefreshTokenResponseDto
> {
  constructor(private readonly authService: AuthenticationApplicationService) {}

  public async handle(
    command: RefreshAccessTokenCommand,
  ): Promise<Result<RefreshTokenResponseDto>> {
    if (command.refreshToken.trim() === '') {
      return Result.fail('Refresh token is required');
    }

    return this.authService.refreshTokens(command.refreshToken);
  }
}
