import type PrismaDefault from "@prisma/client/scripts/default-index.d.ts";
import type { Types } from "@prisma/client/runtime/library.d.ts";
import { PrismaModelProps } from "./prisma.d.ts";
import { findAncestorsArgs, findChildrenArgs, findChildrenResult, findDescendantsArgs, findDescendantsResult, findLastRootNodeArgs, findLastRootNodeResult, findParentArgs, findParentResult, findSiblingsArgs, findSiblingsResult } from "./find.d.ts";
import { createChildArgs, createRootArgs, createSiblingArgs, createSiblingResult } from "./create.d.ts";
import { deleteManyNodesArgs, deleteManyNodesResult, deleteNodeArgs, deleteNodeResult } from "./delete.d.ts";
import { moveArgs, moveResult } from "./operations.d.ts";

type BarkInitArgs = {
	/**
	 * Name of models that are suitable to be managed by Bark
	 *
	 * Minimum required model: {@link https://prisma-extension-bark.gitbook.io/docs/model-reference#minimum-required-model}
	 */
	modelNames: PrismaModelProps[];
}

export type BarkFindMethods<PrismaPromise> = {
	findLastRoot<T, A>(this: T, args: findLastRootNodeArgs<T, A>): PrismaPromise<findLastRootNodeResult<T, A>>;
	findAncestors<T, A>(this: T, args: findAncestorsArgs<T, A>): PrismaPromise<findAncestorsResult<T, A>>;
	findDescendants<T, A>(this: T, args: findDescendantsArgs<T, A>): PrismaPromise<findDescendantsResult<T, A>>;
	findChildren<T, A>(this: T, args: findChildrenArgs<T, A>): PrismaPromise<findChildrenResult<T, A>>;
	findSiblings<T, A>(this: T, args: findSiblingsArgs<T, A>): PrismaPromise<findSiblingsResult<T, A>>;
	findParent<T, A>(this: T, args: findParentArgs<T, A>): PrismaPromise<findParentResult<T, A>>;
}

export type BarkCreateMethods<PrismaPromise> = {
	createChild<T, A>(this: T, args: createChildArgs<T, A>): PrismaPromise<createChildResult<T, A>>;
	createSibling<T, A>(this: T, args: createSiblingArgs<T, A>): PrismaPromise<createSiblingResult<T, A>>;
	createRoot<T, A>(this: T, args: createRootArgs<T, A>): PrismaPromise<createRootResult<T, A>>;
}

export type BarkDeleteMethods<PrismaPromise> = {
	deleteNode<T, A>(this: T, args: deleteNodeArgs<T, A>): PrismaPromise<deleteNodeResult<T, A>>;
	deleteManyNodes<T, A>(this: T, args: deleteManyNodesArgs<T, A>): PrismaPromise<deleteManyNodesResult<T, A>>;
}

export type BarkOperationsMethods<PrismaPromise> = {
	move<T, A>(this: T, args: moveArgs<T, A>): PrismaPromise<moveResult>
}

export type BarkMethods<PrismaPromise = any> = BarkFindMethods<PrismaPromise> & BarkCreateMethods<PrismaPromise> & BarkDeleteMethods<PrismaPromise> & BarkOperationsMethods<PrismaPromise>

/**
 * Extends Prisma Client with Bark
 *
 * Docs: {@link https://prisma-extension-bark.gitbook.io/docs/client-extension-api-reference#extend-a-prisma-client}
 *
 * @example
 * import { PrismaClient, Prisma } from '../generated/client'
 * const xprisma = new PrismaClient().$extends(withBark({
 *  modelNames: ['node']
 * })(Prisma))
 */
export declare function withBark<I extends BarkInitArgs>(args: I): <P extends {
	defineExtension: typeof PrismaDefault.Prisma.defineExtension;
	PrismaPromise: typeof PrismaDefault.Prisma.PrismaPromise;
}>(Prisma: P) => (client: any) => PrismaDefault.PrismaClientExtends<Types.Extensions.InternalArgs<{}, {
	readonly [K in (I['modelNames'] extends ReadonlyArray<infer U> ? U : never)]: BarkMethods<P['PrismaPromise']>
}, {}, {}> & Types.Extensions.InternalArgs<{}, {}, {}, {}> & Types.Extensions.DefaultArgs>;
