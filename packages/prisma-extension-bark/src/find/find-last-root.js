import { Prisma } from '@prisma/client'

/**
 * @template T
 * @template {import('$types/prisma').PrismaModelProps} A
 *
 * @this {T}
 * @param {import('$types/find').findLastRootNodeArgs<A>} args
 */
export default async function ({ ...args } = {}) {
	/** @type {any} */
	const model = Prisma.getExtensionContext(this)

	return model.findFirst({
		...args,
		where: {
			depth: 1
		},
		orderBy: {
			path: 'desc'
		}
	})
}
