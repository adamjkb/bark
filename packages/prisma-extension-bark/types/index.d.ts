import PrismaDefault, { type Prisma } from "@prisma/client/scripts/default-index.js";
import type { Types } from "@prisma/client/runtime/library.js";
import { PrismaModelProps } from "./prisma";
import { findAncestorsArgs, findChildrenArgs, findChildrenResult, findDescendantsArgs, findDescendantsResult, findLastRootNodeArgs, findLastRootNodeResult, findParentArgs, findParentResult, findSiblingsArgs, findSiblingsResult, findTreeArgs, findTreeResult } from "./find";
import { createChildArgs, createRootArgs, createSiblingArgs, createSiblingResult } from "./create";

type BarkInitArgs = {
	/**
	 * Name of models that are suitable to be managed by Bark
	 *
	 * Minimum required model: https://prisma-extension-bark.gitbook.io/docs/model-reference#minimum-required-model
	 */
	modelNames: PrismaModelProps[];
}

export declare function bark<I extends BarkInitArgs>(args: I): (client: any) => PrismaDefault.PrismaClientExtends<Types.Extensions.InternalArgs<{}, {
	readonly [K in (I['modelNames'] extends ReadonlyArray<infer U> ? U : never)]: {
		findLastRoot<T, A>(this: T, args: findLastRootNodeArgs<T,A>): Prisma.PrismaPromise<findLastRootNodeResult<T,A>>;
		findAncestors<T, A>(this: T, args: findAncestorsArgs<T,A>): Prisma.PrismaPromise< findAncestorsResult<T,A>>;
		findDescendants<T, A>(this: T, args: findDescendantsArgs<T,A>): Prisma.PrismaPromise<findDescendantsResult<T,A>>;
		findTree<T, A>(this: T, args: findTreeArgs<T,A>): Prisma.PrismaPromise< findTreeResult<T, A>>;
		findChildren<T, A>(this: T, args: findChildrenArgs<T, A>): Prisma.PrismaPromise<findChildrenResult<T, A>>;
		findSiblings<T, A>(this: T, args: findSiblingsArgs<T, A>): Prisma.PrismaPromise<findSiblingsResult<T, A>>;
		findParent<T, A>(this: T, args: findParentArgs<T, A>): Prisma.PrismaPromise<findParentResult<T, A>>;
		createChild<T, A>(this: T, args: createChildArgs<T, A>): Prisma.PrismaPromise<createChildResult<T, A>>;
		createSibling<T, A>(this: T, args: createSiblingArgs<T, A>): Prisma.PrismaPromise<createSiblingResult<T, A>>;
		createRoot<T, A>(this: T, args: createRootArgs<T, A>): Prisma.PrismaPromise<createRootResult<T, A>>;

		// TEMPLATE:
		// <T, A>(this: T, args: Args<T, A>): Prisma.PrismaPromise< Result<T, A>>
	}
}, {}, {}> & Types.Extensions.InternalArgs<{}, {}, {}, {}> & Types.Extensions.DefaultArgs>;
