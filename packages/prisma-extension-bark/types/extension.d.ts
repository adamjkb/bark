import { DefaultArgs } from "@prisma/client/runtime"
import { findAncestorsArgs, findChildrenArgs, findDescendantsArgs, findLastRootNodeArgs, findParentArgs, findSiblingsArgs, findTreeArgs } from "./find";
import { createChildArgs, createRootArgs, createSiblingArgs } from "./create";
import { deleteManyNodesArgs, deleteNodeArgs } from "./delete";
import { moveArgs } from "./operations";
import { PrismaModelProps } from "./prisma";


// Bark Methods start

export type BarkFindMethods<TModelName extends PrismaModelProps> = {
	findAncestors: (args: findAncestorsArgs<TModelName>) => Promise<any>;
	findChildren: (args: findChildrenArgs<TModelName>) => Promise<any>;
	findDescendants: (args: findDescendantsArgs<TModelName>) => Promise<any>;
	findLastRoot: (args: findLastRootNodeArgs<TModelName>) => Promise<any>;
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


export type BarkInitArgs = {
	/**
	 * Name of models that are suitable to be managed by Bark
	 *
	 * Minimum required model: https://prisma-extension-bark.gitbook.io/docs/model-reference#minimum-required-model
	 */
	modelNames: PrismaModelProps[]
}

type MapInputToBarkMethods<T extends ReadonlyArray<PrismaModelProps>> = {
	readonly [K in (T extends ReadonlyArray<infer U> ? U : never)]: BarkMethods<K>
};

export type BarkInitReturn<A extends BarkInitArgs = BarkInitArgs> = {
	$extends: {
		extArgs: DefaultArgs & {
			model: MapInputToBarkMethods<A['modelNames']>
		};
	};
}

export type BarkInitFn<A extends BarkInitArgs = BarkInitArgs> = (args: A) => BarkInitReturn<A>
