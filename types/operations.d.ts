import type { node, Prisma } from "@prisma/client";
import type { XOR } from "./helpers";


type moveOfAndWhereArgs = XOR<
	{ node: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild' | 'id'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
	& Omit<Prisma.nodeFindManyArgs, 'where'>;


export type movePositions = 'first-child' | 'last-child' | 'first-sibling' | 'left' | 'right' | 'last-sibling'

export type moveArgs = moveOfAndWhereArgs & { position: movePositions } & { reference: moveOfAndWhereArgs }
