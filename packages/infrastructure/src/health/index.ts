/**
 * Infrastructure health check — public API.
 */
export { InfrastructureHealthCheckService } from './health-check-service.js';
export type {
  OverallHealthStatus,
  ComponentHealthStatus,
  ApplicationHealthResult,
  HealthCheckOptions,
} from './health-check-service.js';
