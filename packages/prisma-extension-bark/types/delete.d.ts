import { Rename, XOR } from "./helpers.d.ts";
import type { Prisma } from '@prisma/client'
import { RequiredKeysInInputNode } from "./prisma.d.ts";


// deleteNode
export type deleteNodeArgs<T, A> = XOR<
	{ node: RequiredKeysInInputNode<T, A, 'depth' | 'path'>; },
	Rename<Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>, 'where', 'node'>
> & Omit<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>;
export type deleteNodeResult<T, A> = Prisma.Result<T, A, 'deleteMany'>;

// deleteManyNodes
export type deleteManyNodesArgs<T, A> = Prisma.Args<T, 'deleteMany'>;
export type deleteManyNodesResult<T, A> = Prisma.Result<T, A, 'deleteMany'> | null;
