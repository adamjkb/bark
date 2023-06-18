import type { page, Prisma } from "@prisma/client";
import type { XOR } from "./helpers";

export type findParentArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & Omit<Prisma.pageFindUniqueArgs, 'where'>;

export type findSiblingsArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & Omit<Prisma.pageFindManyArgs, 'where'>;
    
export type findChildrenArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path' | 'numchild'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & Omit<Prisma.pageFindManyArgs, 'where'>;

export type findDescendantsArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path' | 'numchild' | 'id'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & Omit<Prisma.pageFindManyArgs, 'where'>;
    
export type findAncestorsArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & Omit<Prisma.pageFindManyArgs, 'where'>;
    