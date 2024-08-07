import { Prisma } from '@prisma/client'
import { default_order_by } from '../consts.js'
import { has_nullish, merge_where_args } from 'src/utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findDescendantsArgs<T, A>} args
 * @returns {Promise<import('$types/find').findDescendantsResult<T, A>>}
 */
export default async function ({ node, where, orderBy = default_order_by, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.depth
	/** @type {number} */
	let numchild = node?.numchild

	// Check if all requirements are available
	if (has_nullish(path, depth, numchild)) {
		const target = await ctx.findUniqueOrThrow({
			where: node,
			select: {
				path: true,
				depth: true,
				numchild: true
			}
		})
		if (target) {
			path = target.path
			depth = target.depth
			numchild = target.numchild
		}
	}


	// forever alone / is leaf
	if (numchild === 0) {
		return null
	}

	return ctx.findMany({
		where: merge_where_args({
			path: {
				startsWith: path,
				not: path
			},
			depth: {
				gte: depth
			}
		}, where),
		orderBy,
		...args
	})




}
