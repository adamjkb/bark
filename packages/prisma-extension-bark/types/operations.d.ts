import type { XOR } from "./helpers";
import type { Prisma } from '@prisma/client'
import { RequiredKeysInInputNode } from "./prisma";


// move
type moveNodeAndWhereArgs<T, A> = XOR<
	{ node: RequiredKeysInInputNode<T, A, 'depth' | 'path' | 'numchild' | 'id'>; },
	Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>
>
export type moveArgs<T, A> = moveNodeAndWhereArgs<T, A> & { reference: moveNodeAndWhereArgs<T, A>} & { position: movePositions };
export type moveResult = undefined;

