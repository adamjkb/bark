import type { Prisma } from "@prisma/client";
import { XOR } from "./helpers";

type deleteFlags = 'skipMPLogic'

export type deleteNodeArgs = XOR<
    { of: Partial<page> & Required<Pick<page, 'depth' | 'path'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & Omit<Prisma.pageFindUniqueArgs, 'where'>;

export type deleteManyNodesArgs = Prisma.pageDeleteManyArgs