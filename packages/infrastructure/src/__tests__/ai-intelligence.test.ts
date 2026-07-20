import { describe, expect, it } from 'vitest';

import {
  DefaultAIProviderAdapter,
  DefaultBackgroundJobProcessor,
  DefaultEmbeddingService,
  DefaultKnowledgeGraphAdapter,
  DefaultVectorStoreAdapter,
} from '../ai-intelligence/adapters/index.js';

describe('AI Research Intelligence Infrastructure Layer (Sprint 13)', () => {
  it('should generate text from AI Provider Adapter', async () => {
    const adapter = new DefaultAIProviderAdapter({ providerName: 'openai' });
    const text = await adapter.generateText('Analyze research similarity');
    expect(text).toContain('openai');
  });

  it('should generate embeddings from Embedding Service', async () => {
    const service = new DefaultEmbeddingService();
    const vector = await service.generateEmbedding(
      'Sample research abstract',
      'text-embedding-3-large',
    );
    expect(vector.length).toBe(1536);
  });

  it('should perform vector search in Vector Store Adapter', async () => {
    const store = new DefaultVectorStoreAdapter();
    const vec1: number[] = new Array<number>(1536).fill(0.1);
    const vec2: number[] = new Array<number>(1536).fill(0.9);

    await store.upsertVector('e1', vec1, { entityId: 'e1', entityType: 'PUBLICATION' });
    await store.upsertVector('e2', vec2, { entityId: 'e2', entityType: 'PUBLICATION' });

    const results = await store.searchSimilar(vec1, 2);
    expect(results.length).toBe(2);
    expect(results[0]?.entityId).toBe('e1');
  });

  it('should traverse Knowledge Graph Adapter and enqueue jobs', async () => {
    const kgAdapter = new DefaultKnowledgeGraphAdapter();
    const traversal = await kgAdapter.traverseGraph('node-1', 2);
    expect(traversal.nodes.length).toBeGreaterThan(0);

    const jobProcessor = new DefaultBackgroundJobProcessor();
    const job = await jobProcessor.enqueueJob('rebuild-graph', { profileId: 'prof-1' });
    expect(job.status).toContain('ENQUEUED');
  });
});
