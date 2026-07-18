/**
 * Infrastructure events — public API.
 */
export type { EventPublisher } from './event-publisher.js';
export type { OutboxStore, OutboxEntry } from './outbox-store.js';
export { OutboxStatus, type OutboxStatusType, type OutboxRecord } from './outbox-model.js';
export { OutboxEventMapper } from './outbox-event-mapper.js';
export type { OutboxRepository } from './outbox-repository.js';
export { PrismaOutboxRepositoryImpl } from './prisma-outbox-repository.impl.js';
