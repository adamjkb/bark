import { Prisma } from '@prisma/client'

/**
 * @template {import('$types/prisma').PrismaModelProps} A
 *
 * @this {import('$types/extension').BarkExtensionContext<A>}
 * @param {import('$types/find').findLastRootNodeArgs<A>} args
 * @returns {import('$types/find').findLastRootNodeResult<A>}
 */
export default async function ({ ...args } = {}) {
	const ctx = Prisma.getExtensionContext(this)

	return ctx.findFirst({
		...args,
		where: {
			depth: 1
		},
		orderBy: {
			path: 'desc'
		}
	})
}
