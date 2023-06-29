import type { node, Prisma } from "@prisma/client";
import type { XOR } from "./helpers";

export type findParentArgs = XOR<
    { of: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindUniqueArgs, 'where'>;

export type findSiblingsArgs = XOR<
    { of: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindManyArgs, 'where'>;

export type findChildrenArgs = XOR<
    { of: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
		& Omit<Prisma.nodeFindManyArgs, 'where'>;

type findTreeOfAndWhereArgs = Omit<Prisma.nodeFindManyArgs, 'where'>;

type findTreeParentOfAndWhereArgs = XOR<
    { of: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>;

export type findTreeArgs = findTreeOfAndWhereArgs & { parent?: findTreeParentOfAndWhereArgs }

export type findDescendantsArgs = XOR<
    { of: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild' | 'id'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindManyArgs, 'where'>;

export type findAncestorsArgs = XOR<
    { of: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindManyArgs, 'where'>;

export type findLastRootNodeArgs =  Omit<Prisma.nodeFindFirstArgs, 'where'>;
