import { Prisma } from '@prisma/client'
import { default_order_by, max_segment, min_segment } from '../consts.js'
import { has_nullish, merge_where_args, path_from_depth } from '../utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findSiblingsArgs<T, A>} args
 * @returns {Promise<import('$types/find').findSiblingsResult<T, A>>}
 */
export default async function ({ node, where, orderBy = default_order_by, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.depth

	// Check if all requirements are available
	if (has_nullish(path, depth)) {
		const target = await ctx.findUniqueOrThrow({
			where: node,
			select: {
				path: true,
				depth: true
			}
		})
		if (target) {
			path = target.path
			depth = target.depth
		}
	}

	if (depth === 1) {
		// get the whole depth
		return ctx.findMany({
			where: { depth },
			orderBy,
			...args
		})
	}

	if (depth > 1) {
		// making sure the non-root nodes share a parent
		const parent_path = path_from_depth({ path, depth: depth - 1 })
		const gt_path = parent_path + min_segment
		const lte_path = parent_path + max_segment

		return ctx.findMany({
			where: merge_where_args({
				depth,
				path: {
					gt: gt_path,
					lte: lte_path,
				},
			}, where),
			orderBy,
			...args
		})
	}
}
