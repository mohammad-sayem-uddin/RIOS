/**
 * Get Current User Query & Handler
 *
 * CQRS Query to retrieve current authenticated user details.
 * Architecture Reference: Volume I – Identity / Chapter 5 §44
 */

import { IUserRepository, UserId } from '@rios/domain';
import { Query, QueryHandler, Result } from '@rios/shared';

import { UserDto } from '../dto/identity-application-dtos.js';
import { IdentityDtoMapper } from '../mappers/identity-dto-mapper.js';

export class GetCurrentUserQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly userId: string;

  constructor(params: { userId: string; queryId?: string; timestamp?: Date }) {
    this.queryId =
      params.queryId !== undefined && params.queryId !== '' ? params.queryId : crypto.randomUUID();
    this.timestamp = params.timestamp ?? new Date();
    this.userId = params.userId;
  }
}

export class GetCurrentUserHandler implements QueryHandler<GetCurrentUserQuery, UserDto> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async handle(query: GetCurrentUserQuery): Promise<Result<UserDto>> {
    if (query.userId.trim() === '') {
      return Result.fail('UserId is required');
    }

    const userRes = await this.userRepository.findById(UserId.from(query.userId));
    if (userRes.isFailure || userRes.value === null) {
      return Result.fail('User not found');
    }

    const user = userRes.value;
    if (!user.canAuthenticate()) {
      return Result.fail('Account is inactive or disabled');
    }

    return Result.ok(IdentityDtoMapper.toUserDto(user));
  }
}
