import type { Rename, XOR } from "./helpers.d.ts";
import type { Prisma } from '@prisma/client'
import { RequiredKeysInInputNode } from "./prisma.d.ts";


// move
type moveNodeAndWhereArgs<T, A, Key extends string = 'node'> = XOR<
	Record<Key, RequiredKeysInInputNode<T, A, 'depth' | 'path' | 'numchild' | 'id'>>,
	Rename<Pick<Prisma.Args<T, 'findUniqueOrThrow'>, 'where'>, 'where', Key>
>
type movePositions = 'first-child' | 'last-child' | 'first-sibling' | 'left' | 'right' | 'last-sibling'

export type moveArgs<T, A> = moveNodeAndWhereArgs<T, A, 'node'> & moveNodeAndWhereArgs<T, A, 'referenceNode'> & { position: movePositions };
export type moveResult = undefined;

