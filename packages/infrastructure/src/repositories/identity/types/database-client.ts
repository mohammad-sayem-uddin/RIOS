/**
 * Database client type abstraction for the ResearchIdentity repository.
 *
 * Architecture reference:
 * Infrastructure Layer — Database Strategy.
 *
 * This interface defines the shape of operations the repository needs
 * from the underlying database client. Concrete implementations map
 * to PrismaClient, Drizzle, Knex, etc.
 *
 * This abstraction:
 * - Decouples the repository from Prisma-specific types.
 * - Enables testing with mock clients.
 * - Allows swapping database technologies without changing repository logic.
 */

/**
 * Shape of the ResearchIdentity table operations.
 * Maps to Prisma's model delegate pattern.
 */
export interface ResearchIdentityDelegate<
  TRecord,
  TFindManyArgs,
  TFindUniqueArgs,
  TUpsertArgs,
  TDeleteArgs,
> {
  findMany(args: TFindManyArgs): Promise<TRecord[]>;
  findUnique(args: TFindUniqueArgs): Promise<TRecord | null>;
  upsert(args: TUpsertArgs): Promise<TRecord>;
  delete(args: TDeleteArgs): Promise<TRecord>;
}

/**
 * Minimal Prisma-like client shape required by the repository.
 *
 * Implementations cast DatabaseProvider.getClient() to this type.
 * The type parameters allow test environments to provide mock types.
 */
export interface PrismaClientLike {
  researchIdentity: ResearchIdentityDelegate<
    unknown,
    {
      where?: Record<string, unknown>;
      include?: Record<string, unknown>;
      orderBy?: Record<string, unknown>;
    },
    { where: { id: string }; include?: Record<string, unknown> },
    {
      where: { id: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    },
    { where: { id: string } }
  >;
}
