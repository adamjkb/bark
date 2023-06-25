import type { page, Prisma } from "@prisma/client";
import type { XOR } from "./helpers";

export type createSiblingArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & { data: Omit<Prisma.pageUncheckedCreateInput, 'path'|'depth'|'numchild'> };

export type createChildArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path' | 'numchild'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & { data: Omit<Prisma.pageUncheckedCreateInput, 'path'|'depth'|'numchild'> };