/**
 * Event Metadata — carried by every domain event for tracing and correlation.
 */

export interface EventMetadata {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly userId?: string;
}
