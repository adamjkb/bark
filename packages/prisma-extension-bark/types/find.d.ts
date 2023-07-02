import type { node, Prisma } from "@prisma/client";
import type { XOR } from "./helpers";

export type findParentArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindUniqueArgs, 'where'>;

export type findSiblingsArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindManyArgs, 'where'>;

export type findChildrenArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
		& Omit<Prisma.nodeFindManyArgs, 'where'>;

type findTreeOfAndWhereArgs = Omit<Prisma.nodeFindManyArgs, 'where'>;

type findTreeParentOfAndWhereArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>;

export type findTreeArgs = findTreeOfAndWhereArgs & { parent?: findTreeParentOfAndWhereArgs }

export type findDescendantsArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild' | 'id'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindManyArgs, 'where'>;

export type findAncestorsArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindManyArgs, 'where'>;

export type findLastRootNodeArgs =  Omit<Prisma.nodeFindFirstArgs, 'where'>;
