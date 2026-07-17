/**
 * Command — represents an intent to change system state.
 * CQRS building block.
 */

export interface Command {
  readonly commandId: string;
  readonly timestamp: Date;
}
