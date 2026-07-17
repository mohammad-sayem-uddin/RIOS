/**
 * CommandHandler — processes a command and returns a Result.
 * CQRS building block.
 */

import { Result } from '../errors/result.js';

import { Command } from './command.js';

export interface CommandHandler<TCommand extends Command, TResult> {
  handle(command: TCommand): Promise<Result<TResult>>;
}
