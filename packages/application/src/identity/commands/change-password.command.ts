/**
 * Change Password Command & Handler
 *
 * CQRS Command for updating account password.
 * Architecture Reference: Volume I – Identity / Chapter 5 §45
 */

import { IPasswordHasher, ISessionRepository, IUserRepository, UserId } from '@rios/domain';
import { Command, CommandHandler, Result } from '@rios/shared';

export class ChangePasswordCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly userId: string;
  public readonly currentPasswordStr: string;
  public readonly newPasswordStr: string;

  constructor(params: {
    userId: string;
    currentPasswordStr: string;
    newPasswordStr: string;
    commandId?: string;
    timestamp?: Date;
  }) {
    this.commandId =
      params.commandId !== undefined && params.commandId !== ''
        ? params.commandId
        : crypto.randomUUID();
    this.timestamp = params.timestamp ?? new Date();
    this.userId = params.userId;
    this.currentPasswordStr = params.currentPasswordStr;
    this.newPasswordStr = params.newPasswordStr;
  }
}

export class ChangePasswordHandler implements CommandHandler<ChangePasswordCommand, void> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async handle(command: ChangePasswordCommand): Promise<Result<void>> {
    if (
      command.userId.trim() === '' ||
      command.currentPasswordStr.trim() === '' ||
      command.newPasswordStr.trim() === ''
    ) {
      return Result.fail('UserId, current password, and new password are required');
    }

    if (command.newPasswordStr.length < 8) {
      return Result.fail('New password must be at least 8 characters long');
    }

    const userRes = await this.userRepository.findById(UserId.from(command.userId));
    if (userRes.isFailure || userRes.value === null) {
      return Result.fail('User not found');
    }

    const user = userRes.value;
    const verifyRes = await this.passwordHasher.verify(
      command.currentPasswordStr,
      user.credential.passwordHash,
    );
    if (verifyRes.isFailure || !verifyRes.value) {
      return Result.fail('Current password verification failed');
    }

    const hashRes = await this.passwordHasher.hash(command.newPasswordStr);
    if (hashRes.isFailure) {
      return Result.fail(`Failed to hash new password: ${hashRes.error}`);
    }

    const changeRes = user.changePassword(hashRes.value);
    if (changeRes.isFailure) {
      return changeRes;
    }

    await this.userRepository.save(user);
    await this.sessionRepository.revokeAllForUser(user.userId);

    return Result.ok(undefined);
  }
}
