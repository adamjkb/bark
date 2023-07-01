import type { Prisma } from "@prisma/client";
import { XOR } from "./helpers";

export type deleteNodeArgs = XOR<
    { node: Partial<page> & Required<Pick<page, 'depth' | 'path'>> }, Pick<Prisma.pageFindUniqueArgs, 'where'>>
    & Omit<Prisma.pageFindUniqueArgs, 'where'>;

export type deleteManyNodesArgs = Prisma.pageDeleteManyArgs
