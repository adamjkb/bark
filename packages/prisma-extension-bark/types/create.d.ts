import type { XOR } from "./helpers";
import {
	PrismaModelFunctionArgs as PMFArgs,
	PrismaModelProps as PMP,
	RequirePrismaModelTypeInput as RequirePMTInput
} from "./prisma";

export type createSiblingArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName, 'depth' | 'path'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	>
    & { data: Omit<PMFArgs<TModelName, 'create'>['data'], 'path'|'depth'|'numchild'> };

export type createChildArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName, 'depth' | 'path'| 'numchild'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	>
	& { data: Omit<PMFArgs<TModelName, 'create'>['data'], 'path' | 'depth' | 'numchild'> };

export type createRootArgs<TModelName extends PMP> = Omit<PMFArgs<TModelName, 'create'>, 'data'> & { data: Omit<PMFArgs<TModelName, 'create'>['data'], 'path' | 'depth' | 'numchild'> };
