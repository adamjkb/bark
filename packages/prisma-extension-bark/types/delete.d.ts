import {
	PrismaModelFunctionArgs as PMFArgs,
	PrismaModelProps as PMP,
	RequirePrismaModelTypeInput as RequirePMTInput
} from "./prisma";
import { XOR } from "./helpers";
import type { Prisma } from '@prisma/client'


// deleteNode
export type deleteNodeArgs<T, A> = XOR<
	{ node: RequiredKeysInInputNode<T, A, 'depth' | 'path'>; },
	Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>
> & Omit<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>;
export type deleteNodeResult<T, A> = Prisma.Result<T, A, 'deleteMany'>;

// deleteManyNodes
export type deleteManyNodesArgs<T, A> = Prisma.Args<T, 'deleteMany'>;
export type deleteManyNodesResult<T, A> = Prisma.Result<T, A, 'deleteMany'> | null;
