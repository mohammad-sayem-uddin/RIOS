/**
 * Authenticate User Command & Handler
 *
 * CQRS Command for authenticating credentials and returning tokens.
 * Architecture Reference: Volume I – Identity / Chapter 5 §45
 */

import { Command, CommandHandler, Result } from '@rios/shared';

import { AuthenticationResponseDto } from '../dto/identity-application-dtos.js';
import { AuthenticationApplicationService } from '../services/identity-application-services.js';

export class AuthenticateUserCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly email: string;
  public readonly passwordStr: string;
  public readonly ipAddress?: string;
  public readonly userAgent?: string;

  constructor(params: {
    email: string;
    passwordStr: string;
    ipAddress?: string;
    userAgent?: string;
    commandId?: string;
    timestamp?: Date;
  }) {
    this.commandId =
      params.commandId !== undefined && params.commandId !== ''
        ? params.commandId
        : crypto.randomUUID();
    this.timestamp = params.timestamp ?? new Date();
    this.email = params.email;
    this.passwordStr = params.passwordStr;
    this.ipAddress = params.ipAddress;
    this.userAgent = params.userAgent;
  }
}

export class AuthenticateUserHandler implements CommandHandler<
  AuthenticateUserCommand,
  AuthenticationResponseDto
> {
  constructor(private readonly authService: AuthenticationApplicationService) {}

  public async handle(
    command: AuthenticateUserCommand,
  ): Promise<Result<AuthenticationResponseDto>> {
    if (command.email.trim() === '' || command.passwordStr.trim() === '') {
      return Result.fail('Email and password are required');
    }

    return this.authService.authenticate(
      command.email,
      command.passwordStr,
      command.ipAddress,
      command.userAgent,
    );
  }
}
