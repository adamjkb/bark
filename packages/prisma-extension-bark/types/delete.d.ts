import type { Prisma, node } from "@prisma/client";
import { XOR } from "./helpers";

export type deleteNodeArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueArgs, 'where'>>
    & Omit<Prisma.nodeFindUniqueArgs, 'where'>;

export type deleteManyNodesArgs = Prisma.nodeDeleteManyArgs
