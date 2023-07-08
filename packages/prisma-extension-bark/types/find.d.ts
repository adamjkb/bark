import type { XOR } from "./helpers";
import {
	PrismaModelFunctionArgs as PMFArgs,
	PrismaModelProps as PMP,
	RequirePrismaModelTypeInput as RequirePMTInput
} from "./prisma";

export type findParentArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName, 'depth' | 'path'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	> & Omit<PMFArgs<TModelName, 'findUnique'>, 'where'>;


export type findSiblingsArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName,'depth' | 'path'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	> & Omit<PMFArgs<TModelName, 'findMany'>, 'where'>;

export type findChildrenArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName,'depth' | 'path' | 'numchild'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	> & Omit<PMFArgs<TModelName, 'findMany'>, 'where'>;

type findTreeParentOfAndWhereArgs<TModelName extends PMP> = XOR<
	{ node: RequirePMTInput<TModelName, 'depth' | 'path' | 'numchild'> }, Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>>;

export type findTreeArgs<TModelName extends PMP> = Omit<PMFArgs<TModelName, 'findMany'>, 'where'> & { parent?: findTreeParentOfAndWhereArgs<TModelName> };

export type findDescendantsArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName,'depth' | 'path' | 'numchild' | 'id'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	> & Omit<PMFArgs<TModelName, 'findMany'>, 'where'>;

export type findAncestorsArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName,'depth' | 'path'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	> & Omit<PMFArgs<TModelName, 'findMany'>, 'where'>;

export type findLastRootNodeArgs<TModelName extends PMP> = Omit<PMFArgs<TModelName, 'findFirst'>, 'where'>;
