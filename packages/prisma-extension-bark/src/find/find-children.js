import { Prisma } from '@prisma/client'
import { default_order_by, max_segment, min_segment } from '../consts.js'
import { has_nullish, merge_where_args } from 'src/utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findChildrenArgs<T, A>} opts
 * @returns {Promise<import('$types/find').findChildrenResult<T, A>>}
 */
export default async function ({ node, orderBy = default_order_by, where, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.depth
	/** @type {number} */
	let numchild = node?.numchild

	// Check if all requirements are available
	if (has_nullish(path, depth, numchild)) {
		const target = await ctx.findUnique({
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
		} else {
			return null
		}
	}


	// forever alone / is leaf
	if (numchild === 0) {
		return null
	}

	const gt_path = path + min_segment
	const lte_path = path + max_segment


	return ctx.findMany({
		where: merge_where_args({
			depth: depth + 1,
			path: {
				gt: gt_path,
				lte: lte_path,
			},
		}, where),
		orderBy,
		...args
	})
}
