import type { XOR } from "./helpers.d.ts";
import type { Prisma } from '@prisma/client'
import { RequiredKeysInInputNode } from "./prisma.d.ts";


// move
type moveNodeAndWhereArgs<T, A> = XOR<
	{ node: RequiredKeysInInputNode<T, A, 'depth' | 'path' | 'numchild' | 'id'>; },
	Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>
>
type movePositions = 'first-child' | 'last-child' | 'first-sibling' | 'left' | 'right' | 'last-sibling'

export type moveArgs<T, A> = moveNodeAndWhereArgs<T, A> & { reference: moveNodeAndWhereArgs<T, A>} & { position: movePositions };
export type moveResult = undefined;

