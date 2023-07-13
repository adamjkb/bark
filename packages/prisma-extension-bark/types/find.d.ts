import type { XOR } from "./helpers";
import {
	PrismaModelFunctionArgs as PMFArgs,
	PrismaModelFunctionResult as PMFResult,
	PrismaModelProps as PMP,
	RequirePrismaModelTypeInput as RequirePMTInput
} from "./prisma";

import type { Prisma } from '@prisma/client'

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


// findLastRoot

export type findLastRootNodeArgs<TModelName extends PMP> = Partial<Omit<PMFArgs<TModelName, 'findFirst'>, 'where'>>;

export type findLastRootNodeResult<TModelName extends PMP> = Promise<PMFResult<TModelName, 'findFirst'>>
