/**
 * Identity Application Package - Index
 */

// DTOs
export type {
  UserDto,
  SessionDto,
  TokenResultDto,
  AuthenticationResponseDto,
  RefreshTokenResponseDto,
} from './dto/identity-application-dtos.js';

// Mappers
export { IdentityDtoMapper } from './mappers/identity-dto-mapper.js';

// Application Services
export {
  AuthenticationApplicationService,
  AuthorizationApplicationService,
  SessionApplicationService,
} from './services/identity-application-services.js';

// Commands & Handlers
export {
  AuthenticateUserCommand,
  AuthenticateUserHandler,
} from './commands/authenticate-user.command.js';
export { LogoutUserCommand, LogoutUserHandler } from './commands/logout-user.command.js';
export {
  RefreshAccessTokenCommand,
  RefreshAccessTokenHandler,
} from './commands/refresh-access-token.command.js';
export {
  ChangePasswordCommand,
  ChangePasswordHandler,
} from './commands/change-password.command.js';
export { CreateUserCommand, CreateUserHandler } from './commands/create-user.command.js';

// Queries & Handlers
export { GetCurrentUserQuery, GetCurrentUserHandler } from './queries/get-current-user.query.js';
export {
  ValidateAccessTokenQuery,
  ValidateAccessTokenHandler,
} from './queries/validate-access-token.query.js';
