import {
	PrismaModelFunctionArgs as PMFArgs,
	PrismaModelProps as PMP,
	RequirePrismaModelTypeInput as RequirePMTInput
} from "./prisma";
import type { XOR } from "./helpers";


type moveOfAndWhereArgs<TModelName extends PMP> = XOR<
		{ node: RequirePMTInput<TModelName, 'depth' | 'path'| 'numchild' | 'id'> },
		Pick<PMFArgs<TModelName, 'findUnique'>, 'where'>
	>;

export type movePositions = 'first-child' | 'last-child' | 'first-sibling' | 'left' | 'right' | 'last-sibling'

export type moveArgs<TModelName extends PMP> = moveOfAndWhereArgs<TModelName> & { position: movePositions } & { reference: moveOfAndWhereArgs<TModelName> }
