import { Prisma } from '@prisma/client'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findLastRootNodeArgs<T, A>} args
 * @returns {Promise<import('$types/find').findLastRootNodeResult<T, A>>}
 */
export default async function (args) {
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
