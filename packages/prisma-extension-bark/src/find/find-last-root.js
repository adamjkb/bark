import { getPrisma } from '../get-prisma.js'
import { merge_where_args } from '../utils.js'


/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find.d.ts').findLastRootNodeArgs<T, A>} args
 * @returns {Promise<import('$types/find.d.ts').findLastRootNodeResult<T, A>>}
 */
export default async function (args) {
	const Prisma = await getPrisma(this)
	const ctx = Prisma.getExtensionContext(this)

	return ctx.findFirst({
		where: merge_where_args({
			depth: 1
		}, args?.where),
		...args,
		orderBy: {
			path: 'desc'
		}
	})
}
