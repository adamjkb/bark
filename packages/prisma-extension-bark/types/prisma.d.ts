import { Prisma, PrismaClient } from "@prisma/client"
import { RequireKeys } from "./helpers";

/**
 * Model methods available in Prisma. (e.g. `prisma.node` or `prisma.user`)
 */
export type PrismaModelProps = Prisma.TypeMap['meta']['modelProps'];

// Types to dynamically acquire method `args` and `result` types through type mapping.
export type PrismaModelTypeMap<TModelName extends PrismaModelProps> = Pick<Prisma.TypeMap['model'], TModelName>;
export type PrismaModelFunction<TModelName extends PrismaModelProps, FnName extends Prisma.PrismaAction> = PrismaModelTypeMap<TModelName>[TModelName]['operations'][FnName];
/**
 * Arguments of a base Prisma Client method (e.g. `prisma.node.findFirst`)
 */
export type PrismaModelFunctionArgs<TModelName extends PrismaModelProps, FnName extends Prisma.PrismaAction> = PrismaModelFunction<TModelName, FnName>['args'];
/**
 * Result of a base Prisma Client method (e.g. `prisma.node.findFirst`)
 */
export type PrismaModelFunctionResult<TModelName extends PrismaModelProps, FnName extends Prisma.PrismaAction> = PrismaModelFunction<TModelName, FnName>['result'];

/**
 * Get Result for `node` argument input
 */
export type PrismaModelType<TModelName extends PrismaModelProps> = PrismaModelFunctionResult<TModelName, 'findUnique'>;

/**
 * Get Result for `node` argument input where some are required
 */
export type RequirePrismaModelTypeInput<TModelName extends PrismaModelProps, RKeys extends keyof PrismaModelType<TModelName>> = Partial<PrismaModelType<TModelName>> & Required<Pick<PrismaModelType<TModelName>, RKeys>>;


/**
 * Prisma's builtin functions for a model
 */
export type PrismaModelBuiltinFunctionKeys<TModelName extends PrismaModelProps> = keyof PrismaModelTypeMap<TModelName>[TModelName]['operations']

export type RequiredKeysInInputNode<T, A, K> = RequireKeys<Prisma.Result<T, A, 'findFirst'>, K>
