/**
 * Domain Repositories — barrel export.
 *
 * Architecture reference:
 * Volume I Chapter 8 structural integrity.
 *
 * Exports the repository contract(s) for the Identity Domain.
 * Only the Aggregate Root has a repository.
 */

export type { ResearchIdentityRepository } from './research-identity-repository.js';
