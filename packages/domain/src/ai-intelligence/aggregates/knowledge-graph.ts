/**
 * @rios/domain — KnowledgeGraph Aggregate Root (Sprint 13)
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { ResearchEdge, ResearchNode } from '../entities/index.js';
import { KnowledgeGraphUpdatedEvent } from '../events/index.js';
import { NodeId } from '../value-objects/index.js';

export interface KnowledgeGraphProps {
  profileId: string;
  nodes: Map<string, ResearchNode>;
  edges: Map<string, ResearchEdge>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class KnowledgeGraph extends AggregateRoot<KnowledgeGraphProps> {
  private constructor(props: KnowledgeGraphProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get nodes(): ResearchNode[] {
    return Array.from(this.props.nodes.values());
  }

  public get edges(): ResearchEdge[] {
    return Array.from(this.props.edges.values());
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  public static create(props: { profileId: string }, id?: UniqueId): Result<KnowledgeGraph> {
    if (!props.profileId || !props.profileId.trim()) {
      return Result.fail<KnowledgeGraph>('Profile ID is required to create a KnowledgeGraph.');
    }
    const graph = new KnowledgeGraph(
      {
        profileId: props.profileId,
        nodes: new Map(),
        edges: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
    return Result.ok<KnowledgeGraph>(graph);
  }

  public static reconstitute(
    props: {
      profileId: string;
      nodes: ResearchNode[];
      edges: ResearchEdge[];
      createdAt: Date;
      updatedAt: Date;
    },
    id: UniqueId,
  ): Result<KnowledgeGraph> {
    const nodeMap = new Map<string, ResearchNode>();
    for (const node of props.nodes) {
      nodeMap.set(node.nodeId.value, node);
    }
    const edgeMap = new Map<string, ResearchEdge>();
    for (const edge of props.edges) {
      edgeMap.set(edge.edgeId.value, edge);
    }
    return Result.ok<KnowledgeGraph>(
      new KnowledgeGraph(
        {
          profileId: props.profileId,
          nodes: nodeMap,
          edges: edgeMap,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        },
        id,
      ),
    );
  }

  public addNode(node: ResearchNode): Result<void> {
    // Unique research nodes check
    const existing = Array.from(this.props.nodes.values()).find(
      (n) => n.entityId === node.entityId && n.nodeType === node.nodeType,
    );
    if (existing) {
      return Result.fail<void>(
        `Node for entity ${node.entityId} (${node.nodeType}) already exists in graph.`,
      );
    }
    this.props.nodes.set(node.nodeId.value, node);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new KnowledgeGraphUpdatedEvent(
        this.id.value,
        this.props.profileId,
        this.props.nodes.size,
        this.props.edges.size,
      ),
    );
    return Result.ok<void>(undefined);
  }

  public addEdge(edge: ResearchEdge): Result<void> {
    // Verify source & target nodes exist
    if (
      !this.props.nodes.has(edge.sourceNodeId.value) ||
      !this.props.nodes.has(edge.targetNodeId.value)
    ) {
      return Result.fail<void>(
        'Both source and target nodes must exist in the KnowledgeGraph before adding an edge.',
      );
    }
    // Duplicate edge check
    const duplicate = Array.from(this.props.edges.values()).find(
      (e) =>
        e.sourceNodeId.value === edge.sourceNodeId.value &&
        e.targetNodeId.value === edge.targetNodeId.value &&
        e.relationshipType === edge.relationshipType,
    );
    if (duplicate) {
      return Result.fail<void>('Duplicate graph edge is forbidden.');
    }
    this.props.edges.set(edge.edgeId.value, edge);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new KnowledgeGraphUpdatedEvent(
        this.id.value,
        this.props.profileId,
        this.props.nodes.size,
        this.props.edges.size,
      ),
    );
    return Result.ok<void>(undefined);
  }

  public findNodeByEntity(entityId: string): ResearchNode | undefined {
    return Array.from(this.props.nodes.values()).find((n) => n.entityId === entityId);
  }

  public getNodeById(nodeId: NodeId): ResearchNode | undefined {
    return this.props.nodes.get(nodeId.value);
  }
}
