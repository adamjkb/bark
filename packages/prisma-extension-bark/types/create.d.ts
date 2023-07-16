import type { XOR } from "./helpers";
import {
	PrismaModelFunctionArgs as PMFArgs,
	PrismaModelProps as PMP,
	RequirePrismaModelTypeInput as RequirePMTInput,
	RequiredKeysInInputNode
} from "./prisma";

import type { Prisma } from '@prisma/client'


// createSibling
export type createSiblingArgs<T, A> = XOR<
	{ node: RequiredKeysInInputNode<T, A, 'depth' | 'path'>; },
	Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>
> & {
	data?: Omit<Prisma.Args<T, 'create'>['data'], 'path' | 'depth' | 'numchild'>
} & Omit<Prisma.Args<T, 'create'>, 'data'>;
export type createSiblingResult<T, A> = Prisma.Result<T, A, 'create'>;


// createChild
export type createChildArgs<T, A> = XOR<
	{ node: RequiredKeysInInputNode<T, A, 'depth' | 'path' | 'numchild'>; },
	Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>
> & {
	data?: Omit<Prisma.Args<T, 'create'>['data'], 'path' | 'depth' | 'numchild'>
} & Omit<Prisma.Args<T, 'create'>, 'data'>;
export type createChildResult<T, A> = Prisma.Result<T, A, 'create'>;


// createRoot
export type createRootArgs<T, A> = {
	data?: Omit<Prisma.Args<T, 'create'>['data'], 'path' | 'depth' | 'numchild'>
} & Omit<Prisma.Args<T, 'create'>, 'data'>;
export type createRootResult<T, A> = Prisma.Result<T, A, 'create'>;
