/**
 * Benchmark Entity
 */

import { Entity, Result, UniqueId } from '@rios/shared';

export interface BenchmarkProps {
  name: string;
  description?: string;
  metricName: string;
  score: number;
  unit?: string;
  datasetName?: string;
  paperDoi?: string;
}

export class Benchmark extends Entity<BenchmarkProps> {
  private constructor(props: BenchmarkProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }
  public get description(): string | undefined {
    return this.props.description;
  }
  public get metricName(): string {
    return this.props.metricName;
  }
  public get score(): number {
    return this.props.score;
  }
  public get unit(): string | undefined {
    return this.props.unit;
  }
  public get datasetName(): string | undefined {
    return this.props.datasetName;
  }
  public get paperDoi(): string | undefined {
    return this.props.paperDoi;
  }

  public static create(
    props: {
      name: string;
      description?: string;
      metricName: string;
      score: number;
      unit?: string;
      datasetName?: string;
      paperDoi?: string;
    },
    id?: UniqueId,
  ): Result<Benchmark> {
    if (!props.name || !props.name.trim()) {
      return Result.fail<Benchmark>('Benchmark name is required.');
    }
    if (!props.metricName || !props.metricName.trim()) {
      return Result.fail<Benchmark>('Benchmark metric name is required.');
    }

    return Result.ok<Benchmark>(new Benchmark(props, id));
  }
}
