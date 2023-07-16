import PrismaDefault, { type Prisma } from "@prisma/client/scripts/default-index.js";
import type { Types } from "@prisma/client/runtime/library.js";
import { PrismaModelProps } from "./prisma";
import { findAncestorsArgs, findLastRootNodeArgs, findLastRootNodeResult } from "./find";

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
		findLastRoot<T, A>(this: T, args: findLastRootNodeArgs<T,A>): Prisma.PrismaPromise<findLastRootNodeResult<T,A>>
		findAncestors<T, A>(this: T, args: findAncestorsArgs<T,A>): Prisma.PrismaPromise< findAncestorsResult<T,A>>
		// TEMPLATE:
		// <T, A>(this: T, args: Args<T,A>): Prisma.PrismaPromise< Result<T,A>>
	}
}, {}, {}> & Types.Extensions.InternalArgs<{}, {}, {}, {}> & Types.Extensions.DefaultArgs>;
