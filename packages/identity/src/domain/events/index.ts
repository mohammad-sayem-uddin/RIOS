/**
 * Identity Domain Events — barrel export.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — Identity Domain Events.
 */

export { IdentityEvent } from './identity-event.js';
export { ResearchAgendaCreated } from './research-agenda-created.js';
export type { ResearchAgendaCreatedPrimitives } from './research-agenda-created.js';
export { ResearchAgendaUpdated } from './research-agenda-updated.js';
export type { ResearchAgendaUpdatedPrimitives } from './research-agenda-updated.js';
export { ResearchAreaAdded } from './research-area-added.js';
export type { ResearchAreaAddedPrimitives } from './research-area-added.js';
export { ResearchAreaArchived } from './research-area-archived.js';
export type { ResearchAreaArchivedPrimitives } from './research-area-archived.js';
export { ResearchQuestionAdded } from './research-question-added.js';
export type { ResearchQuestionAddedPrimitives } from './research-question-added.js';
export { GoalAchieved } from './goal-achieved.js';
export type { GoalAchievedPrimitives } from './goal-achieved.js';
export { PhilosophyRevised } from './philosophy-revised.js';
export type { PhilosophyRevisedPrimitives } from './philosophy-revised.js';
export { EvolutionUpdated } from './evolution-updated.js';
export type { EvolutionUpdatedPrimitives } from './evolution-updated.js';
