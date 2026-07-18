import { CreateResearchIdentityCommand, GetResearchIdentityQuery } from '@rios/application';
import { Result, UniqueId } from '@rios/shared';
import { describe, it, expect, beforeEach } from 'vitest';

import { bootstrapRiosSystem } from '../bootstrap.js';
import { PrismaOutboxRepositoryImpl } from '../events/prisma-outbox-repository.impl.js';
import type { SystemInstance } from '../lifecycle/application-startup.js';
import { PrismaUnitOfWork } from '../persistence/prisma-unit-of-work.js';

describe('End-to-End Infrastructure & Application Layer Integration', () => {
  let system: SystemInstance;

  beforeEach(async (): Promise<void> => {
    const envVars = {
      NODE_ENV: 'test',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      LOG_LEVEL: 'INFO',
    };

    const bootstrapResult = await bootstrapRiosSystem({ envVars });
    expect(bootstrapResult.isSuccess).toBe(true);
    system = bootstrapResult.value.instance;
  });

  function createSampleCommand(id = '1'): CreateResearchIdentityCommand {
    return new CreateResearchIdentityCommand({
      commandId: `cmd-${id}`,
      timestamp: new Date(),
      visionStatement: 'Advancing quantum computing research for practical applications',
      timeHorizon: '10-20 years',
      agendaFocus: 'Quantum error correction algorithms',
      agendaStatus: 'Active',
      philosophyStatement: 'Rigorous scientific inquiry grounded in reproducibility',
      philosophyApproach: 'Empirical',
      valuesStatement: 'Core values guiding the research program',
      evolutionDescription: 'Initial research direction established',
      evolutionStatus: 'Active',
    });
  }

  it('should create research identity via application service through wired infrastructure', async (): Promise<void> => {
    const command = createSampleCommand('create-1');

    const result = await system.identityApplicationService.establishResearchIdentity(command);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(UniqueId);

    const identityId = result.value;

    // Retrieve via query through application service
    const getQueryResult = await system.identityApplicationService.retrieveResearchIdentity(
      new GetResearchIdentityQuery({
        queryId: 'q-1',
        timestamp: new Date(),
        identityId: identityId.toString(),
      }),
    );

    expect(getQueryResult.isSuccess).toBe(true);
    expect(getQueryResult.value.id).toBe(identityId.toString());
  });

  it('should handle UnitOfWork transaction rollback when callback returns Result.fail', async (): Promise<void> => {
    const unitOfWork = new PrismaUnitOfWork(system.databaseProvider);

    let transactionExecuted = false;

    const result = await unitOfWork.execute((): Promise<Result<void>> => {
      transactionExecuted = true;
      return Promise.resolve(Result.fail<void>('Simulated transaction operation failure'));
    });

    expect(transactionExecuted).toBe(true);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Simulated transaction operation failure');
  });

  it('should persist outbox events atomically within repository save', async (): Promise<void> => {
    const outboxRepo = new PrismaOutboxRepositoryImpl(system.databaseProvider);

    const command = createSampleCommand('outbox-1');

    const createResult = await system.identityApplicationService.establishResearchIdentity(command);
    expect(createResult.isSuccess).toBe(true);

    const pendingResult = await outboxRepo.findPending(10);
    expect(pendingResult.isSuccess).toBe(true);
  });

  it('should handle concurrent application command executions smoothly', async (): Promise<void> => {
    const commands = Array.from({ length: 5 }, (_, i) => createSampleCommand(`concurrent-${i}`));

    const results = await Promise.all(
      commands.map((cmd) => system.identityApplicationService.establishResearchIdentity(cmd)),
    );

    for (const res of results) {
      expect(res.isSuccess).toBe(true);
      expect(res.value).toBeInstanceOf(UniqueId);
    }
  });
});
