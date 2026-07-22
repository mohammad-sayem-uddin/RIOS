'use client';

/**
 * RIOS — AI Research Assistant (Recommendations)
 *
 * Backed by GET /api/v1/ai/recommendations (✅ verified). Surfaces AI-generated
 * research recommendations with graceful empty/error states. The generation
 * trigger (POST /ai/recommendations) is wired as an optional refresh action.
 */

import { Sparkles, RefreshCw, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRecommendations } from '@/hooks/use-domain-queries';
import { mapAuthError } from '@/lib/auth-errors';
import { aiService, type Recommendation } from '@/lib/services';

export default function RecommendationsPage() {
  const query = useRecommendations();
  const [generating, setGenerating] = useState(false);

  const items = query.items as Recommendation[];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await aiService.generateRecommendations();
      await query.refetch();
      toast.success('Recommendations refreshed');
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Research Assistant"
        description="Personalized recommendations to advance your research."
      >
        <Button
          variant="outline"
          disabled={generating || query.isFetching}
          onClick={() => void handleGenerate()}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>

      <DataState
        isLoading={query.isLoading}
        isError={query.isError}
        isEmpty={items.length === 0}
        onRetry={() => void query.refetch()}
        empty={
          <div className="rounded-lg border border-dashed py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-medium">No recommendations yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              As you add publications and projects, the assistant will suggest relevant work,
              collaborators, and opportunities.
            </p>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((rec) => (
            <Card key={rec.id} interactive>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {rec.type && <Badge variant="secondary">{rec.type}</Badge>}
                  </div>
                  {typeof rec.score === 'number' && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(rec.score * 100)}% match
                    </span>
                  )}
                </div>
                <h3 className="font-medium">{rec.title ?? 'Recommendation'}</h3>
                {rec.description && (
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DataState>

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowUpRight className="h-3 w-3" />
        Explore the{' '}
        <a href="/ai/knowledge-graph" className="text-primary hover:underline">
          knowledge graph
        </a>{' '}
        to see how your research connects.
      </p>
    </div>
  );
}
