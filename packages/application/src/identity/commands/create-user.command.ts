/**
 * Create User Command & Handler
 *
 * CQRS Command for user provisioning/registration.
 * Architecture Reference: Volume I – Identity / Chapter 5 §44
 */

import {
  Credential,
  Email,
  IPasswordHasher,
  IRoleRepository,
  IUserRepository,
  Role,
  User,
} from '@rios/domain';
import { Command, CommandHandler, Result } from '@rios/shared';

import { UserDto } from '../dto/identity-application-dtos.js';
import { IdentityDtoMapper } from '../mappers/identity-dto-mapper.js';

export class CreateUserCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly email: string;
  public readonly passwordStr: string;
  public readonly displayName?: string;
  public readonly roleNames?: string[];

  constructor(params: {
    email: string;
    passwordStr: string;
    displayName?: string;
    roleNames?: string[];
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
    this.displayName = params.displayName;
    this.roleNames = params.roleNames;
  }
}

export class CreateUserHandler implements CommandHandler<CreateUserCommand, UserDto> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async handle(command: CreateUserCommand): Promise<Result<UserDto>> {
    const emailRes = Email.create(command.email);
    if (emailRes.isFailure) {
      return Result.fail(emailRes.error);
    }

    const email = emailRes.value;
    const existsRes = await this.userRepository.exists(email);
    if (existsRes.isFailure) {
      return Result.fail(existsRes.error);
    }
    if (existsRes.value) {
      return Result.fail(`User with email '${command.email}' already exists`);
    }

    if (!command.passwordStr || command.passwordStr.length < 8) {
      return Result.fail('Password must be at least 8 characters long');
    }

    const hashRes = await this.passwordHasher.hash(command.passwordStr);
    if (hashRes.isFailure) {
      return Result.fail(`Failed to hash password: ${hashRes.error}`);
    }

    const credentialRes = Credential.create({ passwordHash: hashRes.value });
    if (credentialRes.isFailure) {
      return Result.fail(`Failed to create credential: ${credentialRes.error}`);
    }

    const rolesToAssign: Role[] = [];
    const requestedRoles =
      command.roleNames && command.roleNames.length > 0 ? command.roleNames : ['researcher'];

    for (const roleName of requestedRoles) {
      const roleRes = await this.roleRepository.findByName(roleName);
      if (roleRes.isSuccess && roleRes.value) {
        rolesToAssign.push(roleRes.value);
      }
    }

    if (rolesToAssign.length === 0) {
      const defaultRoleRes = Role.create({
        name: 'researcher',
        description: 'Default Researcher Role',
      });
      if (defaultRoleRes.isSuccess) {
        rolesToAssign.push(defaultRoleRes.value);
      }
    }

    const userRes = User.create({
      email,
      credential: credentialRes.value,
      roles: rolesToAssign,
      displayName: command.displayName,
    });

    if (userRes.isFailure) {
      return Result.fail(`Failed to create user: ${userRes.error}`);
    }

    const user = userRes.value;
    const saveRes = await this.userRepository.save(user);
    if (saveRes.isFailure) {
      return Result.fail(`Failed to save user: ${saveRes.error}`);
    }

    return Result.ok(IdentityDtoMapper.toUserDto(user));
  }
}
