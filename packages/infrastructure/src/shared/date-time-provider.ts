/**
 * Purpose:
 * Defines the date/time provider contract for Infrastructure.
 *
 * Architecture reference:
 * Infrastructure Layer — Shared Cross-Cutting Concerns.
 *
 * The DateTimeProvider:
 * - Abstracts system clock access.
 * - Enables deterministic testing by allowing time injection.
 * - Supports UTC consistency across the system.
 *
 * Why abstract time?
 * - Domain and Application code should not depend on `new Date()`.
 * - Tests need deterministic time control.
 * - Different environments may use different time sources.
 *
 * Dependency rule:
 * Infrastructure owns clock abstraction. No external dependencies.
 */

/**
 * DateTimeProvider — abstracts system time access.
 *
 * Usage:
 * ```
 * const now = dateTimeProvider.now();
 * const isoString = dateTimeProvider.nowISO();
 * ```
 */
export interface DateTimeProvider {
  /**
   * Get the current Date instance.
   */
  now(): Date;

  /**
   * Get the current time as an ISO 8601 string.
   */
  nowISO(): string;
}
