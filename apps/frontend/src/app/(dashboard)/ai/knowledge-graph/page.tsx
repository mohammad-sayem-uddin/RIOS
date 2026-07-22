'use client';

/**
 * RIOS — Knowledge Graph
 *
 * Backed by GET /api/v1/knowledge-graph (✅ verified). Renders the returned
 * nodes/edges as a readable, accessible list grouped by node type (a
 * dependency-free representation; a canvas/graph renderer can layer on later
 * without changing the data contract).
 */

import { GitFork, Circle } from 'lucide-react';

import { ListLoading, ErrorState, EmptyState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKnowledgeGraph } from '@/hooks/use-domain-queries';

export default function KnowledgeGraphPage() {
  const query = useKnowledgeGraph();

  if (query.isLoading)
    return (
      <div className="space-y-6">
        <PageHeader title="Knowledge Graph" />
        <ListLoading rows={5} />
      </div>
    );
  if (query.isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Knowledge Graph" />
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    );
  }

  const nodes = query.data?.nodes ?? [];
  const edges = query.data?.edges ?? [];

  // Group nodes by type for a readable overview.
  const byType = nodes.reduce<Record<string, typeof nodes>>((acc, node) => {
    const type = node.type ?? 'Other';
    (acc[type] ??= []).push(node);
    return acc;
  }, {});

  const labelFor = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Graph"
        description="How your research entities — topics, works, and collaborators — connect."
      />

      {nodes.length === 0 ? (
        <EmptyState
          icon={<GitFork className="h-6 w-6" />}
          title="Your knowledge graph is empty"
          description="Add publications, projects, and interests to build a connected map of your research."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Entities ({nodes.length})</h2>
            {Object.entries(byType).map(([type, group]) => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {group.map((node) => (
                      <Badge key={node.id} variant="outline" className="gap-1">
                        <Circle className="h-2 w-2 fill-primary text-primary" />
                        {node.label ?? node.id}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Connections ({edges.length})
            </h2>
            <Card>
              <CardContent className="p-4">
                {edges.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No connections yet.</p>
                ) : (
                  <ul className="flex flex-col gap-2 text-sm">
                    {edges.map((edge, i) => (
                      <li
                        key={`${edge.source}-${edge.target}-${i}`}
                        className="flex items-center gap-2"
                      >
                        <span className="font-medium">{labelFor(edge.source)}</span>
                        <span className="text-muted-foreground">
                          {edge.label ? `— ${edge.label} →` : '→'}
                        </span>
                        <span className="font-medium">{labelFor(edge.target)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
