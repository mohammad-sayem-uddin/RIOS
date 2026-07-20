/**
 * @rios/infrastructure — AI Research Intelligence Service Adapters (Sprint 13)
 *
 * Provider-independent adapters for AI LLM providers (OpenAI, Gemini, Claude),
 * Vector stores (pgvector, FAISS, Milvus, Pinecone, Weaviate),
 * Knowledge graph backends (Neo4j, relational), and background processing.
 */

export interface AIProviderConfig {
  providerName: 'openai' | 'gemini' | 'claude' | 'openrouter' | 'mock';
  apiKey?: string;
  baseUrl?: string;
}

export interface IAIProviderAdapter {
  generateText(prompt: string, options?: Record<string, unknown>): Promise<string>;
  generateStructured<T>(prompt: string, schema: Record<string, unknown>): Promise<T>;
}

export class DefaultAIProviderAdapter implements IAIProviderAdapter {
  constructor(private readonly config: AIProviderConfig = { providerName: 'mock' }) {}

  public generateText(prompt: string): Promise<string> {
    return Promise.resolve(
      `[AI Response from ${this.config.providerName}]: Analysis for "${prompt.slice(0, 50)}..."`,
    );
  }

  public generateStructured<T>(prompt: string): Promise<T> {
    return Promise.resolve({
      summary: `Structured analysis for ${prompt.slice(0, 30)}`,
    } as unknown as T);
  }
}

export interface IEmbeddingService {
  generateEmbedding(text: string, modelName?: string): Promise<number[]>;
  batchGenerateEmbeddings(texts: string[], modelName?: string): Promise<number[][]>;
}

export class DefaultEmbeddingService implements IEmbeddingService {
  public generateEmbedding(text: string, _modelName = 'text-embedding-3-large'): Promise<number[]> {
    const dim = 1536;
    const vector: number[] = new Array<number>(dim);
    for (let i = 0; i < dim; i++) {
      const charCode = text.charCodeAt(i % text.length) || 1;
      vector[i] = (Math.sin(charCode + i) + 1) / 2;
    }
    return Promise.resolve(vector);
  }

  public async batchGenerateEmbeddings(texts: string[], modelName?: string): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.generateEmbedding(t, modelName)));
  }
}

export interface VectorSearchResult {
  entityId: string;
  entityType: string;
  score: number;
  vector: number[];
}

export interface IVectorStoreAdapter {
  upsertVector(id: string, vector: number[], metadata: Record<string, unknown>): Promise<void>;
  searchSimilar(
    queryVector: number[],
    limit: number,
    filter?: Record<string, unknown>,
  ): Promise<VectorSearchResult[]>;
  deleteVector(id: string): Promise<void>;
}

export class DefaultVectorStoreAdapter implements IVectorStoreAdapter {
  private readonly store = new Map<
    string,
    { vector: number[]; metadata: Record<string, unknown> }
  >();

  public upsertVector(
    id: string,
    vector: number[],
    metadata: Record<string, unknown>,
  ): Promise<void> {
    this.store.set(id, { vector, metadata });
    return Promise.resolve();
  }

  public searchSimilar(
    queryVector: number[],
    limit: number,
    filter?: Record<string, unknown>,
  ): Promise<VectorSearchResult[]> {
    const results: VectorSearchResult[] = [];
    for (const [id, item] of this.store.entries()) {
      if (
        filter !== undefined &&
        typeof filter['entityType'] === 'string' &&
        item.metadata['entityType'] !== filter['entityType']
      ) {
        continue;
      }
      const sim = this.cosineSimilarity(queryVector, item.vector);
      results.push({
        entityId: (item.metadata['entityId'] as string) ?? id,
        entityType: (item.metadata['entityType'] as string) ?? 'UNKNOWN',
        score: sim,
        vector: item.vector,
      });
    }
    results.sort((a, b) => b.score - a.score);
    return Promise.resolve(results.slice(0, limit));
  }

  public deleteVector(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      const va = a[i] ?? 0;
      const vb = b[i] ?? 0;
      dot += va * vb;
      normA += va * va;
      normB += vb * vb;
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}

export interface IKnowledgeGraphAdapter {
  traverseGraph(
    startNodeId: string,
    maxDepth: number,
  ): Promise<{ nodes: string[]; edges: string[] }>;
  computePageRank(): Promise<Map<string, number>>;
}

export class DefaultKnowledgeGraphAdapter implements IKnowledgeGraphAdapter {
  public traverseGraph(
    startNodeId: string,
    maxDepth: number,
  ): Promise<{ nodes: string[]; edges: string[] }> {
    return Promise.resolve({
      nodes: [startNodeId, `node-depth-1-${maxDepth}`],
      edges: ['edge-depth-1'],
    });
  }

  public computePageRank(): Promise<Map<string, number>> {
    const ranks = new Map<string, number>();
    ranks.set('root-node', 1.0);
    return Promise.resolve(ranks);
  }
}

export interface IBackgroundJobProcessor {
  enqueueJob<T>(jobName: string, payload: T): Promise<{ jobId: string; status: string }>;
}

export class DefaultBackgroundJobProcessor implements IBackgroundJobProcessor {
  public enqueueJob<T>(jobName: string, payload: T): Promise<{ jobId: string; status: string }> {
    return Promise.resolve({
      jobId: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: `ENQUEUED: ${jobName} with payload ${JSON.stringify(payload).slice(0, 30)}`,
    });
  }
}
