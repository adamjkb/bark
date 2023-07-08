import {
	PrismaModelFunctionArgs as PMFArgs,
	PrismaModelProps as PMP,
	RequirePrismaModelTypeInput as RequirePMTInput
} from "./prisma";
import { XOR } from "./helpers";

export type deleteNodeArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName, 'depth' | 'path'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	>
	& Omit<PMFArgs<TModelName, 'findUnique'>, 'where'>;

export type deleteManyNodesArgs<TModelName extends PMP> = PMFArgs<TModelName, 'deleteMany'>
