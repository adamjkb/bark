import { DefaultArgs, DynamicClientExtensionThis } from "@prisma/client/runtime"
import { findAncestorsArgs, findChildrenArgs, findDescendantsArgs, findLastRootNodeArgs, findParentArgs, findSiblingsArgs, findTreeArgs } from "./find";
import { createChildArgs, createRootArgs, createSiblingArgs } from "./create";
import { deleteManyNodesArgs, deleteNodeArgs } from "./delete";
import { moveArgs } from "./operations";
import { PrismaModelBuiltinFunctionKeys, PrismaModelFunction, PrismaModelFunctionArgs, PrismaModelFunctionResult, PrismaModelProps } from "./prisma";
import { Prisma } from "@prisma/client";


// Bark Methods start

export type BarkFindMethods<TModelName extends PrismaModelProps> = {
	findAncestors: (args: findAncestorsArgs<TModelName>) => Promise<any>;
	findChildren: (args: findChildrenArgs<TModelName>) => Promise<any>;
	findDescendants: (args: findDescendantsArgs<TModelName>) => Promise<any>;
	findLastRoot: (args: findLastRootNodeArgs<TModelName>) => findLastRootNodeArgs<TModelName>;
	findParent: (args: findParentArgs<TModelName>) => Promise<any>;
	findSiblings: (args: findSiblingsArgs<TModelName>) => Promise<any>;
	findTree: (args: findTreeArgs<TModelName>) => Promise<any>;
}

export type BarkCreateMethods<TModelName extends PrismaModelProps> = {
	createRoot: (args: createRootArgs<TModelName>) => Promise<any>;
	createChild: (args: createChildArgs<TModelName>) => Promise<any>;
	createSibling: (args: createSiblingArgs<TModelName>) => Promise<any>;
}

export type BarkDeleteMethods<TModelName extends PrismaModelProps> = {
	deleteNode: (args: deleteNodeArgs<TModelName>) => Promise<any>;
	deleteManyNodes: (args: deleteManyNodesArgs<TModelName>) => Promise<any>;
}

export type BarkOperationsMethods<TModelName extends PrismaModelProps> = {
	move: (args: moveArgs<TModelName>) => Promise<undefined>;
}

/**
 * Available methods provided by Bark
 */
export type BarkMethods<T extends PrismaModelProps> =
	BarkFindMethods<T> &
	BarkCreateMethods<T> &
	BarkDeleteMethods<T> &
	BarkOperationsMethods<T>;




type MapInputToBarkMethods<T extends ReadonlyArray<PrismaModelProps>> = {
	readonly [K in (T extends ReadonlyArray<infer U> ? U : never)]: BarkMethods<K>
};

export type BarkInitReturn<A extends BarkInitArgs = BarkInitArgs> = (client: any) => {
	$extends: {
		extArgs: DefaultArgs & {
			model: MapInputToBarkMethods<A['modelNames']>;
		};
	};
}

export type BarkInitFn<A extends BarkInitArgs = BarkInitArgs> = (args: A) => BarkInitReturn<A>;


/**
 * Bark extension context
 * The builtin functions are specific to the test environment (SQLite)
 * which is technically the smallest subset of available functions
 * the `getExtensionContext` method exposes other ones too + "fields"
 * @deprecated INTERNAL USE ONLY
 */
export type BarkExtensionContext<T extends PrismaModelProps> = BarkMethods<T> & {
	[F in PrismaModelBuiltinFunctionKeys<T>]: (args: PrismaModelFunctionArgs<T, F>) => Prisma.PrismaPromise<PrismaModelFunctionResult<T, F>>
}
