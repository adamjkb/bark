import type { node, Prisma } from "@prisma/client";
import type { XOR } from "./helpers";

export type createSiblingArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path'>> }, Pick<Prisma.nodeFindUniqueOrThrowArgs, 'where'>>
    & { data: Omit<Prisma.nodeUncheckedCreateInput, 'path'|'depth'|'numchild'> };

export type createChildArgs = XOR<
    { node: Partial<node> & Required<Pick<node, 'depth' | 'path' | 'numchild'>> }, Pick<Prisma.nodeFindUniqueOrThrowArgs, 'where'>>
    & { data: Omit<Prisma.nodeUncheckedCreateInput, 'path'|'depth'|'numchild'> };

export type createRootArgs = Omit<Prisma.nodeCreateArgs, 'data'> & { data: Omit<Prisma.nodeUncheckedCreateInput, 'path'|'depth'|'numchild'> };
