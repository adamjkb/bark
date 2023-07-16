import type { RequireKeys, XOR } from "./helpers";
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


// findAncestors
export type findAncestorsArgs<T, A> = XOR<
	{ node: RequireKeys<Prisma.Result<T, A, 'findFirst'>, 'depth' | 'path'>},
		Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>
	> & Omit<Prisma.Args<T, 'findMany'>, 'where'>;

export type findAncestorsResult<T, A> = Promise<Prisma.Result<T, A, 'findMany'> | null>;


// findLastRoot
export type findLastRootNodeArgs<T, A> = Prisma.Exact<A, Omit<Prisma.Args<T, 'findFirst'>, 'where'>> | void;

export type findLastRootNodeResult<T, A> = Promise<Prisma.Result<T, A, 'findFirst'>>;
