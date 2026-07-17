/**
 * Identity Domain Policies.
 *
 * Policies evaluate cross-entity and aggregate-wide business rules.
 * Policies are pure, deterministic, side-effect free, and depend
 * only on the domain model.
 *
 * Architecture reference:
 * Volume I Chapter 2; Volume I Chapter 9; ADR-101, ADR-102.
 */

export { IdentityCompletenessPolicy } from './identity-completeness-policy.js';
export { ResearchAgendaConsistencyPolicy } from './research-agenda-consistency-policy.js';
export { ResearchAreaEligibilityPolicy } from './research-area-eligibility-policy.js';
export { ResearchGoalCompletionPolicy } from './research-goal-completion-policy.js';
export { ContributionAcceptancePolicy } from './contribution-acceptance-policy.js';
export { ResearchEvolutionPolicy } from './research-evolution-policy.js';
export { ResearchVisionConsistencyPolicy } from './research-vision-consistency-policy.js';
